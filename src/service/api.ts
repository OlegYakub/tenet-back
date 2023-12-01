import { Response } from 'express';

class Api {
  get uri() {
    return '/api/v1'
  }

  composeUri(url: string) {
    return `${this.uri}${url}`
  }

  sendError(res: Response, status: number, message: string) {
    console.error({
      res,
      status,
      message
    })
    res.status(status).json({status, message})
  }
}

export default new Api();
