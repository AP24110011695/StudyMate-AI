const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text and metadata from PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Object} Extracted text and metadata
 */
const extractPDFContent = async (filePath) => {
  try {
    console.log('📖 Starting PDF extraction...');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found');
    }

    // Read file buffer
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse PDF
    const data = await pdfParse(dataBuffer);
    
    // Extract text
    const text = data.text;
    
    if (!text || text.trim().length === 0) {
      throw new Error('PDF is empty or text could not be extracted');
    }

    // Count pages
    const pageCount = data.numpages || 1;
    
    // Count words
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Estimate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    console.log('✅ PDF extraction completed');
    console.log(`   Pages: ${pageCount}, Words: ${wordCount}, Reading Time: ${readingTime} min`);
    
    return {
      text,
      pageCount,
      wordCount,
      readingTime
    };
  } catch (error) {
    console.error('❌ PDF extraction failed:', error.message);
    throw error;
  }
};

module.exports = {
  extractPDFContent
};
