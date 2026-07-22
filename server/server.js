require('dotenv').config();
const connectDB = require('./src/config/database');
const { initializeGemini } = require('./src/config/gemini');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Initialize Gemini AI
    initializeGemini();
    
    // Start Express server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 StudyMate AI Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
