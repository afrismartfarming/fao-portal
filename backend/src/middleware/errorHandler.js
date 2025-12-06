// backend/src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Default response
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate value entered";
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((v) => v.message).join(", ");
  }

  // Final structured response
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorHandler;

