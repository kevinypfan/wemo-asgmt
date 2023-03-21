import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/user/entities/user.entity';
import { ResponseUserDto } from '../src/auth/dto/response-user.dto';
import { delay, randomLicensePlates } from '../src/utils/helpers';
import { Scooter } from 'src/scooter/entities/scooter.entity';
import { Rent } from 'src/rent/entities/rent.entity';

const mockUsers = [
  {
    username: 'testkevin',
    email: 'testkevin@test.com',
    roles: 'admin',
  },
  {
    username: 'testallen',
    email: 'testallen@test.com',
    roles: 'user',
  },
];

const mockUser = {
  username: 'testuser',
  email: 'testuser@test.com',
  roles: 'user',
  password: 'Abcd1234',
};

const brands = ['SYM', 'KYMCO', 'HONDA', 'YAMAHA', 'SUZUKI', 'AEON'];

const licensePlates = randomLicensePlates(30);

const mockScooters = licensePlates.map((plate: string, index) => {
  return {
    brand: brands[index % brands.length],
    licensePlate: plate,
  };
});

describe('IntegrationTest (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let scooterRepository: Repository<Scooter>;
  let rentRepository: Repository<Rent>;
  let loggedUser: ResponseUserDto;
  let users;
  let scooters;
  let rents;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    scooterRepository = moduleFixture.get('ScooterRepository');
    userRepository = moduleFixture.get('UserRepository');
    rentRepository = moduleFixture.get('RentRepository');

    await Promise.all(
      mockScooters.map((scooter) => scooterRepository.save(scooter)),
    );
  });

  it('POST /auth/signup (0000) 註冊會員', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body.code).toEqual('0000');
  });

  it('POST /auth/login (0000) 登入會員', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');

    loggedUser = response.body.info;
  });

  it('GET /auth/profile (0000) 取得用戶資訊', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${loggedUser.accessToken}`);

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
  });

  it('GET /scooter (0000) 取得scooter', async () => {
    const params = new URLSearchParams();
    params.append('filter', JSON.stringify({ canRent: true }));

    const response = await request(app.getHttpServer())
      .get('/scooter?' + params.toString())
      .set('Authorization', `Bearer ${loggedUser.accessToken}`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
    expect(response.body.info.content.length).toEqual(20);
    expect(response.body.info.totalElements).toEqual(30);
    scooters = response.body.info.content;
    console.log({ scooters });
  });

  it('POST /rent (0000)', async () => {
    const response = await request(app.getHttpServer())
      .post('/rent')
      .send({ idScooters: scooters[0].idScooters })
      .set('Authorization', `Bearer ${loggedUser.accessToken}`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(201);
    expect(response.body.code).toEqual('0000');
  });

  it('GET /rent (0000)', async () => {
    const response = await request(app.getHttpServer())
      .get('/rent')
      .set('Authorization', `Bearer ${loggedUser.accessToken}`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
    expect(response.body.info.length).toEqual(1);
    rents = response.body.info;
  });

  it('DELETE /rent/:id (0000)', async () => {
    let response = await request(app.getHttpServer())
      .delete('/rent/' + rents[0].idRents)
      .set('Authorization', `Bearer ${loggedUser.accessToken}`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');

    response = await request(app.getHttpServer())
      .get('/rent')
      .set('Authorization', `Bearer ${loggedUser.accessToken}`)
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('0000');
    expect(response.body.info.length).toEqual(0);
  });

  afterAll(async () => {
    await scooterRepository.query('DELETE FROM core_scooters');
    await userRepository.query('DELETE FROM core_users');
    await rentRepository.query('DELETE FROM core_rents');
  });
});
