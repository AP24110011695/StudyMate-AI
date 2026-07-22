const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  storedFileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  lastOpened: {
    type: Date,
    default: null
  },
  // Processing fields
  extractedText: {
    type: String,
    default: null
  },
  pageCount: {
    type: Number,
    default: null
  },
  wordCount: {
    type: Number,
    default: null
  },
  readingTime: {
    type: Number,
    default: null
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processedAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries by user
pdfSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('PDF', pdfSchema);
