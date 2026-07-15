import { useState } from "react";
import "./UploadModal.css";

function UploadModal({ open, onClose, onFileSelect }) {
  const [error, setError] = useState("");

  if (!open) return null;

  const handleClose = () => {
    setError("");
    onClose();
  };

  const processFiles = (files) => {
    setError("");
    const validFiles = files.filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    
    if (validFiles.length !== files.length) {
      setError("Please upload only valid PDF files.");
      if (validFiles.length === 0) return;
    }

    validFiles.forEach(file => onFileSelect(file));
    
    if (validFiles.length === files.length) {
      handleClose();
    }
  };

  function handleDrop(e){
    e.preventDefault();
    processFiles(Array.from(e.dataTransfer.files));
  }

  function handleDragOver(e){
    e.preventDefault();
  }

  function handleInput(e){
    processFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  return(
    <div className="overlay" style={{ animation: 'fadeUp 0.3s forwards' }}>
      <div className="card modal">
        <h2>Upload PDF</h2>

        {error && <div className="error-message" style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</div>}

        <div
          className="dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h1>📄</h1>
          <h3>Drag & Drop PDF Here</h3>
          <p>or</p>
          <label className="btn btn-outline browse" style={{ marginTop: 10 }}>
            Browse File
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleInput}
              hidden
            />
          </label>
        </div>

        <button className="btn btn-outline" onClick={handleClose} style={{ width: '100%', marginTop: 20 }}>
          Close
        </button>
      </div>
    </div>
  )
}

export default UploadModal;