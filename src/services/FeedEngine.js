import { LoggerService } from './LoggerService';
import { AiModerationService } from './AiModerationService';

// The massive educational topics list as requested
const EDUCATIONAL_TOPICS = [
  'Science', 'Space', 'Astronomy', 'Animals', 'Nature', 'Wildlife', 'Ocean', 'Dinosaurs',
  'History', 'Geography', 'Countries', 'Flags', 'Earth', 'Solar System', 'Physics',
  'Chemistry', 'Biology', 'Math', 'Mental Math', 'Coding', 'Programming', 'AI', 'STEM',
  'Engineering', 'DIY', 'Craft', 'Origami', 'Drawing', 'Painting', 'Alphabet', 'Numbers',
  'English', 'Hindi', 'Vocabulary', 'Grammar', 'Reading', 'Writing', 'Storytelling',
  'Fairy Tales', 'Moral Stories', 'Nursery Rhymes', 'Educational Cartoons', 'Brain Games',
  'IQ', 'Memory Games', 'Fun Facts', 'General Knowledge', 'Healthy Habits', 'Life Skills',
  'Exercise', 'Yoga', 'Dance', 'Music', 'Cooking for Kids', 'School Experiments'
];

// Utility to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// YouTube ISO 8601 Duration Parser
const parseISO8601Duration = (durationString) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = (durationString || '').match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return (hours * 3600) + (minutes * 60) + seconds;
};

class SmartFeedEngine {
  constructor() {
    this.videoCache = [];
    this.watchedHistory = new Set();
    this.fetchPromise = null;
    this.pageTokens = {}; // Maps category -> nextPageToken
    this.availableTopics = shuffleArray(EDUCATIONAL_TOPICS);
  }

  // Restore watched history from local storage
  init() {
    try {
      const history = JSON.parse(localStorage.getItem('kidsaura_watched_history')) || [];
      this.watchedHistory = new Set(history);
      
      const cached = JSON.parse(localStorage.getItem('kidsaura_feed_cache')) || [];
      this.videoCache = cached;
      LoggerService.info('FeedEngine', `Initialized with ${this.watchedHistory.size} history and ${this.videoCache.length} cached videos.`);
    } catch (e) {
      LoggerService.warn('FeedEngine', 'Failed to initialize from localStorage', e);
    }
  }

  // Pick a random un-exhausted topic
  getNextTopic() {
    if (this.availableTopics.length === 0) {
      this.availableTopics = shuffleArray(EDUCATIONAL_TOPICS);
    }
    return this.availableTopics.pop();
  }

  // Persist state to prevent dupes across sessions
  saveState() {
    try {
      // Keep only last 500 watched history
      const historyArr = Array.from(this.watchedHistory).slice(-500);
      localStorage.setItem('kidsaura_watched_history', JSON.stringify(historyArr));
      
      // Keep up to 100 cached videos
      const cacheToSave = this.videoCache.slice(0, 100);
      localStorage.setItem('kidsaura_feed_cache', JSON.stringify(cacheToSave));
    } catch (e) {
      LoggerService.error('FeedEngine', 'Failed to save state', e);
    }
  }

  markAsWatched(videoId) {
    this.watchedHistory.add(videoId);
    this.saveState();
  }

  // Main fetch loop. Fetches videos until we have enough or we hit the API hard.
  async prefetchVideos(targetCount = 30) {
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = (async () => {
      const startTime = Date.now();
      let fetchedCount = 0;
      let emptyAttempts = 0; // Prevent infinite loops if API fails

      try {
        while (this.videoCache.length < targetCount && emptyAttempts < 5) {
          const topic = this.getNextTopic();
          const pageToken = this.pageTokens[topic] || '';
          
          const newVideos = await this.fetchFromYouTube(topic, pageToken);
          
          if (newVideos.length === 0) {
            emptyAttempts++;
            continue; 
          }
          
          // Reset attempts if we got data
          emptyAttempts = 0;

          const validNewVideos = newVideos.filter(v => {
            // Prevent duplicates
            const isDupe = this.watchedHistory.has(v.id) || this.videoCache.some(existing => existing.id === v.id);
            return !isDupe;
          });

          this.videoCache = [...this.videoCache, ...validNewVideos];
          this.videoCache = shuffleArray(this.videoCache);
          fetchedCount += validNewVideos.length;
          this.saveState();

          if (fetchedCount >= 15) {
            // Break early if we got a good chunk, to let the UI breathe
            break;
          }
        }
      } finally {
        this.fetchPromise = null;
        const loadTime = Date.now() - startTime;
        LoggerService.logFeedStats(this.videoCache.length, loadTime);
      }
    })();

    return this.fetchPromise;
  }

  // Low-level YouTube API call using our secure Vercel Serverless Backend
  async fetchFromYouTube(topic, pageToken) {
    // Determine the base URL depending on if we are running locally (Vite proxy) or in production on Vercel
    // If the frontend is deployed on GitHub Pages and backend on Vercel, this needs to be an absolute URL.
    // For now, assume it's deployed on Vercel together, or we use a relative path if supported.
    // We will use an environment variable or default to relative path.
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    
    let url = `${backendUrl}/api/youtube?topic=${encodeURIComponent(topic)}`;
    if (pageToken) url += `&pageToken=${pageToken}`;

    LoggerService.logApiFetch(topic, url);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        LoggerService.error('BackendAPI', `Error: ${data.error}`);
        return [];
      }

      this.pageTokens[topic] = data.nextPageToken || null;
      
      const safeVideos = data.videos || [];
      LoggerService.info('FeedEngine', `Backend Query "${topic}" returned ${safeVideos.length} safe videos.`);
      
      return safeVideos;

    } catch (e) {
      LoggerService.error('BackendAPI', 'Network/Fetch exception', e);
      return [];
    }
  }

  // Gets the next video and triggers prefetch if running low
  getNextVideo() {
    if (this.videoCache.length < 30) {
      // Trigger background prefetch, but don't await it
      this.prefetchVideos(100);
    }
    
    if (this.videoCache.length > 0) {
      const video = this.videoCache.shift();
      this.markAsWatched(video.id);
      return video;
    }
    
    return null; // Empty, wait for prefetch
  }

  getQueue(count) {
    if (this.videoCache.length < 30) {
      this.prefetchVideos(100);
    }
    const chunk = this.videoCache.splice(0, count);
    chunk.forEach(v => this.markAsWatched(v.id));
    return chunk;
  }
}

export const feedEngine = new SmartFeedEngine();
