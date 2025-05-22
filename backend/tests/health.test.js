const request = require('supertest');
const app = require('../index'); // assuming index exports Express app

describe('Health Check', () => {
  it('should return status ok', done => {
    request(app).get('/health').expect(200).expect(res => {
      if(res.body.status !== 'ok') throw new Error('Invalid status');
    }).end(done);
  });
});