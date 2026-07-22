import React, { useState, useEffect } from 'react';
import { ChevronLeft, UserCheck, UserPlus, Shield, Heart, Eye, Calendar, Sparkles, Trash2, X } from 'lucide-react';
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

export default function CreatorProfile({ username, onBack }) {
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadProfile = async () => {
    const res = await databaseService.getCreatorProfile(username);
    setProfile(res);
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  // Sync follow states
  useEffect(() => {
    const checkFollow = async () => {
      if (profile) {
        const following = await databaseService.isFollowing(profile.id);
        setIsFollowing(following);
      }
    };
    checkFollow();
  }, [profile]);

  const handleFollowToggle = async () => {
    const res = await databaseService.toggleFollow(profile.id);
    if (res.success) {
      setIsFollowing(res.following);
      loadProfile(); // Reload stats
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const confirm = window.confirm("Are you sure you want to delete this video? This action cannot be undone.");
    if (confirm) {
      const res = await databaseService.deleteVideo(videoId);
      if (res.success) {
        alert("Video deleted successfully.");
        await loadProfile(); // Reload creator feed
      }
    }
  };

  if (!profile) {
    return (
      <div className="subview-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading profile for {username}...</p>
        <button className="btn-styled" onClick={onBack} style={{ marginTop: '10px' }}>
          Go Back
        </button>
      </div>
    );
  }

  const currentUser = databaseService.getCurrentUser();

  return (
    <div className="subview-container">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onBack} 
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            color: 'white',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="subview-title" style={{ margin: 0 }}>@{profile.username}</h2>
      </div>

      {/* Profile Card details */}
      <div className="card-panel" style={{ gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-teal)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(78,205,196,0.3)'
          }}>
            {profile.avatarUrl}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{profile.displayName}</span>
            <span style={{ fontSize: '12px', color: '#ffe66d' }} className="flex-center-gap"><Sparkles size={12} /> KidSafe Creator</span>
          </div>

          {/* Follow toggle button */}
          {profile.id !== currentUser.id && (
            <button 
              className="btn-styled" 
              onClick={handleFollowToggle}
              style={{
                width: 'auto',
                padding: '10px 16px',
                borderRadius: '16px',
                background: isFollowing ? 'rgba(255,255,255,0.08)' : 'var(--primary-teal)',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isFollowing ? (
                <span className="flex-center-gap"><UserCheck size={14} /> Following</span>
              ) : (
                <span className="flex-center-gap"><UserPlus size={14} /> Follow</span>
              )}
            </button>
          )}
        </div>

        {/* Bio description */}
        <p style={{ fontSize: '13px', color: '#a0a0b0', margin: 0 }}>
          {profile.bio || "No biography provided. Friendly creator on Kids Aura!"}
        </p>

        {/* Stats Grid */}
        <div className="profile-stats-bar">
          <div className="stat-unit">
            <span className="num">{profile.followersCount}</span>
            <span className="lbl">Followers</span>
          </div>
          <div className="stat-unit">
            <span className="num">{profile.followingCount}</span>
            <span className="lbl">Following</span>
          </div>
          <div className="stat-unit">
            <span className="num">{profile.totalLikes}</span>
            <span className="lbl">Likes</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#555' }}>
          <Calendar size={12} /> Joined {profile.joinedDate}
        </div>
      </div>

      {/* Videos feed grid list */}
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 className="card-title">Creator Feed ({profile.videos.length})</h3>

        {profile.videos.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', padding: '30px 0', fontSize: '13px' }}>
            This creator has not published any safe shorts yet.
          </div>
        ) : (
          <div className="profile-video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {profile.videos.map((vid) => (
              <div 
                key={vid.id} 
                className="profile-video-card"
                onClick={() => setSelectedVideo(vid)}
                style={{ 
                  cursor: 'pointer', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '14px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative'
                }}
              >
                {/* Visual content placeholder inside grid element (Vertical Reels 9/16 Aspect Ratio) */}
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
                  {vid.poster ? (
                    <img 
                      src={vid.poster} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                  ) : (
                    <Sparkles size={20} className="status-checking" style={{ color: 'var(--primary-teal)' }} />
                  )}
                  <span className="video-card-badge" style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 2, fontSize: '8px', padding: '2px 6px' }}>{vid.category}</span>
                  
                  {/* Creator Delete button overlay (Only for own videos) */}
                  {profile.id === currentUser.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(vid.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'rgba(255,118,117,0.85)',
                        border: 'none',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 5,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}

                  {/* Views count and Duration overlay */}
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
                    <span className="flex-center-gap"><Eye size={8} /> {vid.viewsCount || 0}</span>
                    <span>{getPseudoDuration(vid.id)}</span>
                  </div>
                </div>
                
                <div style={{ padding: '8px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                    {vid.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '9px', color: '#666' }}>
                    <span className="flex-center-gap" style={{ color: 'var(--primary-coral)' }}><Heart size={10} fill="var(--primary-coral)" /> {vid.likesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid Video Playback Modal Overlay (Vertical Reels 9/16 Aspect Ratio) */}
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

            {/* Vertical Video Element */}
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
              <span style={{ fontSize: '11px', color: 'var(--primary-teal)', fontWeight: 'bold' }}>{profile.displayName}</span>
              <p style={{ fontSize: '11px', color: '#ccc', marginTop: '4px', lineHeight: '1.4' }}>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
