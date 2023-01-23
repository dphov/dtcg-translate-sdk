export class NonValidDTCGError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NonValidDTCGError"
  }
}
