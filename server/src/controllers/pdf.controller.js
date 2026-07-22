const PDF = require('../models/PDF');
const fs = require('fs');
const path = require('path');
const { extractPDFContent } = require('../services/pdfProcessor');

// Upload PDF
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('📤 PDF upload started:', req.file.originalname);

    // Create PDF record with pending status
    const pdf = await PDF.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      processingStatus: 'pending'
    });

    // Trigger text extraction
    try {
      console.log('🔄 Starting PDF extraction...');
      pdf.processingStatus = 'processing';
      await pdf.save();

      const extractedData = await extractPDFContent(pdf.filePath);

      // Update PDF with extracted data
      pdf.extractedText = extractedData.text;
      pdf.pageCount = extractedData.pageCount;
      pdf.wordCount = extractedData.wordCount;
      pdf.readingTime = extractedData.readingTime;
      pdf.processingStatus = 'completed';
      pdf.processedAt = new Date();
      await pdf.save();

      console.log('✅ PDF processing completed');
    } catch (extractionError) {
      console.error('❌ PDF extraction failed:', extractionError.message);
      pdf.processingStatus = 'failed';
      await pdf.save();
    }

    res.status(201).json({
      success: true,
      message: 'PDF uploaded successfully',
      pdf
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading PDF',
      error: error.message
    });
  }
};

// Get all PDFs for authenticated user
exports.getAllPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ userId: req.user._id })
      .sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      count: pdfs.length,
      pdfs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching PDFs',
      error: error.message
    });
  }
};

// Get single PDF by ID
exports.getPDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Check if user owns the PDF
    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update last opened timestamp
    pdf.lastOpened = new Date();
    await pdf.save();

    res.status(200).json({
      success: true,
      pdf
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
      message: 'Error fetching PDF',
      error: error.message
    });
  }
};

// Rename PDF
exports.renamePDF = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'File name is required'
      });
    }

    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Check if user owns the PDF
    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    pdf.fileName = fileName;
    await pdf.save();

    res.status(200).json({
      success: true,
      message: 'PDF renamed successfully',
      pdf
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
      message: 'Error renaming PDF',
      error: error.message
    });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Check if user owns the PDF
    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    pdf.isFavorite = !pdf.isFavorite;
    await pdf.save();

    res.status(200).json({
      success: true,
      message: `PDF ${pdf.isFavorite ? 'added to' : 'removed from'} favorites`,
      pdf
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
      message: 'Error toggling favorite',
      error: error.message
    });
  }
};

// Delete PDF
exports.deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Check if user owns the PDF
    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete physical file
    if (fs.existsSync(pdf.filePath)) {
      fs.unlinkSync(pdf.filePath);
    }

    // Delete database record
    await PDF.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'PDF deleted successfully'
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
      message: 'Error deleting PDF',
      error: error.message
    });
  }
};

// Get PDF content
exports.getPDFContent = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found'
      });
    }

    // Check if user owns the PDF
    if (pdf.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if PDF has been processed
    if (pdf.processingStatus !== 'completed' || !pdf.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'PDF content is not available yet',
        processingStatus: pdf.processingStatus
      });
    }

    // Update last opened timestamp
    pdf.lastOpened = new Date();
    await pdf.save();

    res.status(200).json({
      success: true,
      content: pdf.extractedText,
      metadata: {
        pages: pdf.pageCount,
        words: pdf.wordCount,
        readingTime: pdf.readingTime
      }
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
      message: 'Error fetching PDF content',
      error: error.message
    });
  }
};
