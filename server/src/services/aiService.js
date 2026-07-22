const { getModel, isInitialized } = require('../config/gemini');

const SYSTEM_PROMPT = `You are StudyMate AI. Answer ONLY using the uploaded document. If the answer is not contained in the document, respond: "I couldn't find that information in the uploaded PDF." Never invent facts. Explain concepts clearly. Use bullet points when appropriate.`;

/**
 * Send a message to Gemini AI with PDF context
 * @param {string} pdfContent - Extracted text from PDF
 * @param {string} userMessage - User's question
 * @returns {Promise<string>} AI response
 */
const sendMessage = async (pdfContent, userMessage) => {
  if (!isInitialized()) {
    throw new Error('AI service is not available. Please check GEMINI_API_KEY.');
  }

  try {
    console.log('🤖 Sending prompt to Gemini AI...');
    
    const model = getModel();
    
    // Limit context to avoid token limits (approx 100,000 characters)
    let context = pdfContent;
    const maxContextLength = 100000;
    
    if (pdfContent.length > maxContextLength) {
      console.log(`⚠️  Truncating PDF content from ${pdfContent.length} to ${maxContextLength} characters`);
      context = pdfContent.substring(0, maxContextLength);
    }
    
    // Build the prompt
    const prompt = `${SYSTEM_PROMPT}\n\nDocument Content:\n${context}\n\nUser Question: ${userMessage}`;
    
    // Send to Gemini with retry logic
    let response;
    let retries = 0;
    const maxRetries = 1;
    
    while (retries <= maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        response = result.response.text();
        break;
      } catch (error) {
        retries++;
        if (retries <= maxRetries) {
          console.log(`⚠️  Retry ${retries}/${maxRetries} for Gemini API...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Gemini AI response received');
    return response;
  } catch (error) {
    console.error('❌ Gemini AI error:', error.message);
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid GEMINI_API_KEY');
    }
    
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    throw new Error('Failed to get AI response: ' + error.message);
  }
};

module.exports = {
  sendMessage
};
