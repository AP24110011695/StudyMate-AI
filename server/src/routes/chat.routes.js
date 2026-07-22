const Router = require('express').Router();
const chatController = require('../controllers/chat.controller');
const auth = require('../middleware/auth');

const router = Router();

// All routes require authentication
router.use(auth);

// Send message to AI
router.post('/:pdfId', chatController.sendMessage);

// Get chat history for PDF
router.get('/:pdfId/history', chatController.getHistory);

// Clear chat history for PDF
router.delete('/:pdfId/history', chatController.clearHistory);

module.exports = router;
