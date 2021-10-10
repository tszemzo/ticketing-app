import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';

const createTicket = async () => {
  const cookie = await signup();
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket_1',
      price: 10
    })
    .expect(201);
}

it('should return a list of tickets', async () => {  
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);
    
  expect(response.body.length).toEqual(3);
});
