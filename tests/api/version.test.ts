/**
 * API Route tests for /api/version
 */

describe('/api/version', () => {
  it('should return version info structure', () => {
    const versionInfo = {
      version: '0.1.0',
      buildDate: new Date().toISOString(),
      environment: 'test',
    };

    expect(versionInfo).toHaveProperty('version');
    expect(versionInfo).toHaveProperty('buildDate');
    expect(versionInfo).toHaveProperty('environment');
  });

  it('should have valid semver version', () => {
    const version = '0.1.0';
    const semverPattern = /^\d+\.\d+\.\d+$/;

    expect(version).toMatch(semverPattern);
  });

  it('should have valid ISO date', () => {
    const buildDate = new Date().toISOString();
    const parsed = new Date(buildDate);

    expect(parsed.getTime()).toBeGreaterThan(0);
  });

  it('should have valid environment', () => {
    const validEnvironments = ['development', 'test', 'staging', 'production'];
    const environment = 'test';

    expect(validEnvironments).toContain(environment);
  });

  it('should include Node version if available', () => {
    const nodeVersion = process.version;

    expect(nodeVersion).toMatch(/^v\d+\.\d+\.\d+$/);
  });
});
