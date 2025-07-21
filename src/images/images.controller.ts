import { Request, Response } from 'express';
import * as imagesService from './images.service';
import { getUploadsPath } from './images.utils';

export const getImageFile = async (req: Request, res: Response) => {
  const image = await imagesService.getImage(req.params.id);

  if (!image) {
    res.status(404).send('Image not found');
    return;
  }
  if (!image.filename) {
    res.status(404).send('Image has not been uploaded yet');
    return;
  }

  return res.sendFile(image.filename, {
    root: getUploadsPath(),
  });
};
