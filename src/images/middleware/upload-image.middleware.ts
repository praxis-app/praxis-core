import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { getUploadsPath } from '../images.utils';

export const VALID_IMAGE_FORMAT = /(jpe?g|png|gif|webp)$/;

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, getUploadsPath());
  },
  filename: (_req, file, callback) => {
    const extension = file.mimetype.split('/')[1];
    callback(null, `${Date.now()}.${extension}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const extension = file.mimetype.split('/')[1];
  if (extension.match(VALID_IMAGE_FORMAT)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter,
  storage,
});

export const uploadImage = upload.single('file');
