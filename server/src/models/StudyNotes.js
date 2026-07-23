const mongoose = require('mongoose');

const studyNotesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PDF',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  importantConcepts: [{
    type: String
  }],
  definitions: [{
    term: String,
    definition: String
  }],
  importantFormulas: [{
    type: String
  }]
}, {
  timestamps: true
});

studyNotesSchema.index({ userId: 1, pdfId: 1 });

module.exports = mongoose.model('StudyNotes', studyNotesSchema);
