import React, { useRef } from 'react';
import { Upload, Film, AlertCircle, FileVideo } from 'lucide-react';

export default function VideoUploader({ onFileSelect, file, isProcessing }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        onFileSelect(droppedFile);
      }
    }
  };

  return (
    <div className="uploader-container">
      <div 
        className={`drop-zone ${file ? 'has-file' : ''} ${isProcessing ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          disabled={isProcessing}
        />

        {file ? (
          <div className="file-preview-card">
            <div className="icon-badge">
              <FileVideo size={36} color="#76b900" />
            </div>
            <div className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for Upscale</span>
            </div>
            {!isProcessing && (
              <button 
                className="change-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null);
                }}
              >
                Change Video
              </button>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon-wrapper pulse-nvidia">
              <Upload size={44} color="#76b900" />
            </div>
            <h3>Drag & Drop Low-Res Video Here</h3>
            <p>Supports MP4, WEBM, MOV (Up to 500MB)</p>
            <div className="browse-badge">Select File from Device</div>
          </div>
        )}
      </div>

      <style>{`
        .drop-zone {
          border: 2px dashed rgba(118, 185, 0, 0.3);
          background: rgba(18, 24, 38, 0.4);
          border-radius: var(--radius-lg);
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .drop-zone:hover:not(.disabled) {
          border-color: var(--nvidia-green);
          background: rgba(118, 185, 0, 0.05);
          box-shadow: 0 0 25px rgba(118, 185, 0, 0.2);
        }

        .drop-zone.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-icon-wrapper {
          width: 70px;
          height: 70px;
          background: rgba(118, 185, 0, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          border: 1px solid rgba(118, 185, 0, 0.3);
        }

        .upload-placeholder h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .upload-placeholder p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .browse-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--nvidia-green);
          font-weight: 500;
        }

        .file-preview-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(118, 185, 0, 0.08);
          border: 1px solid rgba(118, 185, 0, 0.3);
          border-radius: var(--radius-md);
          padding: 16px 24px;
        }

        .icon-badge {
          background: rgba(0, 0, 0, 0.4);
          padding: 12px;
          border-radius: var(--radius-sm);
        }

        .file-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
          margin: 0 20px;
          text-align: left;
        }

        .file-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-primary);
          word-break: break-all;
        }

        .file-size {
          font-size: 0.8rem;
          color: var(--nvidia-green);
          margin-top: 4px;
        }

        .change-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text-secondary);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .change-btn:hover {
          color: #fff;
          border-color: #fff;
        }
      `}</style>
    </div>
  );
}
