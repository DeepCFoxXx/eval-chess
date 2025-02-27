import request from 'supertest';
import app from '../index.js';

describe('GET /api/state', () => {
  it('should return game state', async () => {
    const res = await request(app).get('/api/state');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('fen');
  });
});
