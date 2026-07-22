import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { feedEngine } from '../services/FeedEngine';
import { databaseService } from '../services/databaseService';

const FeedContext = createContext();

export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Keep track of which videos the user has seen in this session
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      feedEngine.init();
      
      const initialLoad = async () => {
        setIsLoading(true);
        
        // Native Database Videos first (merged logic)
        let nativeVids = [];
        try {
          const list = await databaseService.getVideos();
          // Filter out YouTube shorts from databaseService.getVideos since FeedEngine handles them now.
          nativeVids = list.filter(v => v.source !== 'youtube');
        } catch (e) {
          console.warn("Failed to fetch native videos", e);
        }

        // Make sure FeedEngine has at least 30 videos
        if (feedEngine.videoCache.length < 30) {
          await feedEngine.prefetchVideos(30);
        }

        const queue = feedEngine.getQueue(10);
        const combined = [...nativeVids, ...queue];
        
        // Shuffle the combined initial load
        const newArray = [...combined];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }

        setVideos(newArray);
        setIsLoading(false);
      };

      initialLoad();
    }
  }, []);

  const loadMoreVideos = useCallback(async () => {
    // If we are nearing the end of our current in-memory videos array, grab more from FeedEngine
    if (videos.length - currentIndex < 10) {
      const moreVideos = feedEngine.getQueue(10);
      if (moreVideos.length > 0) {
        setVideos(prev => [...prev, ...moreVideos]);
      } else {
        // Force a prefetch if empty and WAIT for it
        await feedEngine.prefetchVideos(30);
        const freshVideos = feedEngine.getQueue(10);
        if (freshVideos.length > 0) {
          setVideos(prev => [...prev, ...freshVideos]);
        }
      }
    }
  }, [videos.length, currentIndex]);

  useEffect(() => {
    loadMoreVideos();
  }, [currentIndex, loadMoreVideos]);

  return (
    <FeedContext.Provider value={{ videos, currentIndex, setCurrentIndex, isLoading }}>
      {children}
    </FeedContext.Provider>
  );
};
