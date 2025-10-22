const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Handle file upload
const handleFileUpload = async (file, allowedTypes = null) => {
  try {
    // Validate file exists
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file type if allowedTypes is provided
    if (allowedTypes) {
      const fileExt = path.extname(file.name).toLowerCase();
      if (!allowedTypes.includes(fileExt)) {
        throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      }
    }

    // Create uploads directory
    const uploadsDir = createUploadsDir();

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Move file to uploads directory
    await file.mv(filePath);

    // Return file info
    return {
      filename: uniqueFilename,
      originalName: file.name,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${uniqueFilename}`
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Middleware for handling audio file uploads
const audioFileUpload = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile) {
      // No file uploaded, continue
      return next();
    }

    const allowedTypes = ['.mp3', '.wav', '.m4a', '.mp4', '.wma', '.aac', '.flac'];
    const fileInfo = await handleFileUpload(req.files.audioFile, allowedTypes);

    // Add file info to request
    req.audioFile = fileInfo;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Audio file upload failed',
      error: error.message
    });
  }
};

// Middleware for handling transcript file uploads
const transcriptFileUpload = async (req, res, next) => {
  try {
    if (!req.files || !req.files.transcriptFile) {
      // No file uploaded, continue
      return next();
    }

    const allowedTypes = ['.txt', '.doc', '.docx', '.pdf', '.rtf'];
    const fileInfo = await handleFileUpload(req.files.transcriptFile, allowedTypes);

    // Add file info to request
    req.transcriptFile = fileInfo;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Transcript file upload failed',
      error: error.message
    });
  }
};

module.exports = {
  audioFileUpload,
  transcriptFileUpload
};