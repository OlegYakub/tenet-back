
class Api {
  get uri() {
    return '/api/v1'
  }

  composeUri(url) {
    return `${this.uri}${url}`
  }

  sendError(res, status, message) {
    res.status(status).json({status, message})
  }
}

export default new Api();
