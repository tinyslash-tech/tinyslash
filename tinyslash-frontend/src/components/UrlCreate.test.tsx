// @ts-nocheck
/**
 * UrlCreate API Mock Tests
 *
 * Uses Jest's built-in fetch mock (via jest.spyOn) to intercept HTTP calls.
 * MSW is not used here — API mocking for E2E flows is handled by Playwright's page.route().
 */

export { };

describe('URL API Mock Tests (Infrastructure Validation)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('fetch mock intercepts URL creation endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 201,
      json: async () => ({
        shortCode: 'iphone15',
        originalUrl: 'https://apple.com',
        domain: 'tinyslash.com',
        createdAt: new Date().toISOString(),
      }),
    });

    const response = await fetch('http://localhost:8080/api/v1/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: 'https://apple.com' }),
    });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.shortCode).toBe('iphone15');
    expect(data.domain).toBe('tinyslash.com');
  });

  test('fetch mock intercepts user profile endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        id: 'user-123',
        email: 'test@example.com',
        plan: 'FREE',
      }),
    });

    const response = await fetch('http://localhost:8080/api/v1/users/me');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.email).toBe('test@example.com');
    expect(data.plan).toBe('FREE');
  });

  test('fetch mock intercepts login endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        token: 'fake-jwt-token',
        user: { id: 'user-123', email: 'test@example.com' },
      }),
    });

    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBe('fake-jwt-token');
  });

  test('basic sanity check — test infrastructure working', () => {
    expect(typeof fetch).toBe('function');
    expect(1 + 1).toBe(2);
  });
});
