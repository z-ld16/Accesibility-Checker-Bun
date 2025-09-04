type ApplicationErrorPayload = {
  message: string
  statusCode: number
  debugMessage?: string
}

export function throwError(errorPayload: ApplicationErrorPayload): never {
  throw new ApplicationError(errorPayload)
}

export class ApplicationError extends Error {
  public statusCode: number
  public debugMessage?: string
  constructor({ message, statusCode, debugMessage }: ApplicationErrorPayload) {
    super()
    this.message = message
    this.statusCode = statusCode
    this.debugMessage = debugMessage
  }
}
