import React, { useState, useEffect } from 'react';
import { Film, Search, UploadCloud, BarChart3, Bell, Settings2, User, Check, AlertCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

import { databaseService } from './services/databaseService';
import Feed from './components/Feed';
import SearchPage from './components/SearchPage';
import CreatorPortal from './components/CreatorPortal';
import CreatorProfile from './components/CreatorProfile';
import CreatorAnalytics from './components/CreatorAnalytics';
import NotificationsCenter from './components/NotificationsCenter';
import ParentDashboard from './components/ParentDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'search', 'upload', 'analytics', 'notifications', 'parent', 'profile'
  const [activeProfileCreator, setActiveProfileCreator] = useState(null); // `@username`
  
  // Parental Settings state (loaded from databaseService)
  const [selectedCategories, setSelectedCategories] = useState(['Science', 'Animals', 'Funny', 'Life Skills', 'Gaming']);
  const [blocklist, setBlocklist] = useState([]);
  const [watchStats, setWatchStats] = useState({});
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Username creation state
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regBio, setRegBio] = useState('');
  const [authAction, setAuthAction] = useState('');

  const handleRequestAuth = (action) => {
    if (currentUser?.username === 'kid_explorer') {
      setAuthAction(action);
      setShowRegisterModal(true);
      return false;
    }
    return true;
  };
  const [usernameCheck, setUsernameCheck] = useState({ checked: false, available: false, reason: '' });

  // Load configuration from database on mount
  const refreshDbState = async () => {
    try {
      const current = databaseService.getCurrentUser();
      setCurrentUser(current);
      
      const users = await databaseService.getUsers();
      setSelectedCategories(users.find(u => u.username === 'kid_explorer') ? ['Science', 'Animals', 'Funny', 'Life Skills', 'Gaming'] : ['Science', 'Animals', 'Funny', 'Life Skills', 'Gaming']);
      
      // Load parent blocklist and categories
      const stats = databaseService.getWatchStats();
      setWatchStats(stats);

      // Filter unread notifications
      const notifs = await databaseService.getNotifications();
      const unread = notifs.filter(n => !n.isRead).length;
      setUnreadNotifications(unread);
    } catch (e) {
      console.error("Error refreshing database state:", e);
    }
  };

  useEffect(() => {
    refreshDbState();
    
    // Default categories & blocklist loaded
    setBlocklist(['fight', 'kill', 'swear']);
  }, []);

  // Sync Android immersive full screen status bar
  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.hide();
        } catch (err) {
          console.warn('Status bar hidden fail', err);
        }
      }
    };
    initCapacitor();
  }, []);

  // Update screen watch logs
  const handleTrackTime = async (category, seconds) => {
    await databaseService.logWatchDuration(category, seconds);
    setWatchStats(databaseService.getWatchStats());
  };

  // Navigations to profile views
  const handleSelectCreator = (creatorHandle) => {
    setActiveProfileCreator(creatorHandle);
    setActiveTab('profile');
  };

  // Check username availability while typing
  useEffect(() => {
    if (!regUsername.trim()) {
      setUsernameCheck({ checked: false, available: false, reason: '' });
      return;
    }
    const checkAvailability = async () => {
      const check = await databaseService.isUsernameAvailable(regUsername);
      setUsernameCheck({ checked: true, available: check.available, reason: check.reason || 'Username is available!' });
    };
    checkAvailability();
  }, [regUsername]);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (!usernameCheck.available) return;

    const res = await databaseService.createUser(regUsername, regDisplayName, regBio);
    if (res.success) {
      // Modify Guest Explorer user representation to active user
      const users = await databaseService.getUsers();
      const updated = users.map(u => 
        u.username === 'kid_explorer' ? { ...u, username: regUsername.toLowerCase(), displayName: regDisplayName, bio: regBio, avatarUrl: regUsername.substring(0, 1).toUpperCase() } : u
      );
      localStorage.setItem('kidsaura_users', JSON.stringify(updated));
      
      alert('Creator account established successfully!');
      setShowRegisterModal(false);
      await refreshDbState();
      
      setRegUsername('');
      setRegDisplayName('');
      setRegBio('');
    } else {
      alert(`Registration Failed: ${res.reason}`);
    }
  };

  // Sync allowed categories toggles
  const handleToggleCategory = (category) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category];
      return updated;
    });
  };

  const handleAddBlockWord = (word) => {
    if (!blocklist.includes(word.toLowerCase())) {
      setBlocklist(prev => [...prev, word.toLowerCase()]);
    }
  };

  const handleRemoveBlockWord = (word) => {
    setBlocklist(prev => prev.filter(w => w !== word));
  };

  // Bouncy background shapes
  const [bubbles, setBubbles] = useState([]);
  useEffect(() => {
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 40,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 8
    }));
    setBubbles(list);
  }, []);

  return (
    <>
      {/* Floating Bubbles */}
      <div className="bubble-bg">
        {bubbles.map(b => (
          <div 
            key={b.id} 
            className="bubble" 
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`
            }}
          />
        ))}
      </div>

      {/* Main Full-Screen App Container */}
      <div className="app-container">
        {/* Custom Bubbly Redesigned Logo Header */}
        <header className="app-header">
          <div className="app-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 100 100" width="34" height="34" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.2))' }}>
              <defs>
                <linearGradient id="auraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff85a2" />
                  <stop offset="50%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ffe66d" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#auraGrad)" />
              <circle cx="50" cy="50" r="32" fill="#4ecdc4" />
              <circle cx="38" cy="45" r="4" fill="#1a1a24" />
              <circle cx="62" cy="45" r="4" fill="#1a1a24" />
              <circle cx="40" cy="43" r="1" fill="#ffffff" />
              <circle cx="64" cy="43" r="1" fill="#ffffff" />
              <path d="M 38,58 Q 50,70 62,58" fill="none" stroke="#1a1a24" strokeWidth="4" strokeLinecap="round" />
              <circle cx="30" cy="52" r="3" fill="#ff85a2" opacity="0.8" />
              <circle cx="70" cy="52" r="3" fill="#ff85a2" opacity="0.8" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-kids)',
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '-0.3px',
              background: 'linear-gradient(to right, #ff85a2, #ffe66d, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Kids Aura
            </span>
          </div>
          
          <div className="header-actions">
            {currentUser && currentUser.username === 'kid_explorer' ? (
              <button 
                className="btn-header"
                onClick={() => setShowRegisterModal(true)}
                title="Create Account"
                style={{ background: 'var(--primary-teal)', width: 'auto', padding: '0 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
              >
                <User size={14} /> Register
              </button>
            ) : (
              <span style={{ fontSize: '11px', color: '#a0a0b0', alignSelf: 'center', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '10px' }}>
                @{currentUser?.username}
              </span>
            )}
          </div>
        </header>

        {/* Dynamic Views Navigation Routing */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTab === 'feed' && (
            <Feed 
              videos={null} 
              onTrackTime={handleTrackTime}
              selectedCategories={selectedCategories}
              blocklist={blocklist}
              onSelectCreator={handleSelectCreator}
              onRequestAuth={handleRequestAuth}
            />
          )}

          {activeTab === 'search' && (
            <SearchPage 
              onSelectCreator={handleSelectCreator}
            />
          )}

          {activeTab === 'parent' && (
            <ParentDashboard 
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              blocklist={blocklist}
              onAddBlockWord={handleAddBlockWord}
              onRemoveBlockWord={handleRemoveBlockWord}
            />
          )}

          {activeTab === 'profile' && activeProfileCreator && (
            <CreatorProfile 
              username={activeProfileCreator}
              onBack={() => {
                setActiveTab('feed');
                setActiveProfileCreator(null);
              }}
              onRequestAuth={handleRequestAuth}
            />
          )}
        </div>

        {/* Dynamic Bottom Tab Navigation Bar */}
        <nav className="bottom-nav">
          <button 
            className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('feed');
              refreshDbState();
            }}
          >
            <div className="nav-icon-container">
              <Film size={20} />
            </div>
            <span>Feed</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <div className="nav-icon-container">
              <Search size={20} />
            </div>
            <span>Search</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'parent' ? 'active' : ''}`}
            onClick={() => setActiveTab('parent')}
          >
            <div className="nav-icon-container">
              <Settings2 size={20} />
            </div>
            <span>Parent Control</span>
          </button>
        </nav>
      </div>

      {/* Account Registration Form Sheet */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">🚀 Register Account</h4>
            <p className="modal-text">
              {authAction ? `Create a profile to ${authAction.toLowerCase()} videos, comment, and follow creators!` : 'Register your profile to unlock interactive features!'}
            </p>
            
            <form onSubmit={handleRegisterUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#a0a0b0' }}>Unique Username:</label>
                <input 
                  type="text" 
                  placeholder="e.g. explorer.kid or cool_kids" 
                  className="input-styled"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
                
                {/* Real-time username availability indicator */}
                {usernameCheck.checked && (
                  <span style={{ 
                    fontSize: '11px', 
                    color: usernameCheck.available ? 'var(--safe-green)' : 'var(--danger-red)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px'
                  }}>
                    {usernameCheck.available ? <Check size={12} /> : <AlertCircle size={12} />}
                    {usernameCheck.reason}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#a0a0b0' }}>Display Name:</label>
                <input 
                  type="text" 
                  placeholder="Enter screen name" 
                  className="input-styled"
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#a0a0b0' }}>Creator Bio:</label>
                <input 
                  type="text" 
                  placeholder="Write a cute biography..." 
                  className="input-styled"
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button 
                  type="submit" 
                  className="btn-styled" 
                  disabled={!usernameCheck.available}
                  style={{ flex: 1, background: usernameCheck.available ? 'var(--primary-teal)' : '' }}
                >
                  Create
                </button>
                <button 
                  type="button" 
                  className="btn-styled" 
                  onClick={() => setShowRegisterModal(false)}
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
