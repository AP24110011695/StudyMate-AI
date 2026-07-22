const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

/**
 * Initialize Gemini AI client
 */
const initializeGemini = () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️  GEMINI_API_KEY not found in environment variables. AI features will be disabled.');
      return false;
    }

    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('✅ Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error.message);
    return false;
  }
};

/**
 * Get the Gemini model instance
 */
const getModel = () => {
  if (!model) {
    throw new Error('Gemini AI is not initialized. Please check GEMINI_API_KEY.');
  }
  return model;
};

/**
 * Check if Gemini is initialized
 */
const isInitialized = () => {
  return model !== null;
};

module.exports = {
  initializeGemini,
  getModel,
  isInitialized
};
