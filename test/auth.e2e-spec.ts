import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/user/entities/user.entity';
import { ResponseUserDto } from '../src/auth/dto/response-user.dto';
import { delay } from '../src/utils/helpers';

const mockUser = {
  username: 'testallen',
  password: 'Abcd1234',
  email: 'testallen@test.com',
  roles: 'user',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let loggedUser: ResponseUserDto;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = moduleFixture.get('UserRepository');
  });

  it('POST /auth/signup (0000)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body.code).toEqual('0000');
  });

  it('POST /auth/signup (1001)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual('1001');
  });

  it('POST /auth/login (0000)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');

    loggedUser = response.body.info;
  });

  it('POST /auth/login (1404)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...mockUser, username: 'testkevin' })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(response.body.code).toEqual('1404');
  });

  it('POST /auth/login (1002)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...mockUser, password: 'wrongpassword' })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual('1002');
  });

  it('GET /auth/login (1002)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...mockUser, password: 'wrongpassword' })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual('1002');
  });

  it('GET /auth/profile (0000)', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${loggedUser.accessToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
  });

  it('GET /auth/profile (0000)', async () => {
    await delay(2100);
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${loggedUser.accessToken}`);

    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual('1003');
  });

  it('PATCH /user/update-password (0000)', async () => {
    const newPassword = 'Test1234';

    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: mockUser.username, password: mockUser.password })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
    loggedUser = response.body.info;

    response = await request(app.getHttpServer())
      .patch('/user/update-password')
      .send({ oldPassword: mockUser.password, newPassword })
      .set('Authorization', `Bearer ${loggedUser.accessToken}`)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');

    response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: mockUser.username, password: newPassword })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM core_users');
  });
});
