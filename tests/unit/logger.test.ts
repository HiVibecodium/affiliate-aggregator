/**
 * Unit tests for logger utility
 */

describe('Logger', () => {
  it('should have log method', () => {
    const { logger } = require('@/lib/logger');
    expect(logger.log).toBeDefined();
    expect(typeof logger.log).toBe('function');
  });

  it('should have error method', () => {
    const { logger } = require('@/lib/logger');
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('should have warn method', () => {
    const { logger } = require('@/lib/logger');
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('should have info method', () => {
    const { logger } = require('@/lib/logger');
    expect(logger.info).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should have debug method', () => {
    const { logger } = require('@/lib/logger');
    expect(logger.debug).toBeDefined();
    expect(typeof logger.debug).toBe('function');
  });

  it('should not throw when called', () => {
    const { logger } = require('@/lib/logger');

    expect(() => logger.log('test')).not.toThrow();
    expect(() => logger.error('test')).not.toThrow();
    expect(() => logger.warn('test')).not.toThrow();
    expect(() => logger.info('test')).not.toThrow();
    expect(() => logger.debug('test')).not.toThrow();
  });

  it('should handle multiple arguments', () => {
    const { logger } = require('@/lib/logger');

    expect(() => logger.log('msg', 123, { foo: 'bar' })).not.toThrow();
  });

  it('should handle objects', () => {
    const { logger } = require('@/lib/logger');
    const obj = { key: 'value' };

    expect(() => logger.info('Info:', obj)).not.toThrow();
  });
});
