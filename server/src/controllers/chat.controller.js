const PDF = require('../models/PDF');
const Chat = require('../models/Chat');
const { sendMessage } = require('../services/aiService');

// Send message to AI
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { pdfId } = req.params;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    console.log('💬 Chat started for PDF:', pdfId);

    // Find PDF
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Check ownership
    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if PDF has extracted text
    if (pdf.processingStatus !== 'completed' || !pdf.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'PDF content is not available for chat',
        processingStatus: pdf.processingStatus
      });
    }

    // Save user message
    await Chat.create({
      userId: req.user._id,
      pdfId: pdf._id,
      role: 'user',
      message: message.trim()
    });

    // Get AI response
    const answer = await sendMessage(pdf.extractedText, message);

    // Save AI response
    await Chat.create({
      userId: req.user._id,
      pdfId: pdf._id,
      role: 'assistant',
      message: answer
    });

    res.status(200).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message',
      error: error.message
    });
  }
};

// Get chat history for a PDF
exports.getHistory = async (req, res) => {
  try {
    const { pdfId } = req.params;

    // Verify PDF ownership
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get chat history
    const history = await Chat.find({
      userId: req.user._id,
      pdfId: pdfId
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid PDF ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history',
      error: error.message
    });
  }
};

// Clear chat history for a PDF
exports.clearHistory = async (req, res) => {
  try {
    const { pdfId } = req.params;

    // Verify PDF ownership
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete chat history
    await Chat.deleteMany({
      userId: req.user._id,
      pdfId: pdfId
    });

    res.status(200).json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid PDF ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error clearing chat history',
      error: error.message
    });
  }
};
