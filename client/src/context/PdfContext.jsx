import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const PdfContext = createContext();

export const usePdf = () => useContext(PdfContext);

export const PdfProvider = ({ children }) => {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPdfs();
    } else {
      setPdfs([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pdfs');
      const normalizedPdfs = (response.pdfs || []).map(pdf => ({
        ...pdf,
        name: pdf.fileName,
        size: (pdf.fileSize / (1024 * 1024)).toFixed(1),
        uploadedAt: pdf.uploadDate
      }));
      setPdfs(normalizedPdfs);
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    const response = await api.postFormData('/pdfs/upload', formData);
    await fetchPdfs();
    return response.pdf;
  };

  const deletePdf = async (id) => {
    await api.delete(`/pdfs/${id}`);
    setPdfs(pdfs.filter(pdf => pdf._id !== id));
  };

  const renamePdf = async (id, newName) => {
    const response = await api.patch(`/pdfs/${id}`, { fileName: newName });
    setPdfs(pdfs.map(pdf => pdf._id === id ? response.pdf : pdf));
  };

  const toggleFavorite = async (id) => {
    const response = await api.patch(`/pdfs/${id}/favorite`);
    setPdfs(pdfs.map(pdf => pdf._id === id ? response.pdf : pdf));
  };

  return (
    <PdfContext.Provider value={{ pdfs, loading, uploadPdf, deletePdf, renamePdf, toggleFavorite, fetchPdfs }}>
      {children}
    </PdfContext.Provider>
  );
};
