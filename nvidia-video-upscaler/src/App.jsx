import React, { useState, useEffect } from 'react';
import VideoUploader from './components/VideoUploader';
import ResolutionSelector from './components/ResolutionSelector';
import VideoComparison from './components/VideoComparison';
import ProcessingStatus from './components/ProcessingStatus';
import { Cpu, Key, ShieldCheck, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [targetResolution, setTargetResolution] = useState('4k');
  const [enhanceModel, setEnhanceModel] = useState('all-in-one');
  const [fpsBoost, setFpsBoost] = useState(true);
  const [targetFps, setTargetFps] = useState(60);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('');
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [serverHealth, setServerHealth] = useState(null);

  // Check backend server & NVIDIA API Key status on load
  useEffect(() => {
    axios.get('/api/health')
      .then(res => setServerHealth(res.data))
      .catch(err => console.log('Server check notice:', err));
  }, []);

  const handleStartUpscale = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(5);
    setStepText('Initializing NVIDIA Cloud API Request...');
    setError(null);
    setResult(null);

    // Progress animation timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92;
        }
        if (prev === 20) setStepText('Sending frames to NVIDIA Tensor Core AI Pipeline...');
        if (prev === 55) setStepText('Applying AI Resolution Upscaling & Detail Restorer...');
        if (prev === 80) setStepText('Packaging 4K/8K MAX Resolution Video Stream...');
        return prev + 4;
      });
    }, 180);

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('targetResolution', targetResolution);
      formData.append('enhanceModel', enhanceModel);
      formData.append('fpsBoost', fpsBoost);
      formData.append('targetFps', targetFps);

      const response = await axios.post('/api/upscale', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000 // 5 min timeout for large video FFmpeg processing
      });

      clearInterval(interval);

      if (response.data && response.data.success) {
        setProgress(100);
        setStepText('MAX Resolution Processing Complete!');

        setTimeout(() => {
          setIsProcessing(false);
          setResult(response.data.data);
        }, 500);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setError(response.data?.error || 'Processing failed. Try again.');
      }

    } catch (err) {
      clearInterval(interval);
      setIsProcessing(false);
      setError(err.response?.data?.error || 'Failed to connect to NVIDIA processing server.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="app-layout">
      {/* HEADER */}
      <header className="app-header">
        <div className="logo-container">
          <div className="nvidia-logo-badge">
            {/* Official NVIDIA Logo Vector */}
            <svg viewBox="0 0 24 24" className="nvidia-official-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.15 15.65c-1.35 0-2.45-1.1-2.45-2.45s1.1-2.45 2.45-2.45c.95 0 1.8.55 2.2 1.4.15.3.45.45.8.45h.85c.45 0 .75-.45.6-.9-1-2.65-3.5-4.45-6.45-4.45-3.9 0-7.05 3.15-7.05 7.05s3.15 7.05 7.05 7.05c3.2 0 6-2.15 6.8-5.25.1-.4-.2-.8-.6-.8h-.9c-.35 0-.65.2-.75.5-.6 1.7-2.2 2.9-4.1 2.9zm.05-8.45c4.7 0 8.5 3.8 8.5 8.5 0 .4-.35.7-.75.7h-.95c-.35 0-.65-.25-.75-.6-.85-3.45-3.9-6-7.55-6-3.8 0-7 2.75-7.7 6.4-.1.45-.45.7-.9.7h-.85c-.45 0-.8-.4-.75-.85C1.15 10.3 5.2 6.7 10.2 6.7zm.05-3.5c6.6 0 12 5.4 12 12 0 .4-.35.7-.75.7h-1c-.35 0-.65-.25-.75-.6-1.1-5.4-5.85-9.5-11.55-9.5-5.9 0-10.85 4.35-11.75 10-.05.45-.45.8-.9.8h-.9c-.45 0-.8-.4-.75-.85C1.65 8.1 7.2 3.2 14.2 3.2z" fill="#76B900"/>
            </svg>
          </div>
          <div>
            <div className="brand-badge">
              <span className="nvidia-green-title">NVIDIA</span>
              <span className="pro-pill">RTX AI STUDIO</span>
            </div>
            <h1 className="logo-title">
              MAX RESOLUTION <span className="green-gradient">VISION 8K</span>
            </h1>
          </div>
        </div>

        <div className="api-status-badge">
          <ShieldCheck size={16} color="#76b900" />
          <span>NVIDIA ENGINE: </span>
          <span className="key-val">ENCRYPTED & PROTECTED</span>
          <span className="status-dot"></span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="main-content">
        {!result ? (
          <div className="grid-layout">
            <div className="left-panel">
              <VideoUploader 
                file={file} 
                onFileSelect={setFile} 
                isProcessing={isProcessing} 
              />

              {isProcessing && (
                <ProcessingStatus 
                  progress={progress} 
                  stepText={stepText} 
                />
              )}

              {error && (
                <div className="error-banner">
                  <span>{error}</span>
                </div>
              )}

              {/* ACTION TRIGGER BUTTON */}
              {file && !isProcessing && (
                <button 
                  className="upscale-trigger-btn pulse-nvidia"
                  onClick={handleStartUpscale}
                >
                  <Wand2 size={22} />
                  <span>UPSCALE TO {targetResolution.toUpperCase()} {targetFps ? `@ ${targetFps} FPS` : ''}</span>
                </button>
              )}
            </div>

            <div className="right-panel">
              <ResolutionSelector 
                targetResolution={targetResolution}
                setTargetResolution={setTargetResolution}
                enhanceModel={enhanceModel}
                setEnhanceModel={setEnhanceModel}
                fpsBoost={fpsBoost}
                setFpsBoost={setFpsBoost}
                targetFps={targetFps}
                setTargetFps={setTargetFps}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="result-controls-bar">
              <button className="reset-btn" onClick={handleReset}>
                <RefreshCw size={16} /> Upscale Another Video
              </button>
            </div>

            <VideoComparison 
              originalUrl={result.originalUrl}
              enhancedUrl={result.enhancedUrl}
              downloadUrl={result.downloadUrl}
              fileName={result.fileName}
              stats={result.stats}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>Powered by NVIDIA Maxine AI Video Effects SDK • High-Precision Tensor Core Acceleration</p>
      </footer>

      <style>{`
        .app-layout {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nvidia-logo-badge {
          width: 56px;
          height: 56px;
          background: rgba(118, 185, 0, 0.08);
          border: 1.5px solid rgba(118, 185, 0, 0.5);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          box-shadow: 0 0 25px rgba(118, 185, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .nvidia-logo-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 0 35px rgba(118, 185, 0, 0.5);
        }

        .nvidia-official-icon {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 8px rgba(118, 185, 0, 0.6));
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .nvidia-green-title {
          color: var(--nvidia-green);
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .pro-pill {
          background: rgba(118, 185, 0, 0.15);
          border: 1px solid rgba(118, 185, 0, 0.4);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .logo-title {
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .green-gradient {
          background: linear-gradient(135deg, #76b900 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .api-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(118, 185, 0, 0.3);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 500;
        }

        .key-val {
          color: var(--nvidia-green);
          font-family: var(--font-mono);
          font-weight: 700;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--nvidia-green);
          box-shadow: 0 0 8px var(--nvidia-green);
          margin-left: 4px;
        }

        .main-content {
          flex: 1;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        .upscale-trigger-btn {
          margin-top: 20px;
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #76b900 0%, #00f2fe 100%);
          border: none;
          border-radius: var(--radius-md);
          color: #000;
          font-weight: 800;
          font-size: 1.05rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          letter-spacing: 0.5px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .upscale-trigger-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(118, 185, 0, 0.5);
        }

        .error-banner {
          margin-top: 16px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          text-align: center;
        }

        .result-controls-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 12px;
        }

        .reset-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--nvidia-green);
        }

        .app-footer {
          margin-top: 40px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
