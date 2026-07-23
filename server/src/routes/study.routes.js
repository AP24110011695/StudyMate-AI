const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  generateNotes,
  generateQuiz,
  generateFlashcards
} = require('../controllers/study.controller');

// All study routes require authentication
router.use(auth);

router.post('/:pdfId/notes', generateNotes);
router.post('/:pdfId/quiz', generateQuiz);
router.post('/:pdfId/flashcards', generateFlashcards);

module.exports = router;
