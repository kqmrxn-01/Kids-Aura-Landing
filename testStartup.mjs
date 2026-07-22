// Mock DOM globals
global.window = {};
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};
global.fetch = async (url) => {
  console.log("Mock fetch called for URL:", url);
  if (url.includes('search')) {
    return {
      json: async () => ({
        items: [
          { id: { videoId: 'mock1' }, snippet: { title: 'Test', description: 'Test', channelId: 'ch1', channelTitle: 'Chan' } }
        ]
      })
    };
  }
  if (url.includes('videos')) {
    return {
      json: async () => ({
        items: [
          { id: 'mock1', contentDetails: { duration: 'PT30S' }, snippet: { title: 'Test', description: 'Test', channelId: 'ch1', channelTitle: 'Chan' } }
        ]
      })
    };
  }
  return {
    json: async () => ({ items: [] })
  };
};

console.log("Starting import verification...");
import('./src/services/databaseService.js').then(async (m) => {
  const service = m.databaseService;
  console.log("Database service loaded successfully!");
  try {
    const videos = await service.getVideos();
    console.log("getVideos executed successfully, returned count:", videos.length);
    console.log("Videos details:", videos);
    process.exit(0);
  } catch (e) {
    console.error("CRASH IN getVideos():", e);
    process.exit(1);
  }
}).catch(e => {
  console.error("CRASH DURING IMPORT:", e);
  process.exit(1);
});
