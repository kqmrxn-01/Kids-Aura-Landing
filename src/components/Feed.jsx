import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import ReelCard from './ReelCard';
import CommentsSheet from './CommentsSheet';
import { useFeed } from '../context/FeedContext';
import { LoggerService } from '../services/LoggerService';

export default function Feed({ onTrackTime, selectedCategories, blocklist, onSelectCreator, onRequestAuth }) {
  const { videos, currentIndex, setCurrentIndex, isLoading } = useFeed();
  const [muted, setMuted] = useState(true);
  const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
  
  const containerRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Filter feed locally based on parent controls (since feedEngine doesn't know about local parent settings)
  const filteredVideos = React.useMemo(() => {
    return videos.filter(video => {
      // If parent has selected specific categories, ensure video matches (skip for YouTube shorts as they are auto-fetched, or include if matching)
      if (selectedCategories && selectedCategories.length > 0 && video.source !== 'youtube') {
        if (!selectedCategories.includes(video.category)) return false;
      }
      
      if (blocklist && blocklist.length > 0) {
        const checkText = `${video.title} ${video.description}`.toLowerCase();
        if (blocklist.some(word => word.trim() !== '' && checkText.includes(word.toLowerCase()))) {
          return false;
        }
      }
      return true;
    });
  }, [videos, selectedCategories, blocklist]);

  // Handle active video scrolling
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          if (!isNaN(index) && index !== currentIndexRef.current) {
            setCurrentIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const cards = containerRef.current?.querySelectorAll('.reel-wrapper') || [];
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredVideos.length, setCurrentIndex]);

  const handleToggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const handleOpenComments = useCallback((id) => {
    setActiveCommentVideoId(id);
  }, []);

  if (isLoading && filteredVideos.length === 0) {
    return (
      <div className="feed-viewport">
        <div className="video-loading">
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ fontFamily: 'var(--font-kids)', marginTop: '20px', color: '#fff' }}>Loading Safe Shorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-viewport">
      {filteredVideos.length === 0 ? (
        <div className="video-loading">
          <AlertCircle size={40} className="status-failed" />
          <p style={{ fontFamily: 'var(--font-kids)', fontSize: '16px', color: '#fff' }}>No child-friendly videos found!</p>
          <p style={{ padding: '0 40px', textAlign: 'center', fontSize: '12px', color: '#a0a0b0' }}>
            Check your parental settings or wait for background fetch.
          </p>
        </div>
      ) : (
        <div className="reels-container" ref={containerRef}>
          {(() => {
            console.log("=== FEED DIAGNOSTICS ===");
            console.log("Total feed length (filteredVideos):", filteredVideos.length);
            console.log("Current index:", currentIndex);
            const renderedCards = filteredVideos.filter((_, i) => i >= currentIndex - 1 && i <= currentIndex + 2).length;
            console.log("Rendered actual cards (isWithinWindow):", renderedCards);
            return null;
          })()}
          {filteredVideos.map((video, index) => {
            // VIRTUALIZATION LOGIC:
            // Render only: previous (currentIndex - 1), current (currentIndex), next two (currentIndex + 1, currentIndex + 2)
            // For all others, render a lightweight spacer div to maintain CSS scroll snapping and scroll height perfectly.
            const isWithinWindow = index >= currentIndex - 1 && index <= currentIndex + 2;
            const isActive = index === currentIndex;

            if (!isWithinWindow) {
              return (
                <div 
                  key={video.id} 
                  className="reel-wrapper" 
                  data-index={index}
                  style={{ height: '100%', width: '100%', scrollSnapAlign: 'start' }} 
                />
              );
            }

            return (
              <div 
                key={video.id}
                className="reel-wrapper"
                data-index={index}
                style={{ height: '100%', width: '100%', scrollSnapAlign: 'start', position: 'relative' }}
              >
                <ReelCard 
                  video={video}
                  isActive={isActive}
                  muted={muted}
                  onToggleMute={handleToggleMute}
                  onOpenComments={handleOpenComments}
                  onSelectCreator={onSelectCreator}
                  onRequestAuth={onRequestAuth}
                  onLogTime={onTrackTime}
                />
              </div>
            );
          })}
        </div>
      )}

      {activeCommentVideoId && (
        <CommentsSheet 
          videoId={activeCommentVideoId}
          onClose={() => setActiveCommentVideoId(null)}
          onRequestAuth={onRequestAuth}
        />
      )}
    </div>
  );
}
