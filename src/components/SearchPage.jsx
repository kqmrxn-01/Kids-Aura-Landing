import React, { useState, useEffect } from 'react';
import { Search, Film, Sparkles, TrendingUp, Heart, Eye, X, UserCheck, UserPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { databaseService } from '../services/databaseService';

const getPseudoDuration = (id) => {
  let sum = 0;
  const str = String(id || '');
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  const sec = (sum % 30) + 30; // 30s to 59s
  return `0:${sec}`;
};

export default function SearchPage({ onSelectCreator }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [creators, setCreators] = useState([]);
  const [videos, setVideos] = useState([]);
  const [followingStates, setFollowingStates] = useState({});
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Debouncing search queries by 300ms
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load database metadata
  const loadSearchData = async () => {
    try {
      // 1. Load creators list
      const usersList = await databaseService.getUsers();
      const hydratedCreators = [];
      const followObj = {};
      const currentUser = databaseService.getCurrentUser();

      for (const u of usersList) {
        if (u.username === 'kid_explorer') continue;
        const profile = await databaseService.getCreatorProfile(u.username);
        const following = await databaseService.isFollowing(u.id);
        followObj[u.id] = following;

        hydratedCreators.push({
          id: u.id,
          username: u.username || '',
          displayName: u.display_name || u.displayName || 'Creator',
          avatarUrl: u.avatar_url || u.avatarUrl || '?',
          followersCount: profile.followersCount || 0,
          verified: true
        });
      }
      setCreators(hydratedCreators);
      setFollowingStates(followObj);

      // 2. Load suggested videos
      const list = await databaseService.getVideos();
      setVideos(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSearchData();
  }, []);

  const handleFollowToggle = async (e, creatorId) => {
    e.stopPropagation();
    const res = await databaseService.toggleFollow(creatorId);
    if (res.success) {
      setFollowingStates(prev => ({
        ...prev,
        [creatorId]: res.following
      }));
      setCreators(prevCreators => 
        prevCreators.map(c => 
          c.id === creatorId 
            ? { ...c, followersCount: res.following ? c.followersCount + 1 : c.followersCount - 1 }
            : c
        )
      );
    }
  };

  const tags = ['Science', 'Animals', 'Funny', 'Life Skills', 'Gaming'];

  // 1. Filter videos (when empty state is displayed)
  const filteredVideos = videos.filter((video) => {
    const matchesTag = selectedTag ? video.category === selectedTag : true;
    return matchesTag;
  });

  // 2. Filter matching videos by query (when searching is active)
  const searchResults = videos.filter((video) => {
    const q = debouncedQuery.toLowerCase();
    const titleAndDesc = `${video.title} ${video.description} ${video.category}`.toLowerCase();
    return titleAndDesc.includes(q);
  });

  const currentUser = databaseService.getCurrentUser();

  return (
    <div className="subview-container">
      {/* Search Input Bar */}
      <div className="search-bar-row">
        <Search size={18} className="search-bar-icon" />
        <input
          type="text"
          placeholder="Search safe educational videos..."
          className="search-bar-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading && <RefreshCw size={14} className="loader-spinner text-slate-400" />}
      </div>

      {/* RENDER VIEW 1: SUGGESTED REELS (EMPTY SEARCH) */}
      {!searchQuery.trim() ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Suggested tags pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#a0a0b0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Popular Tags
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setSelectedTag(null)}
                className={`category-pill ${selectedTag === null ? 'active' : ''}`}
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                All Tags
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`category-pill ${tag === selectedTag ? 'active' : ''}`}
                  style={{ fontSize: '11px', padding: '6px 12px' }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Reels Grid: 2 columns grid of vertical rectangular reels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#a0a0b0' }}>
              Suggested Reels ({filteredVideos.length})
            </span>
            
            <div className="suggested-reels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {filteredVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="profile-video-card"
                  onClick={() => setSelectedVideo(video)}
                  style={{ 
                    cursor: 'pointer', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative'
                  }}
                >
                  {/* Aspect Ratio 9/16 vertical card wrapper */}
                  <div 
                    className="grid-media-placeholder" 
                    style={{ 
                      width: '100%', 
                      aspectRatio: '9/16', 
                      height: 'auto',
                      position: 'relative', 
                      background: 'rgba(0,0,0,0.2)', 
                      overflow: 'hidden',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    {video.poster ? (
                      <img 
                        src={video.poster} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                      />
                    ) : (
                      <Film size={28} style={{ color: 'rgba(255,255,255,0.15)' }} />
                    )}
                    <span className="video-card-badge" style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 2, fontSize: '8px', padding: '2px 6px' }}>{video.category}</span>
                    
                    {/* Views & duration overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '6px',
                      right: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.85)',
                      background: 'rgba(0,0,0,0.5)',
                      padding: '2px 6px',
                      borderRadius: '8px'
                    }}>
                      <span className="flex-center-gap"><Eye size={8} /> {video.viewsCount || 0}</span>
                      <span>{getPseudoDuration(video.id)}</span>
                    </div>
                  </div>

                  <div style={{ padding: '8px', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {video.title}
                    </h4>
                    
                    {/* Link opens creator profile directly */}
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCreator(video.creator);
                      }}
                      style={{ fontSize: '10px', color: 'var(--primary-teal)', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {video.creator}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* RENDER VIEW 2: SEARCH VIDEO RESULTS (WHEN TYPING) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#a0a0b0' }}>
            Found {searchResults.length} videos matching "{searchQuery}"
          </span>

          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={32} style={{ color: 'var(--primary-coral)' }} />
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>No Videos Found</span>
              <span style={{ fontSize: '11px', color: '#666' }}>Try searching for science, animals, or painting!</span>
            </div>
          ) : (
            <div className="suggested-reels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {searchResults.map((video) => (
                <div 
                  key={video.id} 
                  className="profile-video-card"
                  onClick={() => setSelectedVideo(video)}
                  style={{ 
                    cursor: 'pointer', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative'
                  }}
                >
                  {/* Aspect Ratio 9/16 vertical card wrapper */}
                  <div 
                    className="grid-media-placeholder" 
                    style={{ 
                      width: '100%', 
                      aspectRatio: '9/16', 
                      height: 'auto',
                      position: 'relative', 
                      background: 'rgba(0,0,0,0.2)', 
                      overflow: 'hidden',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    {video.poster ? (
                      <img 
                        src={video.poster} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                      />
                    ) : (
                      <Film size={28} style={{ color: 'rgba(255,255,255,0.15)' }} />
                    )}
                    <span className="video-card-badge" style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 2, fontSize: '8px', padding: '2px 6px' }}>{video.category}</span>
                    
                    {/* Views & duration overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '6px',
                      right: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.85)',
                      background: 'rgba(0,0,0,0.5)',
                      padding: '2px 6px',
                      borderRadius: '8px'
                    }}>
                      <span className="flex-center-gap"><Eye size={8} /> {video.viewsCount || 0}</span>
                      <span>{getPseudoDuration(video.id)}</span>
                    </div>
                  </div>

                  <div style={{ padding: '8px', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {video.title}
                    </h4>
                    
                    {/* Link opens creator profile directly */}
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCreator(video.creator);
                      }}
                      style={{ fontSize: '10px', color: 'var(--primary-teal)', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {video.creator}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Vertical Reels Player Modal (Reels Aspect Ratio) */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div 
            className="modal-content profile-video-modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              background: '#000', 
              padding: 0, 
              width: '90%', 
              maxWidth: '340px',
              height: '80vh',
              aspectRatio: '9/16',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}
          >
            {/* Absolute close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            {/* Vertical Video / IFrame Element */}
            {selectedVideo.source === 'youtube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.url}?autoplay=1&controls=1&loop=1&playlist=${selectedVideo.url}`}
                title={selectedVideo.title}
                style={{ border: 'none', width: '100%', height: '100%' }}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <video 
                src={selectedVideo.url} 
                autoPlay 
                controls 
                loop
                playsInline
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            )}
            
            {/* Info overlay */}
            <div style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '16px', 
              color: 'white', 
              background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              textAlign: 'left'
            }}>
              <h4 style={{ fontFamily: 'var(--font-kids)', margin: 0, fontSize: '15px', color: '#ffe66d' }}>{selectedVideo.title}</h4>
              <span style={{ fontSize: '11px', color: 'var(--primary-teal)', fontWeight: 'bold' }}>{selectedVideo.creator}</span>
              <p style={{ fontSize: '11px', color: '#ccc', marginTop: '4px', lineHeight: '1.4' }}>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
