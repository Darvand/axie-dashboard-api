import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsModule } from '../src/accounts/accounts.module';
import { AppModule } from '../src/app.module';

describe('AccountsDaily (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AccountsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('accounts daily CRUD', async (done) => {
    const server = request(app.getHttpServer());

    await server.get('/accounts-daily/123').expect(200);
    done();
  });
});
