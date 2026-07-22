export const LoggerService = {
  logLevel: 'debug', // 'none', 'error', 'warn', 'info', 'debug'

  log: (level, context, message, data = null) => {
    const levels = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };
    if (levels[level] <= levels[LoggerService.logLevel]) {
      const timestamp = new Date().toISOString().substring(11, 23);
      const prefix = `[${timestamp}] [${context}]`;
      
      switch (level) {
        case 'error':
          console.error(prefix, message, data || '');
          break;
        case 'warn':
          console.warn(prefix, message, data || '');
          break;
        case 'info':
          console.info(prefix, message, data || '');
          break;
        case 'debug':
          console.log(prefix, message, data || '');
          break;
      }
    }
  },

  debug: (context, msg, data) => LoggerService.log('debug', context, msg, data),
  info: (context, msg, data) => LoggerService.log('info', context, msg, data),
  warn: (context, msg, data) => LoggerService.log('warn', context, msg, data),
  error: (context, msg, data) => LoggerService.log('error', context, msg, data),
  
  // Specific event loggers as requested by user
  logApiFetch: (query, url) => {
    LoggerService.info('YouTubeAPI', `Fetching query: "${query}"`, { url });
  },
  
  logApiResults: (query, count, nextPageToken) => {
    LoggerService.info('YouTubeAPI', `Results for "${query}": ${count} items. Next page: ${nextPageToken ? 'YES' : 'NO'}`);
  },

  logVideoProcessing: (videoId, duration, accepted, reason = '') => {
    if (accepted) {
      LoggerService.debug('Moderation', `✅ ACCEPTED: ${videoId} (Duration: ${duration}s)`);
    } else {
      LoggerService.warn('Moderation', `❌ REJECTED: ${videoId} (Duration: ${duration}s) - Reason: ${reason}`);
    }
  },

  logFeedStats: (cacheSize, loadingTime) => {
    LoggerService.info('FeedEngine', `Stats - Cache: ${cacheSize}, Load Time: ${loadingTime}ms`);
  }
};
