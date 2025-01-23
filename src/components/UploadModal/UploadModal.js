import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Import for fetching customerId from cookies
import { makeMultipartPostRequest } from '../../utility/RestCallUtility'; // Use the correct method
import './UploadModal.css';

const UploadModal = ({ onClose }) => {
  console.log('Rendering UploadModal Component');
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    // Prepare the form data for the upload
    const formData = new FormData();
    formData.append('file', files[0]);  // Appending the file to FormData

    const customerId = Cookies.get('customerId'); // Fetch customerId from cookies
    const fileType = 'PROFILE_IMG';  // You can adjust this as needed for different file types

    try {
      // Using makeMultipartPostRequest method to send the file
      const response = await makeMultipartPostRequest(
        process.env.REACT_APP_BANNER_IMAGE_BASE_URL, 
        '/v1/file/upload',
        formData,
        {
          customerId,   // Custom header: customerId
          userType: 'CUSTOMER',  // Custom header: userType
          fileType,     // Custom header: fileType
        }
      );

      if (response.statusCode === 2000) {
        alert('Files uploaded successfully!');
      } else {
        alert(`Error: ${response.message}`);
      }
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files. Please try again.');
    }
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
            style={{ display: 'none' }}
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
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
