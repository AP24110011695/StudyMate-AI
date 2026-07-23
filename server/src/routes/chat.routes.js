const Router = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const chatController = require('../controllers/chat.controller');
const auth = require('../middleware/auth');

const router = Router();

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

// All routes require authentication
router.use(auth);

// Send message to AI
router.post('/:pdfId', [
  ...validatePdfId,
  body('message').trim().notEmpty().withMessage('Message is required'),
  validateRequest
], chatController.sendMessage);

// Get chat history for PDF
router.get('/:pdfId/history', validatePdfId, chatController.getHistory);

// Clear chat history for PDF
router.delete('/:pdfId/history', validatePdfId, chatController.clearHistory);

module.exports = router;
