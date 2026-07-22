import React, { useState, useEffect } from 'react';
import { Bell, Heart, UserPlus, MessageSquare, CornerDownRight, CheckSquare } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      // Load notifications
      const list = await databaseService.getNotifications();
      setNotifications(list);
      
      // Automatically mark notifications as read when opening inbox
      await databaseService.markNotificationsAsRead();
    };
    loadData();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={16} fill="var(--primary-coral)" style={{ color: 'var(--primary-coral)' }} />;
      case 'follow': return <UserPlus size={16} style={{ color: 'var(--primary-teal)' }} />;
      case 'comment': return <MessageSquare size={16} style={{ color: 'var(--primary-yellow)' }} />;
      case 'reply': return <CornerDownRight size={16} style={{ color: 'var(--primary-purple)' }} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="subview-container">
      <h2 className="subview-title">
        <Bell size={24} style={{ color: 'var(--primary-pink)' }} />
        Inbox Alerts
      </h2>
      <p className="subview-desc">
        Activity logs showing who has liked your content, written comments, or subscribed to your feed.
      </p>

      <div className="card-panel" style={{ padding: '16px 20px', gap: '10px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '60px 0', fontSize: '13px' }}>
            Your inbox is empty. Share or publish videos to get actions! 🎈🚀
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: notif.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  position: 'relative'
                }}
              >
                {/* Red dot for unread notifications */}
                {!notif.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--primary-coral)',
                    boxShadow: '0 0 6px var(--primary-coral)'
                  }} />
                )}

                {/* Sender Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-pink), var(--primary-coral))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {notif.senderAvatar}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    {getIcon(notif.type)}
                    <span style={{ color: '#aaa' }}>{notif.senderUsername}</span>
                  </div>
                  
                  <p style={{ fontSize: '13px', color: '#fff', lineHeight: '1.4' }}>
                    <strong style={{ color: '#ffe66d' }}>{notif.senderName}</strong>
                    {notif.type === 'follow' && ' followed you!'}
                    {notif.type === 'like' && ` liked your video "${notif.videoTitle}"`}
                    {notif.type === 'comment' && ` commented on your video "${notif.videoTitle}"`}
                    {notif.type === 'reply' && ` replied to your comment on "${notif.videoTitle}"`}
                  </p>
                  
                  <span style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>
                    {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
