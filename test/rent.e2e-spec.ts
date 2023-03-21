import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Scooter } from '../src/scooter/entities/scooter.entity';
import * as jwt from 'jsonwebtoken';
import { User } from '../src/user/entities/user.entity';
import { Rent } from '../src/rent/entities/rent.entity';
import * as argon2 from 'argon2';
import { randomLicensePlates } from '../src/utils/helpers';

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

const brands = ['SYM', 'KYMCO', 'HONDA', 'YAMAHA', 'SUZUKI', 'AEON'];

const licensePlates = randomLicensePlates(30);

describe('RentController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let scooterRepository: Repository<Scooter>;
  let rentRepository: Repository<Rent>;
  let users;
  let scooters;

  //   accessToken: jwt.sign(mu, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES_IN,
  //   }),

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    scooterRepository = moduleFixture.get('ScooterRepository');
    userRepository = moduleFixture.get('UserRepository');
    rentRepository = moduleFixture.get('RentRepository');

    users = await Promise.all(
      mockUsers.map(async (mu) => {
        const entity = await userRepository.create({
          ...mu,
          password: await argon2.hash('Abcd1234'),
          lastLogin: new Date(),
        });
        const user = await userRepository.save(entity);
        return user;
      }),
    );

    scooters = await Promise.all(
      licensePlates.map(async (plate: string, index) => {
        const lp = {
          brand: brands[index % brands.length],
          licensePlate: plate,
        };
        return await scooterRepository.save(lp);
      }),
    );

    await Promise.all(
      users.map(async (user) => {
        const payload = {
          sub: user.idUsers,
          username: user.username,
          email: user.email,
          roles: user.roles,
        };
        user.accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      }),
    );
  });
  describe('Admin', () => {
    it('POST /admin/rent (0000)', async () => {
      const startDate = new Date();
      const endDate = new Date();

      endDate.setHours(endDate.getHours() - 6);

      const payload = {
        idScooters: scooters[1].idScooters,
        idUsers: users[1].idUsers,
        startDate,
        endDate,
      };

      const response = await request(app.getHttpServer())
        .post('/admin/rent')
        .send(payload)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(201);
      expect(response.body.code).toEqual('0000');
    });

    it('GET /admin/rent (0000)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(1);
      expect(response.body.info.totalElements).toEqual(1);
    });

    it('PATCH /admin/rent/:id (0000)', async () => {
      let response = await request(app.getHttpServer())
        .get('/admin/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(1);
      expect(response.body.info.totalElements).toEqual(1);

      const rent = response.body.info.content[0];

      const payload = {
        idScooters: scooters[2].idScooters,
        idUsers: users[1].idUsers,
      };

      response = await request(app.getHttpServer())
        .patch('/admin/rent/' + rent.idRents)
        .send(payload)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
    });

    it('DELETE /admin/rent/:id (0000)', async () => {
      let response = await request(app.getHttpServer())
        .get('/admin/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(1);
      expect(response.body.info.totalElements).toEqual(1);

      const rent = response.body.info.content[0];

      response = await request(app.getHttpServer())
        .del('/admin/rent/' + rent.idRents)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');

      response = await request(app.getHttpServer())
        .get('/admin/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(0);
      expect(response.body.info.totalElements).toEqual(0);
    });
  });

  describe('User', () => {
    it('POST /rent (0000)', async () => {
      const response = await request(app.getHttpServer())
        .post('/rent')
        .send({ idScooters: scooters[0].idScooters })
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(201);
      expect(response.body.code).toEqual('0000');
    });

    it('POST /rent (2000)', async () => {
      const response = await request(app.getHttpServer())
        .post('/rent')
        .send({ idScooters: scooters[1].idScooters })
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(403);
      expect(response.body.code).toEqual('2000');
    });

    it('POST /rent (2001)', async () => {
      const response = await request(app.getHttpServer())
        .post('/rent')
        .send({ idScooters: scooters[0].idScooters })
        .set('Authorization', `Bearer ${users[1].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(403);
      expect(response.body.code).toEqual('2001');
    });

    it('GET /rent (0000)', async () => {
      const response = await request(app.getHttpServer())
        .get('/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.length).toEqual(1);
    });

    it('DELETE /rent/:id (0000)', async () => {
      let response = await request(app.getHttpServer())
        .get('/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.length).toEqual(1);

      response = await request(app.getHttpServer())
        .delete('/rent/' + response.body.info[0].idRents)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');

      response = await request(app.getHttpServer())
        .get('/rent')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.length).toEqual(0);
    });
  });

  afterAll(async () => {
    await scooterRepository.query('DELETE FROM core_scooters');
    await userRepository.query('DELETE FROM core_users');
    await rentRepository.query('DELETE FROM core_rents');
  });
});
