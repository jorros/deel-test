const { Profile, Contract, Job } = require('../src/model');
const app = require('../src/app');
const request = require('supertest')(app);

describe('/contracts', function () {
  describe('/:id', function () {
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
          id: 4,
          firstName: 'Ash',
          lastName: 'Kethcum',
          profession: 'Pokemon master',
          balance: 1.3,
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
          status: 'terminated',
          ClientId: 1,
          ContractorId: 5,
        }),
      ]);
    });
    it('should return 200 when contract found and associated with logged in user', function () {
      return request.get('/contracts/1').set('profile_id', '1').expect(200);
    });
    it('should return 404 when contract not found', function () {
      return request.get('/contracts/2').set('profile_id', '1').expect(404);
    });
    it('should return 404 when contract found, but is not connected to profile', function () {
      return request.get('/contracts/1').set('profile_id', '4').expect(404);
    });
  });
});
