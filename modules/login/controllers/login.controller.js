const { errorResponse, successResponse } = require('../../../utils/response/response.handler');
const { logger } = require('../../../utils/logs/logger');
const { postAsync } = require('../../../utils/request/request');
const { url } = require('../../../config').getConfig();
const { postAsyncOnboarding } = require('../../../services/onboarding/onboarding.service');
const socialLogin = async (req, res) => {
  try {
    const { socialToken, osType, device } = req.body;
    const { type } = req.params;
    const options = {
      uri: `${url.onboarding_service}/v4/login/social/${type}`,
      body: {
        socialToken,
        osType,
        device,
      },
      json: true,
    };
    const socialLoginData = await postAsync(options);

    logger.info(
      `LOGIN_CONTROLLER: method: socialLogin -> social token : ${socialToken}, type: ${type} `,
    );
    return successResponse({
      req,
      res,
      data: socialLoginData.data,
      message: socialLoginData.message,
    });
  } catch (error) {
    return errorResponse({ req, res, error });
  }
};

const login = async (req, res) => {
  try {
    const {
      mobile, email, countryCode, password, osType, device,
    } = req.body;
    const options = {
      uri: `${url.onboarding_service}/v4/login`,
      body: {
        mobile,
        email,
        countryCode,
        password,
        osType,
        device,
      },
      json: true,
    };
    const loginData = await postAsync(options);
    const { userId } = loginData.data;
    logger.info(
      `LOGIN_CONTROLLER: method: login -> user login : userId ${userId} logged in successfully `,
    );
    delete loginData.data.userId;
    return successResponse({
      req,
      res,
      data: loginData.data,
      message: loginData.message,
    });
  } catch (error) {
    return errorResponse({ req, res, error });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { mobile, countryCode, autoReadHash } = req.body;
    const options = {
      uri: `${url.onboarding_service}/v4/login/send-otp`,
      body: {
        mobile,
        countryCode,
        autoReadHash,
      },
      json: true,
    };
    const sendOTPData = await postAsync(options);
    const { userId } = sendOTPData.data;
    logger.info(
      `LOGIN_CONTROLLER: method: resendOTP -> resend OTP : ${userId} login via OTP sent `,
    );
    delete sendOTPData.data.userId;
    return successResponse({
      req,
      res,
      data: sendOTPData.data,
      message: sendOTPData.message,
    });
  } catch (error) {
    return errorResponse({ req, res, error });
  }
};

const enrollmentNoLogin = async (req, res) => {
  try {
    const {
      mypatEnrollmentNo, password, osType, device,
    } = req.body;
    const options = {
      uri: `${url.onboarding_service}/v4/enrollment-login`,
      body: {
        mypatEnrollmentNo,
        password,
        osType,
        device,
      },
      json: true,
    };
    const enrollmentNoLoginData = await postAsync(options);

    logger.info(
      `LOGIN_CONTROLLER: method: enrollmentNoLogin -> mypatEnrollmentNo : ${mypatEnrollmentNo}`,
    );
    return successResponse({
      req,
      res,
      data: enrollmentNoLoginData.data,
      message: enrollmentNoLoginData.message,
    });
  } catch (error) {
    return errorResponse({ req, res, error });
  }
};

const passcodeLogin = async (req, res) => {
  try {
    const {
      userId, passcode, osType, device, tag,
    } = req.body;
    const options = {
      api: '/v4/passcode-login',
      body: {
        userId,
        passcode,
        osType,
        device,
        tag,
      },
      json: true,
    };
    const passcodeloginData = await postAsyncOnboarding(options);

    logger.info(
      'LOGIN_CONTROLLER: method: passcodeLogin',
    );
    return successResponse({
      req,
      res,
      data: passcodeloginData.data,
      message: passcodeloginData.message,
    });
  } catch (error) {
    return errorResponse({ req, res, error });
  }
};

module.exports = {
  socialLogin,
  enrollmentNoLogin,
  login,
  sendOTP,
  passcodeLogin,
};
