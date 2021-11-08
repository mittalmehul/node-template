const { successResponse, errorResponse } = require('../../../utils/response/response.handler');
const { logger } = require('../../../utils/logs/logger');
const { getAsyncOnboarding } = require('../../../services/onboarding/onboarding.service');

const getS3SignedUrl = async (req, res) => {
  try {
    const { key } = req.query;
    const result = await getAsyncOnboarding({ api: '/v4/upload-signed-url', query: req.query });
    const { code, message, data } = result;

    logger.info(`S3_CONTROLLER: method: getS3SignedUrl -> provide PresignedUrl for ${key}`);
    return successResponse({
      req,
      res,
      data,
      message,
      code,
    });
  } catch (error) {
    return errorResponse({ req, res, error });
  }
};

module.exports = {
  getS3SignedUrl,
};
