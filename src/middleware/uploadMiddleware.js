import multer from 'multer';
import crypto from 'crypto';
import mime from 'mime';

const imageFilter = (req, file, cb) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const genFileName = (req, file, cb) => {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
  });
};

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: genFileName,
});

export const imageUploadMiddleware = multer({
  storage,
  limits: {fileSize: 10 * 1024 * 1024}, // 10Mb upload file limit
  fileFilter: imageFilter,
});
