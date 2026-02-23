const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@gmail.com`,
        password: 'Test@1234',
        role: 'user',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /api/auth/login - should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@gmail.com',
        password: 'Test@1234',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /api/auth/login - should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@gmail.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(401);
  });
});
