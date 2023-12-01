import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import mime from 'mime';
import { Request } from "express";

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'));
  }
  callback(null, true);
};

const genFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
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
