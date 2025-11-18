module.exports = {
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  init: jest.fn(),
  withSentryConfig: (config) => config,
};
