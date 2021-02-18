
class ImageController {
  static async upload(req, res) {
    console.log('body', req.body);
    res.send({uri: req.file.path})

  }
}

export default ImageController;
