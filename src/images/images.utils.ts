import * as fs from 'fs';
import { promisify } from 'util';

export const getUploadsPath = () => `${__dirname}/../../content`;

export const deleteImageFile = async (filename: string) => {
  const unlinkAsync = promisify(fs.unlink);
  const uploadsPath = getUploadsPath();
  const imagePath = `${uploadsPath}/${filename}`;
  await unlinkAsync(imagePath);
};
