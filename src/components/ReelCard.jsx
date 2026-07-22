import React, { useState, useRef, useEffect, memo } from 'react';
import { Heart, Volume2, VolumeX, Play, Pause, MessageCircle, Sparkles, UserPlus, UserCheck, Bookmark, Share2, Flag, MoreVertical } from 'lucide-react';
import { databaseService } from '../services/databaseService';

// Extract the individual Reel component and memoize it to prevent re-renders of the entire feed list
const ReelCard = memo(({ 
  video, 
  isActive, 
  muted, 
  onToggleMute, 
  onOpenComments, 
  onSelectCreator, 
  onRequestAuth,
  onLogTime
}) => {
  const [heartBursts, setHeartBursts] = useState([]);
  const [showPlayState, setShowPlayState] = useState(null);
  const [isLiked, setIsLiked] = useState(video.liked || false);
  const [likesCount, setLikesCount] = useState(video.likesCount || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState(false);

  const videoRef = useRef(null);
  const lastTap = useRef({ time: 0 });
  const playStartTime = useRef(null);

  // Initialize async state (saved, following, liked)
  useEffect(() => {
    const initData = async () => {
      try {
        const saved = await databaseService.isSaved(video.id);
        setIsSaved(saved);
        
        if (video.creatorId && video.creatorId !== 'youtube') {
          const following = await databaseService.isFollowing(video.creatorId);
          setIsFollowing(following);
        }
      } catch (e) {
        console.warn("Failed to load reel async state", e);
      }
    };
    initData();
  }, [video.id, video.creatorId]);

  // Handle active/inactive auto-playback
  useEffect(() => {
    const isYouTube = video.id.startsWith('yt-');
    
    if (isActive) {
      playStartTime.current = Date.now();
      
      if (!isYouTube && videoRef.current) {
        videoRef.current.play().catch(e => console.warn('Auto-play blocked:', e));
      }
      databaseService.incrementViewCount(video.id);
      databaseService.addWatchHistory(video.id, video.title);
    } else {
      if (!isYouTube && videoRef.current) {
        videoRef.current.pause();
      }
      
      // Log watch duration when moving away from active
      if (playStartTime.current) {
        const elapsedSecs = Math.round((Date.now() - playStartTime.current) / 1000);
        if (elapsedSecs > 0) {
          onLogTime(video.category, elapsedSecs);
        }
        playStartTime.current = null;
      }
    }
  }, [isActive, video.id, video.category, onLogTime]);

  const triggerStateOverlay = (state) => {
    setShowPlayState(state);
    const timeout = setTimeout(() => setShowPlayState(null), 800);
    return () => clearTimeout(timeout);
  };

  const handleVideoTap = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    const timeDiff = now - lastTap.current.time;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (timeDiff < DOUBLE_PRESS_DELAY) {
      handleLike();
      
      const newBurst = { id: now, x, y };
      setHeartBursts(prev => [...prev, newBurst]);
      setTimeout(() => {
        setHeartBursts(prev => prev.filter(burst => burst.id !== newBurst.id));
      }, 700);
    } else {
      // Single tap -> Play/Pause
      const isYouTube = video.id.startsWith('yt-');
      if (isYouTube) {
        // Iframe relies on standard playing state since we can't control it easily without YouTube JS API.
        // We simulate pause visually if needed, or rely on double tap only.
        triggerStateOverlay('play');
      } else if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          triggerStateOverlay('play');
        } else {
          videoRef.current.pause();
          triggerStateOverlay('pause');
        }
      }
    }

    lastTap.current = { time: now };
  };

  const handleLike = async () => {
    if (onRequestAuth && !onRequestAuth('Like')) return;
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    await databaseService.toggleLike(video.id);
  };

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (onRequestAuth && !onRequestAuth('Follow')) return;
    const res = await databaseService.toggleFollow(video.creatorId);
    if (res.success) {
      setIsFollowing(res.following);
    }
  };

  const handleSave = async () => {
    if (onRequestAuth && !onRequestAuth('Save')) return;
    const res = await databaseService.toggleSave(video.id);
    if (res.success) {
      setIsSaved(res.saved);
    }
    setOpenMenu(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`Check out this fun video: ${video.title}`);
        alert('Video link copied to clipboard! 🔗');
      }
    } catch (err) {
      console.warn(err);
    }
    setOpenMenu(false);
  };

  const handleReport = async () => {
    const confirm = window.confirm('Report this video as inappropriate for kids?');
    if (confirm) {
      await databaseService.reportVideo(video.id);
      alert('Thank you for reporting. This video will be removed upon refresh.');
    }
    setOpenMenu(false);
  };

  return (
    <div className="reel-card" data-id={video.id}>
      <div className="video-tap-area" onClick={handleVideoTap} />

      {video.source === 'youtube' ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
          {isActive ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.url}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${video.url}&modestbranding=1&rel=0&showinfo=0`}
              title={video.title}
              className="reel-video youtube-reel-frame"
              style={{ border: 'none', width: '100%', height: '100%', pointerEvents: 'none' }}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <img src={video.poster} alt="Video Poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      ) : (
        <video
          ref={videoRef}
          className="reel-video"
          src={video.url}
          poster={video.poster}
          loop
          playsInline
          muted={muted}
          preload={isActive ? "auto" : "none"}
        />
      )}

      {showPlayState && (
        <div className="state-overlay">
          {showPlayState === 'play' && <Play size={32} fill="white" />}
          {showPlayState === 'pause' && <Pause size={32} fill="white" />}
          {showPlayState === 'mute' && <VolumeX size={32} />}
          {showPlayState === 'unmute' && <Volume2 size={32} />}
        </div>
      )}

      {heartBursts.map(burst => (
        <div key={burst.id} className="heart-burst" style={{ left: burst.x - 25, top: burst.y - 25 }}>
          <Heart size={50} fill="var(--primary-coral)" />
        </div>
      ))}

      {/* Action Sidebar */}
      <div className="reel-actions" style={{ gap: '16px' }}>
        <div className="action-item" onClick={handleLike}>
          <button className={`action-btn ${isLiked ? 'liked' : ''}`}>
            <Heart size={24} fill={isLiked ? "var(--primary-coral)" : "none"} />
          </button>
          <span className="action-label">{likesCount}</span>
        </div>

        <div className="action-item" onClick={() => onOpenComments(video.id)}>
          <button className="action-btn">
            <MessageCircle size={24} />
          </button>
          <span className="action-label">💬</span>
        </div>

        <div className="action-item" style={{ position: 'relative' }} onClick={(e) => { e.stopPropagation(); setOpenMenu(!openMenu); }}>
          <button className="action-btn">
            <MoreVertical size={24} />
          </button>
          <span className="action-label">More</span>
          {openMenu && (
            <div onClick={e => e.stopPropagation()} style={{
              position: 'absolute', right: '44px', bottom: '0',
              background: 'rgba(20,20,30,0.97)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '130px', zIndex: 999,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
              <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: isSaved ? 'var(--primary-yellow)' : 'white', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <Bookmark size={16} fill={isSaved ? 'var(--primary-yellow)' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <Share2 size={16} /> Share
              </button>
              <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#e74c3c', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <Flag size={16} /> Report
              </button>
            </div>
          )}
        </div>

        <div className="action-item" onClick={(e) => {
          e.stopPropagation();
          onToggleMute();
          triggerStateOverlay(muted ? 'unmute' : 'mute');
        }}>
          <button className="action-btn">
            {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <span className="action-label">{muted ? 'Muted' : 'Sound'}</span>
        </div>
      </div>

      {/* Overlaid Metadata */}
      <div className="reel-overlay">
        <div className="reel-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="reel-creator" onClick={() => onSelectCreator(video.creator)} style={{ cursor: 'pointer' }}>
              <span className="creator-avatar">
                {video.creator.substring(1, 2).toUpperCase()}
              </span>
              {video.creator}
            </div>

            {video.creatorId !== 'youtube' && !isFollowing && (
              <button onClick={handleFollow} style={{ background: 'var(--primary-teal)', border: 'none', borderRadius: '12px', color: 'white', padding: '3px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <UserPlus size={10} /> Follow
              </button>
            )}
          </div>
          
          <div className="reel-description" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setExpandedDesc(!expandedDesc); }}>
            {expandedDesc ? (
              <span>{video.title} - {video.description}</span>
            ) : (
              <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.title}</span>
            )}
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginLeft: '4px' }}>{expandedDesc ? ' less' : ' ...more'}</span>
          </div>
          <div className="reel-category">
            <Sparkles size={11} /> {video.category.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReelCard;
