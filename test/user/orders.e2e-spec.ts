import request from 'supertest';
import { APP_URL } from '../../src/utils/constants';
import { setupAdmin, setupUser } from '../setup';
import { ordersMock } from '../mocks/orders.mock';

describe('OrdersController (e2e)', () => {
  const app = APP_URL;
  let adminToken: string;
  let userToken: string;
  let orderId: number;

  beforeAll(async () => {
    adminToken = await setupAdmin(app);
    userToken = await setupUser(app);
  });

  describe('/orders (POST)', () => {
    it('it should make order', async () => {
      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(ordersMock)
        .expect(201);

      orderId = res.body.id;
    });
  });

  describe('/orders (DELETE)', () => {
    it('should delete orders', async () => {
      return await request(app)
        .delete(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
