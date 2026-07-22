// api/youtube.js
// Vercel Serverless Function to hide the YouTube API Key and proxy requests

const parseISO8601Duration = (durationString) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = (durationString || '').match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return (hours * 3600) + (minutes * 60) + seconds;
};

// Simplified child-safe filter for the backend
const moderateMetadata = (title, description) => {
  const checkText = `${title || ''} ${description || ''}`.toLowerCase();
  
  const violentTerms = ['fight', 'punch', 'combat', 'kill', 'blood', 'hurt', 'dead', 'stab', 'murder', 'shoot', 'war', 'battle', 'gore'];
  const weaponTerms = ['gun', 'weapon', 'knife', 'sword', 'bomb', 'sniper', 'rifle'];
  const adultTerms = ['nudity', 'sexy', 'adult', 'nsfw', 'drug', 'smoke', 'vape', 'gamble', 'alcohol', 'beer', 'wine', 'porn', '18+', 'horny'];
  const profanityTerms = ['swear', 'vulgar', 'curse', 'stupid', 'jerk', 'ass', 'bastard', 'bitch', 'fuck', 'shit', 'damn'];
  const relationshipTerms = ['boyfriend', 'girlfriend', 'dating', 'crush', 'relationship', 'kiss', 'couple', 'love story', 'date night', 'romantic'];
  const politicsTerms = ['politics', 'democrat', 'republican', 'election', 'president', 'government', 'protest', 'riot', 'trump', 'biden', 'modi'];
  const religionTerms = ['religion', 'god', 'jesus', 'allah', 'islam', 'hindu', 'christian', 'muslim', 'church', 'mosque', 'temple'];
  const hateSpeechTerms = ['hate', 'racist', 'nazi', 'supremacist', 'terrorist', 'slur'];
  const scaryTerms = ['scary', 'horror', 'ghost', 'demon', 'creepy', 'monster', 'terrifying', 'nightmare'];
  const dangerousTerms = ['challenge', 'prank', 'dangerous', 'don\\'t try this at home', 'fire challenge', 'choking'];

  if (violentTerms.some(word => checkText.includes(word))) return { passed: false };
  if (weaponTerms.some(word => checkText.includes(word))) return { passed: false };
  if (adultTerms.some(word => checkText.includes(word))) return { passed: false };
  if (profanityTerms.some(word => checkText.includes(word))) return { passed: false };
  if (relationshipTerms.some(word => checkText.includes(word)) || /\b(bf|gf)\b/i.test(checkText)) return { passed: false };
  if (politicsTerms.some(word => checkText.includes(word))) return { passed: false };
  if (religionTerms.some(word => checkText.includes(word))) return { passed: false };
  if (hateSpeechTerms.some(word => checkText.includes(word))) return { passed: false };
  if (scaryTerms.some(word => checkText.includes(word))) return { passed: false };
  if (dangerousTerms.some(word => checkText.includes(word))) return { passed: false };

  return { passed: true };
};

export default async function handler(req, res) {
  // CORS headers so frontend can talk to backend securely
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { topic, pageToken } = req.query;
  const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key is missing on the server.' });
  }

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    const query = `kids ${topic} educational #shorts`;
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=short&maxResults=25&key=${apiKey}`;
    if (pageToken) url += `&pageToken=${pageToken}`;

    // 1. Fetch initial search results
    const searchRes = await fetch(url);
    const searchData = await searchRes.json();

    if (searchData.error) {
      return res.status(500).json({ error: searchData.error.message });
    }

    if (!searchData.items || searchData.items.length === 0) {
      return res.status(200).json({ videos: [], nextPageToken: searchData.nextPageToken });
    }

    const videoIds = searchData.items.map(i => i.id.videoId).filter(Boolean);
    if (videoIds.length === 0) {
       return res.status(200).json({ videos: [], nextPageToken: searchData.nextPageToken });
    }

    // 2. Fetch video details for duration mapping
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    const safeVideos = [];

    for (const item of (detailsData.items || [])) {
      const durationSec = parseISO8601Duration(item.contentDetails?.duration);
      const title = item.snippet?.title || '';
      const description = item.snippet?.description || '';
      
      const mod = moderateMetadata(title, description);
      const validDuration = durationSec >= 10 && durationSec <= 180;

      if (mod.passed && validDuration) {
        safeVideos.push({
          id: `yt-${item.id}`,
          title,
          description,
          creatorId: item.snippet?.channelId,
          creator: `@${(item.snippet?.channelTitle || 'YouTubeCreator').replace(/\s+/g, '')}`,
          category: topic,
          url: item.id,
          poster: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
          likesCount: Math.floor(Math.random() * 500) + 100,
          viewsCount: Math.floor(Math.random() * 5000) + 500,
          duration: durationSec,
          source: 'youtube'
        });
      }
    }

    return res.status(200).json({
      videos: safeVideos,
      nextPageToken: searchData.nextPageToken || null
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
