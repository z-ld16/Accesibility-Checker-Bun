export class CouldntGetCountError extends Error {
  constructor(message: string) {
    super()
    this.message = message
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super()
    this.message = message
  }
}
