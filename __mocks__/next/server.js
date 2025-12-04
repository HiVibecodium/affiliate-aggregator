// Mock for Next.js server APIs
class MockRequestCookies {
  constructor() {
    this.cookies = new Map();
  }

  get(name) {
    return this.cookies.get(name);
  }

  set(name, value) {
    this.cookies.set(name, value);
  }

  getAll() {
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
}

class NextRequest {
  constructor(input, init) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers || {});
    this.cookies = new MockRequestCookies();
    this._body = init?.body;

    // Parse URL
    const url = new URL(this.url);
    this.nextUrl = {
      pathname: url.pathname,
      searchParams: url.searchParams,
      search: url.search,
      href: url.href,
    };
  }

  async json() {
    if (this._body) {
      return JSON.parse(this._body);
    }
    return null;
  }

  async text() {
    return this._body || '';
  }
}

class NextResponse {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Headers(init?.headers || {});
    this.cookies = new MockRequestCookies();
  }

  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }
    return this.body;
  }

  async text() {
    if (typeof this.body === 'string') {
      return this.body;
    }
    return JSON.stringify(this.body);
  }

  static json(data, init) {
    return new NextResponse(data, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }

  static redirect(url, status = 302) {
    return new NextResponse(null, {
      status,
      headers: {
        Location: url,
      },
    });
  }

  static next() {
    return new NextResponse(null, { status: 200 });
  }
}

module.exports = {
  NextRequest,
  NextResponse,
};
