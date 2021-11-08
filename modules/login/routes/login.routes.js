const loginController = require('../controllers/login.controller');
const { verifyOTP } = require('../../signup/controllers/signup.controller');
const { swaggerValidation } = require('../../../utils/apiDocs/swagger');

module.exports = (router) => {
  router.post('/v4/login/social/:type', swaggerValidation.validate, loginController.socialLogin);
  router.post('/v4/login', swaggerValidation.validate, loginController.login);
  router.post('/v4/login/send-otp', swaggerValidation.validate, loginController.sendOTP);
  router.post('/v4/login/verify-otp', swaggerValidation.validate, verifyOTP);
  router.post(
    '/v4/enrollment-login',
    swaggerValidation.validate,
    loginController.enrollmentNoLogin,
  );
  router.post(
    '/v4/passcode-login',
    loginController.passcodeLogin,
  );
};
