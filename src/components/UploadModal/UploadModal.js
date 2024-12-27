import React, { useState } from 'react';
import './UploadModal.css';

const UploadModal = ({ onClose }) => {
  const [files, setFiles] = useState([]); // State for holding selected files
  const [dragging, setDragging] = useState(false); // State to track drag-and-drop

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  // Handle drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]); // Combine with existing files
  };

  // Handle file upload (this is just a placeholder function)
  const handleUpload = () => {
    // Simulate file upload
    console.log('Uploading files:', files);
    // You can replace this with your actual upload logic
    // For example, using an API call to upload the files
    onClose(); // Close the modal after upload
  };

  return (
    <div className={`modal-overlay show`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Upload Photo</h2>
        <div
          className={`upload-area ${dragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag & Drop your files here or</p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the file input
            id="fileInput"
          />
          <label htmlFor="fileInput" className="upload-button">
            Select Files
          </label>
        </div>

        <h3>Files to Upload:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>

        <div className="modal-buttons">
          <button type="button" onClick={handleUpload} disabled={files.length === 0}>
            Upload
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default UploadModal;
