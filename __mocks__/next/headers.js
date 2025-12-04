// Mock for Next.js headers APIs
class MockRequestCookies {
  constructor() {
    this.cookies = new Map();
  }

  get(name) {
    const value = this.cookies.get(name);
    return value ? { name, value } : undefined;
  }

  set(name, value, _options) {
    this.cookies.set(name, typeof value === 'string' ? value : value.value);
  }

  getAll(name) {
    if (name) {
      const value = this.get(name);
      return value ? [value] : [];
    }
    return Array.from(this.cookies.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }

  has(name) {
    return this.cookies.has(name);
  }

  delete(name) {
    this.cookies.delete(name);
  }

  clear() {
    this.cookies.clear();
  }
}

// Global cookies instance
let globalCookies = new MockRequestCookies();

// Mock cookies function that returns a promise (for async usage)
const cookies = jest.fn(() => Promise.resolve(globalCookies));

const headers = jest.fn(() => Promise.resolve(new Map()));

// Helper to set cookies for testing
cookies.mockSet = (name, value) => {
  globalCookies.set(name, value);
};

cookies.mockClear = () => {
  globalCookies = new MockRequestCookies();
};

module.exports = {
  cookies,
  headers,
};
