const mongoose = require('mongoose');

exports.getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    message: 'StudyMate AI Backend Running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};
