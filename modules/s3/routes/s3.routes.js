const { getS3SignedUrl } = require('../controllers/s3.controller');
const { swaggerValidation } = require('../../../utils/apiDocs/swagger');

module.exports = (router) => {
  router.get('/v4/auth/upload-signed-url', swaggerValidation.validate, getS3SignedUrl);
};
