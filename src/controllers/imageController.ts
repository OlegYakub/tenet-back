import { Request, Response } from 'express';

import { Image } from '../models/image.model';

class ImageController {
  static async upload(req: Request, res: Response) {

    console.log('@@@req body', req.body)

    const image = await Image.create({path: req.body.uploadedFilePath});

    res.send({image})
  }
}

export default ImageController;
