const express = require('express');
const { param, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  generateNotes,
  generateQuiz,
  generateFlashcards
} = require('../controllers/study.controller');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validatePdfId = [
  param('pdfId').isMongoId().withMessage('Invalid PDF ID'),
  validateRequest
];

// All study routes require authentication
router.use(auth);

router.post('/:pdfId/notes', validatePdfId, generateNotes);
router.post('/:pdfId/quiz', validatePdfId, generateQuiz);
router.post('/:pdfId/flashcards', validatePdfId, generateFlashcards);

module.exports = router;
