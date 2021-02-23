
import Image from '../models/imageModel';

class ImageController {
  static async upload(req, res) {
    console.log('Image', Image);

    const image = await Image.create({path: req.file.path});
    console.log('new image created', image);

    res.send({image})
  }
}

export default ImageController;
