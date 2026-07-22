const Router = require('express').Router();
const pdfController = require('../controllers/pdf.controller');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

const router = Router();

// All routes require authentication
router.use(auth);

// Upload PDF
router.post('/upload', upload.single('pdf'), pdfController.uploadPDF);

// Get all PDFs for user
router.get('/', pdfController.getAllPDFs);

// Get single PDF
router.get('/:id', pdfController.getPDF);

// Get PDF content
router.get('/:id/content', pdfController.getPDFContent);

// Rename PDF
router.patch('/:id', pdfController.renamePDF);

// Toggle favorite
router.patch('/:id/favorite', pdfController.toggleFavorite);

// Delete PDF
router.delete('/:id', pdfController.deletePDF);

module.exports = router;
