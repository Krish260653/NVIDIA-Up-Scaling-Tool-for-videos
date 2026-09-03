import React, { useState, useEffect } from 'react';
import { Cpu, Server, CheckCircle2, Loader2, Key } from 'lucide-react';

export default function ProcessingStatus({ progress, stepText }) {
  return (
    <div className="status-container glass-panel">
      <div className="status-header">
        <div className="flex-title">
          <Loader2 className="spinner" color="#76b900" size={24} />
          <div>
            <h4>NVIDIA Cloud Processing Active</h4>
            <p className="sub">{stepText}</p>
          </div>
        </div>
        <span className="percent-badge">{progress}%</span>
      </div>

      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="log-steps">
        <div className={`step-item ${progress >= 20 ? 'done' : 'active'}`}>
          <span className="dot"></span>
          <span>Uploading Low-Res Video to Processing Server</span>
        </div>
        <div className={`step-item ${progress >= 50 ? 'done' : progress >= 20 ? 'active' : ''}`}>
          <span className="dot"></span>
          <span>NVIDIA TensorRT Model Execution (API Authorized)</span>
        </div>
        <div className={`step-item ${progress >= 85 ? 'done' : progress >= 50 ? 'active' : ''}`}>
          <span className="dot"></span>
          <span>Rendering MAX Resolution Output & Frame Enhancement</span>
        </div>
        <div className={`step-item ${progress >= 100 ? 'done' : progress >= 85 ? 'active' : ''}`}>
          <span className="dot"></span>
          <span>Finalizing Downloadable Video Package</span>
        </div>
      </div>

      <style>{`
        .status-container {
          padding: 24px;
          margin-top: 20px;
          border: 1px solid rgba(118, 185, 0, 0.3);
        }

        .status-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .flex-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .spinner {
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .status-header h4 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .sub {
          font-size: 0.85rem;
          color: var(--nvidia-green);
        }

        .percent-badge {
          background: rgba(118, 185, 0, 0.15);
          color: var(--nvidia-green);
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1.2rem;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid rgba(118, 185, 0, 0.3);
        }

        .progress-bar-track {
          width: 100%;
          height: 10px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #76b900 0%, #00f2fe 100%);
          transition: width 0.3s ease-out;
          box-shadow: 0 0 15px rgba(118, 185, 0, 0.6);
        }

        .log-steps {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .step-item .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .step-item.active {
          color: var(--text-primary);
        }

        .step-item.active .dot {
          background: var(--nvidia-green);
          box-shadow: 0 0 8px var(--nvidia-green);
        }

        .step-item.done {
          color: var(--nvidia-green);
        }

        .step-item.done .dot {
          background: #00f2fe;
        }
      `}</style>
    </div>
  );
}
