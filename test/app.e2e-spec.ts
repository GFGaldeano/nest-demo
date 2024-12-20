import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('Get /users/ Returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users');
    console.log(req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Get /users/:id returns a user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users/ca6282fb-8d45-4cff-b624-29f805f81f76');
    console.log(req.body);
  
    expect(req.status).toBe(200); // Verifica que el código de estado sea 200
    expect(req.body).toBeInstanceOf(Object); // Verifica que el cuerpo de la respuesta sea un objeto
  });
  
  it('Get /users/:id throws a NotFoundException if the user doesn\'t exist with a message "Usuario no encontrado"', async () => {
    const req = await request(app.getHttpServer()).get('/users/ca6282fb-8d45-4cff-b624-29f805f81f75');
    console.log(req.body);
  
    expect(req.status).toBe(404); // Verifica que el código de estado sea 404
    expect(req.body.message).toBe('Usuario no encontrado'); // Verifica que el mensaje sea "Usuario no encontrado"
  });
  
  it('Get /users/:id throws an error if id is not a UUID', async () => {
    const req = await request(app.getHttpServer()).get('/users/not-a-uuid');
    console.log(req.body);
  
    expect(req.status).toBe(400); // Verifica que el código de estado sea 400
    expect(req.body.message).toBe('Validation failed (uuid is expected)'); // Verifica que el
  });
  
  it('Post /users/signup creates a user with an OK status code', async () => {
    const req = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
      });
  
    expect(req.status).toBe(201); // Verifica que el código de estado sea 201 (Created)
    expect(req.body).toBeInstanceOf(Object); // Verifica que el cuerpo de la respuesta sea un objeto
  });
  

});
