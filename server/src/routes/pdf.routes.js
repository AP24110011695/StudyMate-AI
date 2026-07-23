const Router = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const pdfController = require('../controllers/pdf.controller');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

const router = Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateId = [
  param('id').isMongoId().withMessage('Invalid PDF ID'),
  validateRequest
];

// All routes require authentication
router.use(auth);

// Upload PDF
router.post('/upload', upload.single('pdf'), pdfController.uploadPDF);

// Get all PDFs for user
router.get('/', pdfController.getAllPDFs);

// Get single PDF
router.get('/:id', validateId, pdfController.getPDF);

// Get PDF content
router.get('/:id/content', validateId, pdfController.getPDFContent);

// Rename PDF
router.patch('/:id', [
  ...validateId,
  body('fileName').trim().notEmpty().withMessage('New file name is required'),
  validateRequest
], pdfController.renamePDF);

// Toggle favorite
router.patch('/:id/favorite', validateId, pdfController.toggleFavorite);

// Delete PDF
router.delete('/:id', validateId, pdfController.deletePDF);

module.exports = router;
