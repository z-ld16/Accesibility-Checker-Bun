export class UsernameAlreadyExistsError extends Error {
  constructor(message: string) {
    super()
    this.message = message
  }
}

export class UserNotFound extends Error {
  constructor(message: string) {
    super()
    this.message = message
  }
}

export class InvalidPasswordError extends Error {
  constructor(message: string) {
    super()
    this.message = message
  }
}
