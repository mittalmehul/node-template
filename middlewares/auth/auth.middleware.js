const JWT = require('jsonwebtoken');
const { statusCodes } = require('../../utils/response/response.handler');

const { jwt } = require('../../config').getConfig();

function validateAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      // eslint-disable-next-line no-throw-literal
      throw { code: statusCodes.STATUS_CODE_UNAUTHORIZED, message: 'Unauthorized Access!' };
    }
    const authToken = req.headers.authorization.split(' ')[1];
    const authDecode = JWT.verify(authToken, jwt.secret);
    // eslint-disable-next-line no-underscore-dangle
    req._id = authDecode._id;
    // eslint-disable-next-line no-underscore-dangle
    req.userId = authDecode._id;
    req.osType = authDecode.osType;
    req.device = authDecode.device;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  validateAuth,
};
