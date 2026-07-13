import "./RecentPDFs.css";

function RecentPDFs({ pdfs, onDelete }) {
  return (
    <div className="recent-pdfs">

      <h2>Recent PDFs</h2>

      {pdfs.length === 0 ? (
        <div className="empty-state">

<h3>No PDFs Yet</h3>

<p>Upload your first PDF to begin studying.</p>

</div>
      ) : (
        pdfs.map((pdf, index) => (
          <div className="pdf-card" key={index}>

            <div className="left">

              <span>📄</span>

              <div>

  <h4>{pdf.name}</h4>

  <small>

    {pdf.size} MB • {pdf.uploadedAt}

  </small>

</div>

            </div>

            <button
              className="delete-btn"
              onClick={() => onDelete(index)}
            >
              ✕
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default RecentPDFs;
