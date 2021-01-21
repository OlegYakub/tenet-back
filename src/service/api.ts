import {Response} from 'express';

class Api {
  get uri() {
    return '/api/v1'
  }

  composeUri(url: string): string {
    return `${this.uri}${url}`
  }

  sendError(res: Response, status: number, message: string) {
    res.status(status).json({status, message})
  }
}

export default new Api();
