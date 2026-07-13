import "./UploadModal.css";

function UploadModal({ open, onClose, onFileSelect }) {

  if (!open) return null;

  function handleDrop(e){

    e.preventDefault();

    const files = Array.from(e.target.files);

files.forEach(file => onFileSelect(file));

onClose();

  }

  function handleDragOver(e){

    e.preventDefault();

  }

  function handleInput(e){

    const files = Array.from(e.dataTransfer.files);

files.forEach(file => onFileSelect(file));

onClose();

  }

  return(

    <div className="overlay">

      <div className="modal">

        <h2>Upload PDF</h2>

        <div
          className="dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >

          <h1>📄</h1>

          <h3>Drag & Drop PDF Here</h3>

          <p>or</p>

          <label className="browse">

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

        <button onClick={onClose}>

          Close

        </button>

      </div>

    </div>

  )

}

export default UploadModal;