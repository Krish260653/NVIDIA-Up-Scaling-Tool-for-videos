import React from 'react';
import { Sliders, Cpu, Zap, Sparkles } from 'lucide-react';

export default function ResolutionSelector({ 
  targetResolution, 
  setTargetResolution, 
  enhanceModel, 
  setEnhanceModel,
  fpsBoost,
  setFpsBoost,
  targetFps,
  setTargetFps,
  isProcessing 
}) {
  const resolutions = [
    { id: '2k', label: '2K Quad HD', detail: '2560 x 1440' },
    { id: '4k', label: '4K Max Res', detail: '3840 x 2160', recommended: true },
    { id: '8k', label: '8K Ultra Studio', detail: '7680 x 4320 (Max)' },
  ];

  const fpsOptions = [
    { id: 0, label: 'Original FPS', desc: 'Keep input frame rate' },
    { id: 60, label: '60 FPS Ultra Smooth', desc: 'AI Optical Flow interpolation' },
    { id: 120, label: '120 FPS High Refresh', desc: 'Max fluidity for high-refresh screens' }
  ];

  const models = [
    { id: 'all-in-one', name: '⚡ ALL-IN-ONE ULTIMATE (Recommended)', desc: 'Combines Super-Res (4K/8K) + Detail Restorer + Noise Removal in 1-Click' },
    { id: 'super-resolution', name: 'NVIDIA Super Resolution', desc: 'AI Tensor Core pixel generation & resolution scaling' },
    { id: 'detail-enhance', name: 'Maxine Detail Enhancer', desc: 'Restores compressed faces, textures & sharp edges' },
    { id: 'denoise-deartifact', name: 'AI Noise & Artifact Removal', desc: 'Cleans video blur, compression artifacts & grain' }
  ];

  return (
    <div className="selector-card glass-panel">
      <div className="section-title">
        <Sliders size={20} color="#76b900" />
        <h4>NVIDIA AI Processing Settings</h4>
      </div>

      <div className="group">
        <label className="group-label">Target Video Resolution</label>
        <div className="resolution-grid">
          {resolutions.map((res) => (
            <button
              key={res.id}
              disabled={isProcessing}
              className={`res-btn ${targetResolution === res.id ? 'active' : ''}`}
              onClick={() => setTargetResolution(res.id)}
            >
              {res.recommended && <span className="rec-badge">RECOMMENDED</span>}
              <span className="res-title">{res.label}</span>
              <span className="res-dim">{res.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="group">
        <label className="group-label">Frame Rate (FPS) Boost Limit</label>
        <div className="fps-grid">
          {fpsOptions.map((opt) => (
            <button
              key={opt.id}
              disabled={isProcessing}
              className={`fps-btn ${targetFps === opt.id ? 'active' : ''}`}
              onClick={() => {
                setTargetFps(opt.id);
                setFpsBoost(opt.id > 0);
              }}
            >
              <div className="fps-btn-header">
                <Zap size={14} color={targetFps === opt.id ? '#76b900' : '#9ca3af'} />
                <span className="fps-btn-title">{opt.label}</span>
              </div>
              <span className="fps-btn-desc">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="group">
        <label className="group-label">NVIDIA AI Model Enhancement</label>
        <div className="model-selector">
          {models.map((m) => (
            <div 
              key={m.id}
              className={`model-option ${enhanceModel === m.id ? 'selected' : ''}`}
              onClick={() => !isProcessing && setEnhanceModel(m.id)}
            >
              <div className="radio-circle">
                {enhanceModel === m.id && <div className="radio-inner" />}
              </div>
              <div className="model-text">
                <span className="model-name">{m.name}</span>
                <span className="model-desc">{m.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .selector-card {
          padding: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .section-title h4 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .group {
          margin-bottom: 20px;
        }

        .group-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .resolution-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .res-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 14px 10px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .res-btn:hover:not(:disabled) {
          border-color: rgba(118, 185, 0, 0.4);
          background: rgba(118, 185, 0, 0.05);
        }

        .res-btn.active {
          border-color: var(--nvidia-green);
          background: rgba(118, 185, 0, 0.12);
          box-shadow: 0 0 15px rgba(118, 185, 0, 0.2);
        }

        .rec-badge {
          position: absolute;
          top: -8px;
          background: var(--nvidia-green);
          color: #000;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .res-title {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .res-dim {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .fps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .fps-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          transition: all 0.2s;
        }

        .fps-btn:hover:not(:disabled) {
          border-color: rgba(118, 185, 0, 0.4);
          background: rgba(118, 185, 0, 0.05);
        }

        .fps-btn.active {
          border-color: var(--nvidia-green);
          background: rgba(118, 185, 0, 0.1);
          box-shadow: 0 0 12px rgba(118, 185, 0, 0.25);
        }

        .fps-btn-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .fps-btn-title {
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--text-primary);
        }

        .fps-btn-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.2;
        }

        .model-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .model-option {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
        }

        .model-option:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .model-option.selected {
          border-color: var(--nvidia-green);
          background: rgba(118, 185, 0, 0.06);
        }

        .radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .model-option.selected .radio-circle {
          border-color: var(--nvidia-green);
        }

        .radio-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--nvidia-green);
        }

        .model-text {
          display: flex;
          flex-direction: column;
        }

        .model-name {
          font-size: 0.88rem;
          font-weight: 600;
        }

        .model-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .fps-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.2);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          cursor: pointer;
        }

        .fps-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fps-title {
          font-size: 0.88rem;
          font-weight: 600;
          display: block;
        }

        .fps-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .switch {
          width: 44px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2px;
          transition: all 0.3s;
        }

        .switch.on {
          background: var(--nvidia-green);
        }

        .handle {
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .switch.on .handle {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
}
