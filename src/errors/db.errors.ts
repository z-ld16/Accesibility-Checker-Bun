export class DBConnectionFailedError extends Error {
  constructor() {
    super()
    this.message = 'DB connection failed.'
  }
}
