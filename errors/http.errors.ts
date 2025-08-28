export class NotFoundError extends Error {
  constructor() {
    super()
    this.message = 'Resource not found'
  }
}

export class ServerError extends Error {
  constructor() {
    super()
    this.message = 'Server Error, contact suppport'
  }
}
