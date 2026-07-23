import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import UploadModal from "../../components/UploadModal/UploadModal";
import {
  Search,
  Grid3x3,
  List,
  Star,
  StarOff,
  MoreVertical,
  Trash2,
  Edit2,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Upload,
  FileText,
  HardDrive,
  Clock,
  Heart
} from "lucide-react";
import { usePdf } from "../../context/PdfContext";
import "./MyPDFs.css";

function MyPDFs() {
  const { pdfs, loading: isLoading, uploadPdf, deletePdf, renamePdf, toggleFavorite } = usePdf();
  const favorites = pdfs.filter(pdf => pdf.isFavorite).map(pdf => pdf.name);
  
  const [viewMode, setViewMode] = useState(() => {
    const savedView = localStorage.getItem("pdfViewMode");
    return savedView || "grid";
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPdf, setEditingPdf] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    localStorage.setItem("pdfViewMode", viewMode);
  }, [viewMode]);

  const filteredAndSortedPdfs = pdfs
    .filter((pdf) => {
      const matchesSearch = pdf.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" && favorites.includes(pdf.name)) ||
        (filter === "recent" && isRecentlyUploaded(pdf));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        case "oldest":
          return new Date(a.uploadedAt) - new Date(b.uploadedAt);
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        case "size":
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

  const isRecentlyUploaded = (pdf) => {
    const uploadDate = new Date(pdf.uploadedAt);
    const now = new Date();
    const diffDays = (now - uploadDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const handleUpload = () => setModalOpen(true);

  const handleFileSelect = async (file) => {
    try {
      await uploadPdf(file);
      setModalOpen(false);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload PDF');
    }
  };

  const handleDelete = async (pdfId) => {
    if (window.confirm("Are you sure you want to delete this PDF? This action cannot be undone.")) {
      try {
        await deletePdf(pdfId);
        setMenuOpen(null);
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleToggleFavorite = async (pdfId, e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(pdfId);
    } catch (error) {
      console.error('Toggle favorite failed', error);
    }
  };

  const handleOpen = (pdfName) => {
    setMenuOpen(null);
    // TODO: implement open logic, e.g. navigate to notes or chat
  };

  const handleRename = (pdfId, currentName) => {
    setEditingPdf(pdfId);
    setNewName(currentName);
    setMenuOpen(null);
  };

  const saveRename = async () => {
    if (newName && editingPdf) {
      try {
        await renamePdf(editingPdf, newName);
      } catch (error) {
        console.error('Rename failed', error);
      }
    }
    setEditingPdf(null);
    setNewName("");
  };

  const cancelRename = () => {
    setEditingPdf(null);
    setNewName("");
  };

  const toggleMenu = (pdfId, e) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === pdfId ? null : pdfId);
  };

  const getTotalStorage = () => {
    return pdfs.reduce((total, pdf) => total + parseFloat(pdf.size), 0).toFixed(1);
  };

  const getRecentlyUploadedCount = () => {
    return pdfs.filter((pdf) => isRecentlyUploaded(pdf)).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search={search} setSearch={setSearch} />

        <main className="main-content page-enter">
          <div className="pdfs-header">
            <div className="header-left">
              <h1>My PDFs</h1>
              <button className="btn btn-primary upload-btn" onClick={handleUpload}>
                <Upload size={18} />
                Upload PDF
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon pdf-icon">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total PDFs</p>
                <p className="stat-value">{pdfs.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon storage-icon">
                <HardDrive size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Storage Used</p>
                <p className="stat-value">{getTotalStorage()} MB</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon favorites-icon">
                <Heart size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Favorites</p>
                <p className="stat-value">{favorites.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon recent-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Recent Uploads</p>
                <p className="stat-value">{getRecentlyUploadedCount()}</p>
              </div>
            </div>
          </div>

          <div className="controls-bar">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search PDFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="controls-right">
              <div className="filter-dropdown">
                <Filter size={16} className="filter-icon" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All PDFs</option>
                  <option value="favorites">Favorites</option>
                  <option value="recent">Recently Uploaded</option>
                </select>
              </div>

              <div className="sort-dropdown">
                <ArrowUpDown size={16} className="sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name-az">Name A-Z</option>
                  <option value="name-za">Name Z-A</option>
                  <option value="size">Size</option>
                </select>
              </div>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={`pdfs-container ${viewMode}`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="pdf-card skeleton-card">
                  <div className="skeleton skeleton-icon"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-info"></div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedPdfs.length === 0 ? (
            <EmptyState
              icon="pdf"
              title={search ? "No PDFs Found" : "No PDFs Yet"}
              description={
                search
                  ? "Try adjusting your search or filters."
                  : "Upload your first PDF to begin building your library."
              }
              actionText="Upload PDF"
              onAction={handleUpload}
            />
          ) : (
            <div className={`pdfs-container ${viewMode}`}>
              {filteredAndSortedPdfs.map((pdf, index) => (
                <div key={index} className="pdf-card">
                  <div className="pdf-icon-wrapper">
                    <FileText size={32} className="pdf-icon" />
                  </div>

                  {editingPdf === pdf._id ? (
                    <div className="rename-form">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="rename-input"
                        autoFocus
                        onBlur={saveRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename();
                          if (e.key === "Escape") cancelRename();
                        }}
                      />
                      <button className="btn btn-primary save-btn" onClick={saveRename}>
                        Save
                      </button>
                      <button className="btn btn-outline cancel-btn" onClick={cancelRename}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="pdf-info">
                        <h3 className="pdf-name">{pdf.name}</h3>
                        <div className="pdf-meta">
                          <span className="meta-item">
                            <span className="meta-label">Uploaded:</span>
                            {formatDate(pdf.uploadedAt)}
                          </span>
                          <span className="meta-item">
                            <span className="meta-label">Size:</span>
                            {pdf.size} MB
                          </span>
                          <span className="meta-item">
                            <span className="meta-label">Last opened:</span>
                            {formatDate(pdf.lastOpened)}
                          </span>
                        </div>
                      </div>

                      <div className="pdf-actions">
                        <button
                          className="action-btn favorite-btn"
                          onClick={(e) => handleToggleFavorite(pdf._id, e)}
                          title={pdf.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          {pdf.isFavorite ? (
                            <Star size={18} className="star-filled" />
                          ) : (
                            <StarOff size={18} />
                          )}
                        </button>

                        <button
                          className="action-btn open-btn"
                          onClick={() => handleOpen(pdf._id)}
                          title="Open PDF"
                        >
                          <ExternalLink size={18} />
                        </button>

                        <div className="action-menu">
                          <button
                            className="action-btn menu-btn"
                            onClick={(e) => toggleMenu(pdf._id, e)}
                            title="More options"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {menuOpen === pdf._id && (
                            <div className="menu-dropdown">
                              <button
                                className="menu-item"
                                onClick={() => handleOpen(pdf._id)}
                              >
                                <ExternalLink size={16} />
                                Open
                              </button>
                              <button
                                className="menu-item"
                                onClick={() => handleRename(pdf._id, pdf.name)}
                              >
                                <Edit2 size={16} />
                                Rename
                              </button>
                              <button
                                className="menu-item"
                                onClick={(e) => handleToggleFavorite(pdf._id, e)}
                              >
                                {pdf.isFavorite ? (
                                  <>
                                    <StarOff size={16} />
                                    Remove Favorite
                                  </>
                                ) : (
                                  <>
                                    <Star size={16} />
                                    Add to Favorites
                                  </>
                                )}
                              </button>
                              <button
                                className="menu-item delete"
                                onClick={() => handleDelete(pdf._id)}
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}

export default MyPDFs;
