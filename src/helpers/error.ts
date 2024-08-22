export class FError extends Error {
  constructor(
    message,
    public code?: number,
  ) {
    super(message);
    this.name = 'FError';
  }
}
