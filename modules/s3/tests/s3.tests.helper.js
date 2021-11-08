/* eslint no-undef: 0 */
/* eslint no-unused-expressions: 0 */

const {
  statusCodes: { STATUS_CODE_SUCCESS, STATUS_CODE_INVALID_FORMAT },
} = require('../../../utils/response/response.handler');
const { checkIfUserExists } = require('../../users/tests/users.tests.helper');

let authToken = null;

const getUserData = async (done = () => {}) => {
  const user = await checkIfUserExists();
  const { tokens } = user;
  authToken = tokens && tokens.find(item => item.device === 'desktop' && item.osType === 'web').token;
  return done();
};

const getS3LinkAPI = async ({ chai, app }) => {
  const { expect } = chai;

  before((done) => {
    getUserData(done);
  });

  describe('provide signed url', () => {
    it('it should provide s3 link', (done) => {
      const key = 'test.png';
      const location = 'schoolId';
      chai
        .request(app)
        .get('/v4/auth/upload-signed-url')
        .set({ Authorization: `jwt ${authToken}` })
        .query({ key, location })
        .end((err, res) => {
          expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
          expect(res).to.satisfyApiSpec;
          done();
        });
    });

    it('it should not provide url because location missing', (done) => {
      const key = 'test.png';
      chai
        .request(app)
        .get('/v4/auth/upload-signed-url')
        .set({ Authorization: `jwt ${authToken}` })
        .query({ key })
        .end((err, res) => {
          expect(res.body.code).to.equal(STATUS_CODE_INVALID_FORMAT);
          expect(res).to.satisfyApiSpec;
          done();
        });
    });

    it('it should not provide url because key missing', (done) => {
      const location = 'schoolId';
      chai
        .request(app)
        .get('/v4/auth/upload-signed-url')
        .set({ Authorization: `jwt ${authToken}` })
        .query({ location })
        .end((err, res) => {
          expect(res.body.code).to.equal(STATUS_CODE_INVALID_FORMAT);
          expect(res).to.satisfyApiSpec;
          done();
        });
    });
  });
};

module.exports = {
  getS3LinkAPI,
};
