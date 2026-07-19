const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose/MongoDB specific errors
  if (err.name === 'MongoError') {
    if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate entry detected';
    } else {
      statusCode = 500;
      message = 'Database operation failed';
    }
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  }

  if (err.name === 'MongooseError') {
    statusCode = 500;
    message = 'Database connection error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
