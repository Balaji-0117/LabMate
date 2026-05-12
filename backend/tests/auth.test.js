const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const transporter = require('../config/mail');

// Mock external services to prevent actual DB operations and emails
jest.mock('../config/db', () => {
  return {
    query: jest.fn()
  };
});
jest.mock('../config/mail', () => {
  return {
    sendMail: jest.fn()
  };
});

describe('Auth API Validation & Routing', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'not-an-email' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe('Please provide a valid email address');
    });

    it('should process valid email format and send success response if email is in team table', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ username: 'testuser', rollno: '123' }] }); // Simulate team check
      pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate user insertion

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'valid@example.com' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Verification email sent');
      expect(transporter.sendMail).toHaveBeenCalled();
    });

    it('should return 400 if email is not found in team table', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // Empty result for team check

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'notfound@example.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe('Email not found in team records');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'valid@example.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe('Password is required');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bademail', password: 'password123' });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/set-password/:token', () => {
    it('should reject short passwords', async () => {
      const res = await request(app)
        .post('/api/auth/set-password/123e4567-e89b-12d3-a456-426614174000') // Valid UUID
        .send({ password: '123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe('Password must be at least 6 characters long');
    });

    it('should reject non-UUID tokens', async () => {
      const res = await request(app)
        .post('/api/auth/set-password/not-a-uuid')
        .send({ password: 'validpassword' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe('Invalid token format');
    });
  });
});
