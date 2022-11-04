const { Profile, Contract, Job } = require('../src/model');
const app = require('../src/app');
const assert = require('assert');
const { ErrorCodes } = require('../src/errors');
const request = require('supertest')(app);

describe('/balances', function () {
  describe('/deposit/:userId', function () {
    beforeEach(async () => {
      // Drop database and fill with custom data
      await Profile.sync({ force: true });
      await Contract.sync({ force: true });
      await Job.sync({ force: true });

      await Promise.all([
        Profile.create({
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        }),
        Profile.create({
          id: 5,
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        }),
        Contract.create({
          id: 1,
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 5,
        }),
        Job.create({
          description: 'work',
          price: 200,
          ContractId: 1,
        }),
      ]);
    });
    it('should return 200 if amount is below 25% of max unpaid jobs', function () {
      return request
        .post('/balances/deposit/1')
        .send({ amount: 10 })
        .set('profile_id', '1')
        .expect(200);
    });
    it('should return error if amount is above 25% of max unpaid jobs', function () {
      return request
        .post('/balances/deposit/1')
        .send({ amount: 100 })
        .set('profile_id', '1')
        .then((response) => {
          assert(response.body.code, ErrorCodes.TOO_HIGH_AMOUNT);
        });
    });
    it('should return error if client is invalid', function () {
      return request
        .post('/balances/deposit/1')
        .send({ amount: 100 })
        .set('profile_id', '5')
        .then((response) => {
          assert(response.body.code, ErrorCodes.CLIENT_NOT_FOUND);
        });
    });
  });
});
