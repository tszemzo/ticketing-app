import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';
import { EMAIL } from '../../test/constants';

it('should respond with details about the current user', async () => {
  const cookie = await signup();
  
  const response = await request(app)
    .get('/api/users/currentUser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
    
  expect(response.body.currentUser.email).toEqual(EMAIL);
});

it('should respond with null if not authenticated', async () => {  
  const response = await request(app)
    .get('/api/users/currentUser')
    .send()
    .expect(200);
  
  expect(response.body.currentUser).toEqual(null);
});