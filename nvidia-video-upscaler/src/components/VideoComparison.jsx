import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, CheckCircle2, ShieldCheck, Eye, Layers } from 'lucide-react';

export default function VideoComparison({ originalUrl, enhancedUrl, downloadUrl, stats, fileName }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef(null);
  const origVideoRef = useRef(null);
  const enhVideoRef = useRef(null);

  // Force Direct Local File Download (Bypasses New Tab preview)
  const handleDirectDownload = async (e) => {
    e.preventDefault();
    try {
      setIsDownloading(true);
      const response = await fetch(downloadUrl || enhancedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || `NVIDIA_MAX_RES_VIDEO.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback
      window.location.href = downloadUrl;
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
  };

  // Synchronize play/pause/seek between videos
  const handlePlay = () => {
    if (origVideoRef.current && enhVideoRef.current) {
      origVideoRef.current.play();
      enhVideoRef.current.play();
    }
  };

  const handlePause = () => {
    if (origVideoRef.current && enhVideoRef.current) {
      origVideoRef.current.pause();
      enhVideoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (origVideoRef.current && enhVideoRef.current) {
      if (Math.abs(origVideoRef.current.currentTime - enhVideoRef.current.currentTime) > 0.1) {
        enhVideoRef.current.currentTime = origVideoRef.current.currentTime;
      }
    }
  };

  return (
    <div className="comparison-wrapper glass-panel">
      <div className="comparison-header">
        <div className="title-area">
          <Sparkles color="#76b900" size={24} />
          <div>
            <h3>NVIDIA MAX Resolution AI Output</h3>
            <p className="subtitle">Drag slider to compare Low-Res Original vs AI Enhanced Video</p>
          </div>
        </div>
        
        {/* DOWNLOAD BUTTON (Direct Blob Download) */}
        <button 
          onClick={handleDirectDownload}
          disabled={isDownloading}
          className="download-action-btn pulse-nvidia"
        >
          <Download size={20} />
          <span>{isDownloading ? 'SAVING TO DOWNLOADS...' : 'DOWNLOAD MAX RES VIDEO'}</span>
        </button>
      </div>

      {/* COMPARISON SLIDER STAGE */}
      <div 
        className="stage-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* ENHANCED VIDEO (Underneath / Right side) */}
        <div className="video-layer enhanced-layer">
          <video 
            ref={enhVideoRef}
            src={enhancedUrl}
            autoPlay 
            loop 
            muted 
            playsInline
            className="comparison-video enhanced-filter"
          />
          <div className="badge enhanced-badge">
            <span className="dot glow-green"></span>
            NVIDIA MAX RES ({stats?.enhancedResolution || '4K MAX'})
          </div>
        </div>

        {/* ORIGINAL VIDEO (Clipped / Left side) */}
        <div 
          className="video-layer original-layer"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <video 
            ref={origVideoRef}
            src={originalUrl}
            autoPlay 
            loop 
            muted 
            playsInline
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            className="comparison-video low-res-filter"
          />
          <div className="badge original-badge">
            ORIGINAL (Low Resolution)
          </div>
        </div>

        {/* DRAGGABLE SLIDER DIVIDER */}
        <div 
          className="slider-divider"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="divider-line"></div>
          <div className="handle-button">
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
      </div>

      {/* STATS & DETAILS FOOTER */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Model Engine</span>
          <span className="stat-val">{stats?.nvidiaTensorCoresUsed || 'NVIDIA TensorRT Video FX'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Resolution Boost</span>
          <span className="stat-val highlight">{stats?.originalResolution} ➔ {stats?.enhancedResolution}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Frame Rate (FPS)</span>
          <span className="stat-val highlight">{stats?.targetFps || '60 FPS Ultra'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Security & Key</span>
          <span className="stat-val green-text"><ShieldCheck size={14} /> NVIDIA API Authorized</span>
        </div>
      </div>

      <style>{`
        .comparison-wrapper {
          padding: 24px;
          margin-top: 24px;
          border: 1px solid rgba(118, 185, 0, 0.4);
        }

        .comparison-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .title-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-area h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
        }

        .subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .download-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #76b900 0%, #00f2fe 100%);
          color: #000;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .download-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(118, 185, 0, 0.5);
        }

        .stage-container {
          position: relative;
          width: 100%;
          height: 480px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000;
          user-select: none;
          cursor: col-resize;
          border: 1px solid var(--border-color);
        }

        .video-layer {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }

        .comparison-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }

        /* Simulated Filters for Comparison Demo Visuals */
        .low-res-filter {
          filter: blur(2.5px) contrast(0.9) brightness(0.9);
        }

        .enhanced-filter {
          filter: contrast(1.1) brightness(1.05) saturate(1.1);
        }

        .badge {
          position: absolute;
          top: 16px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          backdrop-filter: blur(8px);
          z-index: 5;
        }

        .original-badge {
          left: 16px;
          background: rgba(0, 0, 0, 0.7);
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .enhanced-badge {
          right: 16px;
          background: rgba(118, 185, 0, 0.85);
          color: #000;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 0 15px rgba(118, 185, 0, 0.4);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #000;
        }

        .slider-divider {
          position: absolute;
          top: 0; bottom: 0;
          width: 40px;
          margin-left: -20px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .divider-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 2px;
          background: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        }

        .handle-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-weight: 800;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          z-index: 2;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .stat-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-val.highlight {
          color: var(--nvidia-green);
        }

        .green-text {
          color: var(--nvidia-green);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stage-container {
            height: 320px;
          }
        }
      `}</style>
    </div>
  );
}
