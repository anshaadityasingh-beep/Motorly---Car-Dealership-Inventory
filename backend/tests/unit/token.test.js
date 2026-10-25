import { generateToken, verifyToken } from '../../src/utils/token.js';

describe('Token Utility Unit Tests', () => {
  const mockPayload = { id: '60d0fe4f5311236168a109ca', role: 'user' };

  it('should generate a valid JWT token that decodes back to payload', () => {
    const token = generateToken(mockPayload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(mockPayload.id);
    expect(decoded.role).toBe(mockPayload.role);
    expect(decoded.exp).toBeDefined();
  });

  it('should throw an error for an invalid or tampered token', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
    expect(() => verifyToken(invalidToken)).toThrow();
  });

  it('should throw an error for an expired token', () => {
    const expiredToken = generateToken(mockPayload, '-1s');
    expect(() => verifyToken(expiredToken)).toThrow();
  });
});
