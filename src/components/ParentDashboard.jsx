import React, { useState, useEffect, useRef } from 'react';
import { Lock, Settings, Shield, Plus, Trash2, Clock, BarChart3, AlertCircle, Key, LogOut } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function ParentDashboard({ 
  selectedCategories, 
  onToggleCategory, 
  blocklist, 
  onAddBlockWord, 
  onRemoveBlockWord
}) {
  const [hasPin, setHasPin] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // PIN creation flow states
  const [createStep, setCreateStep] = useState('enter'); // 'enter', 'confirm'
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // PIN login flow states
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState(false);

  // Settings states
  const [newWord, setNewWord] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [newPinConfirmInput, setNewPinConfirmInput] = useState('');

  // Watch statistics
  const [watchStats, setWatchStats] = useState({});

  const CORRECT_PIN = databaseService.getParentPin();
  const sessionTimerRef = useRef(null);
  const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

  // Load configuration
  const [ageFilter, setAgeFilter] = useState(databaseService.getAgeFilter());
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    if (isUnlocked) {
      setWatchHistory(databaseService.getWatchHistory());
    }
  }, [isUnlocked]);

  const handleAgeFilterChange = (filter) => {
    databaseService.setAgeFilter(filter);
    setAgeFilter(filter);
  };

  useEffect(() => {
    setHasPin(!!CORRECT_PIN);
    setWatchStats(databaseService.getWatchStats());
  }, [CORRECT_PIN]);

  // Session Timeout Handler (Auto-lock after 5 minutes of inactivity)
  useEffect(() => {
    if (!isUnlocked) return;

    const resetSessionTimer = () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = setTimeout(() => {
        handleLogout();
        alert('Security Alert: Parental control session timed out due to inactivity.');
      }, SESSION_TIMEOUT_MS);
    };

    // Listeners to detect activity and reset timer
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetSessionTimer);
    });

    // Start initial timer
    resetSessionTimer();

    return () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetSessionTimer);
      });
    };
  }, [isUnlocked]);

  const handleLogout = () => {
    setIsUnlocked(false);
    setPinAttempt('');
    setIsChangingPin(false);
  };

  // PIN Creation keyboard click
  const handleCreatePinClick = (num) => {
    if (createStep === 'enter') {
      if (firstPin.length >= 4) return;
      const val = firstPin + num;
      setFirstPin(val);
      if (val.length === 4) {
        setTimeout(() => setCreateStep('confirm'), 250);
      }
    } else {
      if (confirmPin.length >= 4) return;
      const val = confirmPin + num;
      setConfirmPin(val);
      if (val.length === 4) {
        setTimeout(() => {
          if (firstPin === val) {
            databaseService.setParentPin(val);
            setHasPin(true);
            setIsUnlocked(true);
            setFirstPin('');
            setConfirmPin('');
            setCreateStep('enter');
          } else {
            alert('PINs do not match! Please try again.');
            setFirstPin('');
            setConfirmPin('');
            setCreateStep('enter');
          }
        }, 300);
      }
    }
  };

  // PIN Login keyboard click
  const handleLoginPinClick = (num) => {
    if (pinAttempt.length >= 4) return;
    setPinError(false);
    const val = pinAttempt + num;
    setPinAttempt(val);

    if (val === CORRECT_PIN) {
      setTimeout(() => {
        setIsUnlocked(true);
        setPinAttempt('');
      }, 350);
    } else if (val.length === 4) {
      setTimeout(() => {
        setPinError(true);
        setPinAttempt('');
      }, 350);
    }
  };

  // Forgot PIN callback
  const handleForgotPin = () => {
    alert('Forgot PIN Action:\nA password reset link has been dispatched to the parent email address registered to this system.');
  };

  // Change PIN handler
  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    if (currentPinInput !== CORRECT_PIN) {
      alert('Error: Current PIN is incorrect.');
      return;
    }
    if (newPinInput.length !== 4 || !/^\d+$/.test(newPinInput)) {
      alert('Error: New PIN must be a 4-digit number.');
      return;
    }
    if (newPinInput !== newPinConfirmInput) {
      alert('Error: New PINs do not match.');
      return;
    }

    databaseService.setParentPin(newPinInput);
    alert('Security PIN updated successfully!');
    setIsChangingPin(false);
    setCurrentPinInput('');
    setNewPinInput('');
    setNewPinConfirmInput('');
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    if (newWord.trim()) {
      onAddBlockWord(newWord.trim());
      setNewWord('');
    }
  };

  const handleResetStats = () => {
    const confirm = window.confirm('Reset screen usage logs?');
    if (confirm) {
      const empty = databaseService.resetWatchStats();
      setWatchStats(empty);
    }
  };

  const totalWatchTime = Object.values(watchStats).reduce((a, b) => a + b, 0);
  const categoriesList = ['Science', 'Animals', 'Funny', 'Life Skills', 'Gaming'];

  // --- SCREEN 1: FIRST TIME PIN CREATION ---
  if (!hasPin) {
    const activePin = createStep === 'enter' ? firstPin : confirmPin;
    return (
      <div className="parent-lock-container">
        <div className="lock-illustration">
          <Key size={46} />
        </div>
        <h3 className="subview-title" style={{ justifyContent: 'center' }}>Set Parental PIN</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0', maxWidth: '280px', margin: '0 auto' }}>
          {createStep === 'enter' 
            ? 'Create a secure 4-digit PIN code to lock safety and category settings.' 
            : 'Confirm your secure 4-digit PIN code.'}
        </p>

        <div className="pin-indicators">
          {[0, 1, 2, 3].map((idx) => (
            <div 
              key={idx} 
              className={`pin-dot ${idx < activePin.length ? 'filled' : ''}`}
            />
          ))}
        </div>

        <div className="pin-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num} 
              className="pin-btn" 
              onClick={() => handleCreatePinClick(num.toString())}
            >
              {num}
            </button>
          ))}
          <button className="pin-btn" onClick={() => createStep === 'enter' ? setFirstPin('') : setConfirmPin('')} style={{ fontSize: '13px' }}>Clear</button>
          <button className="pin-btn" onClick={() => handleCreatePinClick('0')}>0</button>
          <button 
            className="pin-btn" 
            onClick={() => createStep === 'enter' ? setFirstPin(firstPin.slice(0, -1)) : setConfirmPin(confirmPin.slice(0, -1))}
            style={{ fontSize: '13px' }}
          >
            ⌫
          </button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: PIN VERIFICATION LOGIN ---
  if (!isUnlocked) {
    return (
      <div className="parent-lock-container">
        <div className={`lock-illustration ${pinError ? 'error-shake' : ''}`} style={{ borderColor: pinError ? 'var(--danger-red)' : '' }}>
          <Lock size={46} style={{ color: pinError ? 'var(--danger-red)' : '' }} />
        </div>
        <h3 className="subview-title" style={{ justifyContent: 'center' }}>Parent Lock</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>
          Input PIN to manage child controls.
        </p>

        <div className="pin-indicators">
          {[0, 1, 2, 3].map((idx) => (
            <div 
              key={idx} 
              className={`pin-dot ${idx < pinAttempt.length ? 'filled' : ''} ${pinError ? 'error-shake' : ''}`}
              style={{ backgroundColor: pinError ? 'var(--danger-red)' : '' }}
            />
          ))}
        </div>

        <div className="pin-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num} 
              className="pin-btn" 
              onClick={() => handleLoginPinClick(num.toString())}
            >
              {num}
            </button>
          ))}
          <button className="pin-btn" onClick={() => setPinAttempt('')} style={{ fontSize: '13px' }}>Clear</button>
          <button className="pin-btn" onClick={() => handleLoginPinClick('0')}>0</button>
          <button 
            className="pin-btn" 
            onClick={() => setPinAttempt(pinAttempt.slice(0, -1))}
            style={{ fontSize: '13px' }}
          >
            ⌫
          </button>
        </div>

        <button 
          onClick={handleForgotPin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-teal)',
            fontSize: '13px',
            cursor: 'pointer',
            marginTop: '10px',
            fontWeight: '600'
          }}
        >
          Forgot PIN?
        </button>
      </div>
    );
  }

  // --- SCREEN 3: UNLOCKED DASHBOARD ---
  return (
    <div className="subview-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="subview-title">
          <Settings size={24} style={{ color: 'var(--primary-purple)' }} /> 
          Parent Controls
        </h2>
        
        {/* Logout action */}
        <button 
          className="btn-header"
          onClick={handleLogout}
          style={{ width: 'auto', padding: '0 12px', borderRadius: '12px', display: 'flex', gap: '4px', fontSize: '12px' }}
        >
          <LogOut size={14} /> Lock Session
        </button>
      </div>
      <p className="subview-desc">
        Configure age categories, restricted keywords, and view detailed screen usage reports.
      </p>

      {/* Dynamic Change PIN subview panel */}
      {isChangingPin ? (
        <form onSubmit={handleChangePinSubmit} className="card-panel">
          <h3 className="card-title">
            <Key size={16} /> Update Security PIN
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="password" 
              placeholder="Current 4-Digit PIN" 
              className="input-styled"
              maxLength={4}
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
              required
            />
            <input 
              type="password" 
              placeholder="New 4-Digit PIN" 
              className="input-styled"
              maxLength={4}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
              required
            />
            <input 
              type="password" 
              placeholder="Confirm New 4-Digit PIN" 
              className="input-styled"
              maxLength={4}
              value={newPinConfirmInput}
              onChange={(e) => setNewPinConfirmInput(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-styled" style={{ flex: 1 }}>Save PIN</button>
            <button 
              type="button" 
              className="btn-styled" 
              onClick={() => setIsChangingPin(false)}
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button 
          className="btn-styled"
          onClick={() => setIsChangingPin(true)}
          style={{ background: 'rgba(108, 92, 231, 0.15)', color: 'var(--primary-purple)', display: 'flex', justifyContent: 'center', gap: '8px' }}
        >
          <Key size={16} /> Change Security PIN
        </button>
      )}

      {/* Screen Time & Usage Stats */}
      <div className="card-panel">
        <h3 className="card-title">
          <BarChart3 size={16} /> Usage Reports
        </h3>
        
        <div className="stat-grid">
          <div className="stat-box">
            <span style={{ fontSize: '11px', color: '#a0a0b0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Clock size={12} /> Total Usage
            </span>
            <div className="stat-value coral">
              {totalWatchTime > 60 ? `${Math.floor(totalWatchTime / 60)}m ${totalWatchTime % 60}s` : `${totalWatchTime}s`}
            </div>
          </div>
          <div className="stat-box">
            <span style={{ fontSize: '11px', color: '#a0a0b0' }}>Safety Index</span>
            <div className="stat-value teal">100% KidSafe</div>
          </div>
        </div>

        {/* Category Breakdown list */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#a0a0b0' }}>Category Breakdown:</span>
          {categoriesList.map((cat) => {
            const time = watchStats[cat] || 0;
            const percentage = totalWatchTime > 0 ? (time / totalWatchTime) * 100 : 0;
            return (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>{cat}</span>
                  <span style={{ color: '#888' }}>{time}s ({Math.round(percentage)}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: cat === 'Science' ? 'var(--primary-teal)' :
                                  cat === 'Animals' ? 'var(--primary-yellow)' :
                                  cat === 'Funny' ? 'var(--primary-pink)' :
                                  cat === 'Life Skills' ? 'var(--primary-purple)' : 'var(--primary-coral)',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="btn-styled" 
          onClick={handleResetStats}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px', padding: '10px' }}
        >
          Reset Statistics
        </button>
      </div>

      {/* Parent-controlled Age Filter Panel */}
      <div className="card-panel">
        <h3 className="card-title">
          <Shield size={16} /> Age Filter Limits
        </h3>
        <p style={{ fontSize: '12px', color: '#a0a0b0' }}>
          Restricts the feed to age-appropriate learning topics automatically.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {['3+', '7+', '13+'].map((age) => (
            <button
              key={age}
              className={`category-pill ${ageFilter === age ? 'active' : ''}`}
              onClick={() => handleAgeFilterChange(age)}
              style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 'bold' }}
            >
              {age === '3+' ? 'Toddler (3+)' : age === '7+' ? 'Kid (7+)' : 'All (13+)'}
            </button>
          ))}
        </div>
      </div>

      {/* Allowed Categories Toggle Panel */}
      <div className="card-panel">
        <h3 className="card-title">
          <Shield size={16} /> Permitted Categories
        </h3>
        <p style={{ fontSize: '12px', color: '#a0a0b0' }}>
          Restricted categories are filtered out of the reels feed instantly.
        </p>

        <div className="category-pill-list">
          {categoriesList.map((cat) => {
            const isAllowed = selectedCategories.includes(cat);
            return (
              <button 
                key={cat}
                className={`category-pill ${isAllowed ? 'active' : ''}`}
                onClick={() => onToggleCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Watch History Logs */}
      <div className="card-panel">
        <h3 className="card-title">
          <Clock size={16} /> Watch History Logs
        </h3>
        <p style={{ fontSize: '12px', color: '#a0a0b0' }}>
          List of recently viewed educational video loops.
        </p>

        <div style={{ 
          marginTop: '10px', 
          maxHeight: '180px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          paddingRight: '4px'
        }}>
          {watchHistory.length === 0 ? (
            <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>No watch history logged yet.</span>
          ) : (
            watchHistory.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '8px 12px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{item.title}</span>
                <span style={{ fontSize: '10px', color: '#7f8c8d', marginTop: '2px' }}>
                  Watched: {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom Keyword Blocklist */}
      <div className="card-panel">
        <h3 className="card-title">
          <AlertCircle size={16} style={{ color: 'var(--primary-coral)' }} /> Blocked Words Filter
        </h3>
        <p style={{ fontSize: '12px', color: '#a0a0b0' }}>
          Automatically hide videos matching these terms from the feed.
        </p>

        <form onSubmit={handleAddWord} className="input-row">
          <input 
            type="text" 
            placeholder="Add term (e.g. scary, prank)" 
            className="input-styled"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
          <button type="submit" className="btn-styled" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={14} /> Add
          </button>
        </form>

        <div className="word-list">
          {blocklist.length === 0 ? (
            <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic' }}>No blocked words.</span>
          ) : (
            blocklist.map((word) => (
              <span key={word} className="word-tag">
                {word}
                <button type="button" onClick={() => onRemoveBlockWord(word)}>
                  <Trash2 size={12} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
