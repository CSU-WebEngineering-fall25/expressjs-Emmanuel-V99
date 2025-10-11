//Complete the error handling middleware
module.exports = (err, req, res, next) => {
  const requestId = req && req.requestId ? req.requestId : undefined;
  const url = req && req.originalUrl ? req.originalUrl : (req && req.url) || '';
  const method = req && req.method ? req.method : '';

  // Log full error details to console (or replace with winston if desired)
  console.error('Error occurred:', {
    message: err && err.message,
    stack: err && err.stack,
    url,
    method,
    requestId
  });

  // express-validator errors are provided via an object or thrown earlier; tests expect simple messages
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || null
    });
  }

  // Handle body parser malformed JSON errors (SyntaxError)
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Malformed JSON',
      message: 'Invalid JSON payload'
    });
  }

  if (err && err.message === 'Comic not found') {
    return res.status(404).json({
      error: 'Comic not found',
      message: 'The requested comic does not exist'
    });
  }

  if (err && err.message === 'Invalid comic ID') {
    return res.status(400).json({
      error: 'Invalid comic ID',
      message: 'Comic ID must be a positive integer'
    });
  }

  if (err && err.isOperational && err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      timestamp: err.timestamp || Date.now()
    });
  }

  // Default: do not leak internal error details
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end'
  });
};