import React, { useState } from 'react';
import serverAPI from '../api/server';

const FileUpload = ({ orderId, onUploadComplete, type = 'audio' }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      let uploadResult;
      
      if (type === 'audio') {
        uploadResult = await serverAPI.uploadAudio(file);
      } else {
        uploadResult = await serverAPI.uploadTranscript(file);
      }

      // Update order with file path
      if (orderId && uploadResult.filePath) {
        const updateData = {};
        if (type === 'audio') {
          updateData.audioFilePath = uploadResult.filePath;
        } else {
          updateData.transcriptFilePath = uploadResult.filePath;
        }
        
        await serverAPI.updateOrderFiles(orderId, updateData.audioFilePath, updateData.transcriptFilePath);
      }

      setSuccess(`${type === 'audio' ? 'Audio' : 'Transcript'} uploaded successfully!`);
      setFile(null);
      setUploadProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete(uploadResult);
      }

      // Reset form
      const fileInput = document.getElementById(`${type}-file-input`);
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setSuccess(null);
      }, 3000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedTypes = () => {
    if (type === 'audio') {
      return '.mp3,.wav,.mp4,.ogg,.webm';
    }
    return '.txt,.pdf,.doc,.docx';
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-card">
        <h4 className="mb-3">
          <i className={`fas fa-${type === 'audio' ? 'microphone' : 'file-alt'} me-2`}></i>
          Upload {type === 'audio' ? 'Audio' : 'Transcript'} File
        </h4>
        
        <div className="file-input-group mb-3">
          <input
            type="file"
            id={`${type}-file-input`}
            className="form-control"
            accept={getAcceptedTypes()}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {file && (
          <div className="file-info mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="file-name">
                <i className="fas fa-file me-2"></i>
                {file.name}
              </span>
              <span className="file-size text-muted">
                {formatFileSize(file.size)}
              </span>
            </div>
          </div>
        )}

        {uploading && (
          <div className="upload-progress mb-3">
            <div className="progress">
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-3">
            <i className="fas fa-check-circle me-2"></i>
            {success}
          </div>
        )}

        <button
          className="btn btn-primary w-100"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Uploading...
            </>
          ) : (
            <>
              <i className="fas fa-upload me-2"></i>
              Upload {type === 'audio' ? 'Audio' : 'Transcript'}
            </>
          )}
        </button>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Accepted formats:</strong> {type === 'audio' ? 'MP3, WAV, MP4, OGG, WEBM' : 'TXT, PDF, DOC, DOCX'}
            <br />
            <strong>Max file size:</strong> 50MB
          </small>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

