const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Allowed image types ────────────────────────────
const ALLOWED_TYPES = /(jpeg|jpg|png|webp)/i;

// ── Auto-create upload directories if they don't exist ──
const uploadDir = path.join(__dirname, "../uploads/paymentProofs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads/paymentProofs directory");
}

// ── Storage config ─────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `payment-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// ── File filter ────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = (file.mimetype || '').toLowerCase();

  const isExtAllowed = ALLOWED_TYPES.test(ext);
  const isMimeAllowed = mimetype.startsWith('image/');

  if (isExtAllowed && isMimeAllowed) return cb(null, true);

  const err = new Error('Only image files are allowed (jpeg, jpg, png, webp)');
  err.code = 'INVALID_FILE_TYPE';
  return cb(err, false);
};

// ── Multer instance ────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// ── Profile picture upload (memory storage for cloudinary) ──
const memoryStorage = multer.memoryStorage();

const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB max
  },
});

// Helper wrappers to simplify usage in routes and provide consistent error handling
const singleUpload = (field) => (req, res, next) => {
  const handler = upload.single(field);
  handler(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

const singleMemory = (field) => (req, res, next) => {
  const handler = uploadMemory.single(field);
  handler(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

// Multer error handler middleware — use this as the last error-handling middleware
const multerErrorHandler = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ message: err.message, code: err.code });
  }

  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ message: err.message, code: err.code });
  }

  // Fallback to next error handler
  return next(err);
};

module.exports = {
  upload,
  uploadMemory,
  singleUpload,
  singleMemory,
  multerErrorHandler,
};