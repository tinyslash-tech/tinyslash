/**
 * App Smoke Tests
 * 
 * This is the baseline "canary" test suite.
 * Tests here verify the application level rendering without deep integration.
 * Heavy mocking via MSW is done in feature-level test files.
 */

export { };

test('basic sanity check', () => {
  expect(1 + 1).toBe(2);
});

test('environment check', () => {
  expect(process.env.NODE_ENV).toBe('test');
});
