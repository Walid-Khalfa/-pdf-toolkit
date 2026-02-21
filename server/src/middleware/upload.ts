import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

export const uploadConfig = {
  maxFileSize: MAX_FILE_SIZE,
};