import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Heart, MessageSquare, Users, Video, Clock, Award, Bell } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function CreatorAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await databaseService.getCreatorAnalytics();
      setAnalytics(data);
    };
    loadData();
  }, []);

  if (!analytics) {
    return (
      <div className="subview-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading Creator Analytics...</p>
      </div>
    );
  }

  return (
    <div className="subview-container">
      <h2 className="subview-title">
        <BarChart3 size={24} style={{ color: 'var(--primary-teal)' }} />
        Creator Studio
      </h2>
      <p className="subview-desc">
        Real-time insights on your video library and subscriber activities.
      </p>

      {/* Analytics Core Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Eye size={18} style={{ color: 'var(--primary-teal)' }} />
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Total Views</span>
          <span className="stat-value teal">{analytics.totalViews}</span>
        </div>

        <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Heart size={18} style={{ color: 'var(--primary-coral)' }} />
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Video Likes</span>
          <span className="stat-value coral">{analytics.totalLikes}</span>
        </div>

        <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={18} style={{ color: 'var(--primary-yellow)' }} />
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Comments</span>
          <span className="stat-value" style={{ color: 'var(--primary-yellow)' }}>{analytics.commentsReceived}</span>
        </div>

        <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Users size={18} style={{ color: 'var(--primary-purple)' }} />
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Followers</span>
          <span className="stat-value" style={{ color: 'var(--primary-purple)' }}>{analytics.followersGained}</span>
        </div>

        <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Video size={18} style={{ color: 'var(--primary-pink)' }} />
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Uploads</span>
          <span className="stat-value" style={{ color: 'var(--primary-pink)' }}>{analytics.videosCount}</span>
        </div>

        <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <Clock size={18} style={{ color: '#0984e3' }} />
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Watch Time</span>
          <span className="stat-value" style={{ color: '#0984e3' }}>{analytics.watchTimeMinutes}m</span>
        </div>
      </div>

      {/* Top Video Panel */}
      <div className="card-panel">
        <h3 className="card-title">
          <Award size={16} /> Most Popular Video
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>
            {analytics.mostViewedVideo}
          </span>
          <span style={{
            fontSize: '11px',
            background: 'rgba(78, 205, 196, 0.15)',
            color: 'var(--primary-teal)',
            padding: '4px 10px',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            Highest Views
          </span>
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="card-panel">
        <h3 className="card-title">
          <Bell size={16} /> Recent Interactions
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '220px',
          overflowY: 'auto'
        }}>
          {analytics.recentActivities.length === 0 ? (
            <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
              No recent notifications to log.
            </span>
          ) : (
            analytics.recentActivities.map((act) => (
              <div 
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-pink))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {act.senderAvatar}
                </div>
                
                <div style={{ flex: 1, fontSize: '12px' }}>
                  <strong style={{ color: 'white' }}>{act.senderName}</strong>
                  {act.type === 'follow' && ' followed you'}
                  {act.type === 'like' && ` liked your video "${act.videoTitle}"`}
                  {act.type === 'comment' && ` commented on "${act.videoTitle}"`}
                  {act.type === 'reply' && ` replied to your comment on "${act.videoTitle}"`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
