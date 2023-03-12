import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Scooter } from 'src/scooter/entities/scooter.entity';
import * as jwt from 'jsonwebtoken';
import { randomLicensePlates } from '../src/utils/helpers';

const brands = ['SYM', 'KYMCO', 'HONDA', 'YAMAHA', 'SUZUKI', 'AEON'];

const licensePlates = randomLicensePlates(32);

const mockPostScooter = {
  brand: 'YAMAHA',
  licensePlate: licensePlates.pop(),
};

const mockPatchScooter = {
  brand: 'YAMAHA',
  licensePlate: licensePlates.pop(),
};

const mockUsers = [
  {
    sub: 1,
    username: 'testkevin',
    email: 'testkevin@test.com',
    roles: 'admin',
  },
  {
    sub: 2,
    username: 'testallen',
    email: 'testallen@test.com',
    roles: 'user',
  },
];

describe('ScooterController (e2e)', () => {
  let app: INestApplication;
  let scooterRepository: Repository<Scooter>;
  const users = [];
  const scooters = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    scooterRepository = moduleFixture.get('ScooterRepository');
    mockUsers.forEach((mu) => {
      const u = {
        ...mu,
        accessToken: jwt.sign(mu, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }),
      };
      users.push(u);
    });

    await Promise.all(
      licensePlates.map(async (plate: string, index) => {
        const lp = {
          brand: brands[index % brands.length],
          licensePlate: plate,
        };
        scooters.push(await scooterRepository.save(lp));
      }),
    );
  });

  describe('User', () => {
    it('GET /scooter (0000)', async () => {
      const response = await request(app.getHttpServer())
        .get('/scooter')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(20);
      expect(response.body.info.totalElements).toEqual(30);
    });

    it('GET /scooter?size=5&page=1 (0000)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/scooter')
        .query({ size: 5, page: 1 })
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(5);
      expect(response.body.info.totalElements).toEqual(30);
    });

    it('GET /scooter/:id (0000)', async () => {
      const scooter = scooters[Math.floor(Math.random() * scooters.length)];
      const response = await request(app.getHttpServer())
        .get('/scooter/' + scooter.idScooters)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.idScooters).toEqual(scooter.idScooters);
    });

    it('GET /scooter/:id (1404)', async () => {
      const response = await request(app.getHttpServer())
        .get('/scooter/0')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body.code).toEqual('1404');
    });
  });

  describe('Admin', () => {
    it('POST /admin/scooter (0000)', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/scooter')
        .send(mockPostScooter)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(201);
      expect(response.body.code).toEqual('0000');
    });

    it('POST /admin/scooter (1004)', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/scooter')
        .send(mockPostScooter)
        .set('Authorization', `Bearer ${users[1].accessToken}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
      expect(response.body.code).toEqual('1004');
    });

    it('POST /admin/scooter (1005)', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/scooter')
        .send(mockPostScooter)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(400);
      expect(response.body.code).toEqual('1005');
    });

    it('GET /admin/scooter (0000)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/scooter')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(20);
      expect(response.body.info.totalElements).toEqual(31);
    });

    it('GET /admin/scooter?size=5&page=1 (0000)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/scooter')
        .query({ size: 5, page: 1 })
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(5);
      expect(response.body.info.totalElements).toEqual(31);
    });

    it('GET /admin/scooter/:id (0000)', async () => {
      const scooter = scooters[Math.floor(Math.random() * scooters.length)];
      const response = await request(app.getHttpServer())
        .get('/admin/scooter/' + scooter.idScooters)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.idScooters).toEqual(scooter.idScooters);
    });

    it('GET /admin/scooter/:id (1404)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/scooter/0')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body.code).toEqual('1404');
    });

    it('PATCH /admin/scooter/:id (0000)', async () => {
      const scooter = scooters[Math.floor(Math.random() * scooters.length)];
      const response = await request(app.getHttpServer())
        .patch('/admin/scooter/' + scooter.idScooters)
        .send(mockPatchScooter)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.licensePlate).toEqual(
        mockPatchScooter.licensePlate,
      );
      expect(response.body.info.brand).toEqual(mockPatchScooter.brand);
    });

    it('DELETE /admin/scooter/:id (0000)', async () => {
      const scooter = scooters[Math.floor(Math.random() * scooters.length)];
      let response = await request(app.getHttpServer())
        .del('/admin/scooter/' + scooter.idScooters)
        .send(mockPatchScooter)
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');

      response = await request(app.getHttpServer())
        .get('/admin/scooter')
        .set('Authorization', `Bearer ${users[0].accessToken}`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.code).toEqual('0000');
      expect(response.body.info.content.length).toEqual(20);
      expect(response.body.info.totalElements).toEqual(30);
    });
  });

  afterAll(async () => {
    await scooterRepository.query('DELETE FROM core_scooters');
  });
});
