// Mock for Resend email service
class Resend {
  constructor() {
    this.emails = {
      send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
    };
  }
}

module.exports = { Resend };
