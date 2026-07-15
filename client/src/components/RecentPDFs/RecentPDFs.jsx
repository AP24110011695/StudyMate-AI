import EmptyState from "../EmptyState/EmptyState";
import "./RecentPDFs.css";

function RecentPDFs({ pdfs, onDelete, isLoading, onUpload }) {
  return (
    <div className="card recent-pdfs">
      <h2>Recent PDFs</h2>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="pdf-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8 }}></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
                <div className="skeleton" style={{ width: '30%', height: 12 }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : pdfs.length === 0 ? (
        <EmptyState 
          icon="pdf" 
          title="No PDFs Yet" 
          description="Upload your first PDF to begin studying." 
          actionText="Upload PDF"
          onAction={onUpload}
        />
      ) : (
        <div className="pdf-list">
          {pdfs.map((pdf, index) => (
            <div className="pdf-card" key={index}>
              <div className="left">
                <span>📄</span>
                <div>
                  <h4>{pdf.name}</h4>
                  <small>{pdf.size} MB • {pdf.uploadedAt}</small>
                </div>
              </div>
              <button className="delete-btn" onClick={() => onDelete(index)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentPDFs;
