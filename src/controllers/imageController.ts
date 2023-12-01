import { Request, Response } from 'express';

import { Image } from '../models/image.model';

class ImageController {
  static async upload(req: Request, res: Response) {

    // TODO remove ts ignore
    // @ts-ignore
    const image = await Image.create({path: req.file.path});

    res.send({image})
  }
}

export default ImageController;
