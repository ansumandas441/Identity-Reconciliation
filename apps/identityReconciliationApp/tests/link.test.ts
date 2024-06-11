import describe from 'node:test';
import app from '../dist/src/app';
import supertest from 'supertest';

describe('GET /cart/api/total', ()=>{
    test('should return the total order value of the cart', async ()=>{
      return supertest(app)
        .get('/cart/api/total')
        .set('Cookie', [`token=${token}`])
        .send(cartData.cartEntry)
        .expect('Content-Type',/application\/json/)
        .expect(200);
    });  
  },
  );  