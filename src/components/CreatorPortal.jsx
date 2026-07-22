import React, { useState, useRef } from 'react';
import { Upload, ShieldCheck, ShieldAlert, Cpu, Check, AlertTriangle, FileVideo, RefreshCw, Film } from 'lucide-react';
import { AiModerationService } from '../services/AiModerationService';
import { databaseService } from '../services/databaseService';

export default function CreatorPortal({ onAddVideo }) {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Science');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'passed', 'failed'
  const [scanLogs, setScanLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [safetyScore, setSafetyScore] = useState(0);

  const fileInputRef = useRef(null);

  // Handle local video file upload selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Accept only video files
    if (!file.type.startsWith('video/')) {
      alert('Error: Please select a valid video file format (e.g. .mp4, .mov).');
      return;
    }

    // 2. Validate video duration (30 - 60 seconds)
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);
    
    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(videoEl.src);
      const duration = videoEl.duration;
      
      if (duration < 30 || duration > 60) {
        alert(`Duration Error: Selected video is ${Math.round(duration)} seconds. Videos must be between 30 and 60 seconds long.`);
        e.target.value = null; // Clear file input
        return;
      }

      setVideoFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, "").substring(0, 30));
      setDescription(`Fun video uploaded from device storage.`);
      setScanStatus('idle');
      setScanLogs([]);
    };
  };

  // Trigger file picker click
  const triggerFileSelect = () => {
    if (isScanning) return;
    fileInputRef.current.click();
  };

  // Preset scenarios to help user test safety passes/fails without needing 30s clips
  const presets = [
    {
      title: 'Baby Animals Safari',
      description: 'Cute little panda, puppy and cat playing outdoors.',
      category: 'Animals',
      fileName: 'happy_safari.mp4',
      mockFile: { name: 'happy_safari.mp4' }
    },
    {
      title: 'Action Figures Fight',
      description: 'Toy figures punching and fighting. Heavily aggressive.',
      category: 'Gaming',
      fileName: 'combat_fight.mp4',
      mockFile: { name: 'combat_fight.mp4' }
    },
    {
      title: 'Cool Skateboarding Tricks',
      description: 'Skater boy swearing and cursing while doing skateboard jumps.',
      category: 'Life Skills',
      fileName: 'skateboard_swear.mp4',
      mockFile: { name: 'skateboard_swear.mp4' }
    }
  ];

  const handleSelectPreset = (p) => {
    if (isScanning) return;
    setVideoFile(p.mockFile);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setScanStatus('idle');
    setScanLogs([]);
  };

  // Start Safety Moderation scan
  const startAIScan = async () => {
    if (!videoFile || isScanning) return;

    setIsScanning(true);
    setScanStatus('scanning');
    setScanLogs([]);

    // Step-by-step logs fed incrementally to scanner terminal
    const tempLogs = [];
    const pushLog = (logText, delay) => {
      return new Promise(resolve => {
        setTimeout(() => {
          setScanLogs(prev => [...prev, logText]);
          resolve();
        }, delay);
      });
    };

    // Run AI Moderation check through decentralized Service
    try {
      // Setup listener to push initial loading logs
      pushLog('🤖 Initializing Kids Aura AI Safety Core v4.0...', 300);
      pushLog('📂 Loading video buffer bytes from local storage...', 1000);
      pushLog('🎞️ Visual scanner: analyzing frames for sexual, violent, gore or self-harm content...', 2000);
      pushLog('🎙️ Audio transcript scanner: searching speech channels for blocked curses/words...', 3500);

      const result = await AiModerationService.scanVideoFile(videoFile, title, description);
      
      setSafetyScore(result.safetyScore);
      setScanLogs(result.logs);
      setIsScanning(false);

      if (result.passed) {
        setScanStatus('passed');
        // Publish video and write to live databaseService
        await databaseService.publishVideo(
          title,
          description,
          category,
          // If true local file, map object URL, otherwise fallback to standard mixkit sample loop
          videoFile.size ? URL.createObjectURL(videoFile) : 'https://assets.mixkit.co/videos/preview/mixkit-giant-panda-eating-bamboo-40546-large.mp4',
          result.safetyScore
        );
        
        // Notify parent callback
        if (onAddVideo) onAddVideo();
        setTimeout(() => setShowModal(true), 600);
      } else {
        setScanStatus('failed');
        setFailureReason(result.reason);
        setTimeout(() => setShowModal(true), 600);
      }
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      setScanStatus('idle');
      alert('Scanning Error: Failed to contact AI safety API.');
    }
  };

  return (
    <div className="subview-container">
      <h2 className="subview-title">
        <Upload size={24} style={{ color: 'var(--primary-pink)' }} /> 
        Publish Short Video
      </h2>
      <p className="subview-desc">
        Select a local video file from your device. Videos must be between 30 and 60 seconds long and clear the safety moderation check.
      </p>

      {/* Upload Drag Card */}
      <div className="card-panel" style={{ gap: '16px' }}>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="video/*" 
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        <div className="upload-drag-area" onClick={triggerFileSelect}>
          <Film size={40} className="status-checking" style={{ color: 'var(--primary-pink)' }} />
          <div>
            <h4 style={{ color: 'white', fontSize: '15px' }}>
              {videoFile ? videoFile.name : 'Select Video File'}
            </h4>
            <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
              Accepts mp4, mov (Limit: 30s to 60s)
            </p>
          </div>
        </div>

        {/* Preset selector for developer convenience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#7f8c8d' }}>Testing Presets (Simulates local file upload):</span>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '11px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Preset {idx + 1}: {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Video metadata input details */}
        {videoFile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#a0a0b0' }}>Video Title:</label>
              <input 
                type="text" 
                placeholder="Enter title..." 
                className="input-styled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isScanning}
                maxLength={30}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#a0a0b0' }}>Video Description:</label>
              <input 
                type="text" 
                placeholder="Enter description..." 
                className="input-styled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isScanning}
                maxLength={60}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#a0a0b0' }}>Video Category:</label>
              <select 
                className="input-styled"
                style={{ appearance: 'none', background: 'rgba(0,0,0,0.25)', cursor: 'pointer' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isScanning}
              >
                <option value="Science">Science</option>
                <option value="Animals">Animals</option>
                <option value="Funny">Funny</option>
                <option value="Life Skills">Life Skills</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* AI Moderation scanner console block */}
      {videoFile && (
        <div className="scanner-container">
          <div className="scanner-video-preview">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <FileVideo size={36} style={{ color: 'var(--primary-teal)' }} />
              <span style={{ fontSize: '13px', color: 'white' }}>{title} Ready</span>
            </div>
            
            {scanStatus === 'scanning' && (
              <>
                <div className="scanner-laser" />
                <div className="scanner-mesh" />
              </>
            )}
            
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.6)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Cpu size={12} className={scanStatus === 'scanning' ? 'loader-spinner' : ''} />
              <span>
                {scanStatus === 'idle' && 'READY'}
                {scanStatus === 'scanning' && 'SCANNING'}
                {scanStatus === 'passed' && 'VERIFIED'}
                {scanStatus === 'failed' && 'BLOCKED'}
              </span>
            </div>
          </div>

          <div className="scanner-status-box">
            <div className="scanner-log">
              {scanLogs.length === 0 ? (
                <span style={{ color: '#555' }}>Click 'Run Safety Check' to execute AI scan...</span>
              ) : (
                scanLogs.map((log, index) => (
                  <div key={index} style={{ marginBottom: '4px' }}>{log}</div>
                ))
              )}
            </div>

            <button 
              className="btn-styled" 
              onClick={startAIScan} 
              disabled={isScanning || scanStatus === 'passed' || scanStatus === 'failed'}
              style={{
                background: scanStatus === 'passed' ? 'var(--safe-green)' : 
                            scanStatus === 'failed' ? 'var(--danger-red)' : '',
                opacity: isScanning ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px'
              }}
            >
              {isScanning ? (
                <>Safety Check Running... <RefreshCw className="loader-spinner" size={14} /></>
              ) : scanStatus === 'passed' ? (
                'Verified & Published'
              ) : scanStatus === 'failed' ? (
                'Safety Rejection'
              ) : (
                'Run AI Safety Check'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Safety Feedback Modals */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {scanStatus === 'passed' ? (
              <>
                <div className="modal-icon success">
                  <ShieldCheck size={36} />
                </div>
                <h4 className="modal-title">Verification Passed! ({safetyScore}%)</h4>
                <p className="modal-text">
                  Kids Aura AI Safety Core verified this video as safe for child consumption. It has been published to the main feed.
                </p>
              </>
            ) : (
              <>
                <div className="modal-icon error">
                  <ShieldAlert size={36} />
                </div>
                <h4 className="modal-title">Moderation Block ({safetyScore}%)</h4>
                <p className="modal-text" style={{ color: '#ff7675', fontWeight: 'bold' }}>
                  Safety Failure: {failureReason}
                </p>
                <p className="modal-text">
                  Videos with sexual elements, fighting, cursing, or mature items are blocked. The safety score must be 65% or higher to be uploaded.
                </p>
              </>
            )}
            <button 
              className="btn-styled" 
              onClick={() => setShowModal(false)}
              style={{ background: scanStatus === 'passed' ? 'var(--safe-green)' : 'var(--danger-red)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
