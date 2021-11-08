/* eslint no-undef: 0 */
/* eslint no-unused-expressions: 0 */
const {
  statusCodes: {
    STATUS_CODE_SUCCESS,
    STATUS_CODE_INVALID_FORMAT,
    STATUS_CODE_FORBIDDEN,
    STATUS_CODE_DATA_NOT_FOUND,
    STATUS_CODE_NOT_ACCEPTABLE,
  },
} = require('../../../utils/response/response.handler');
const { AUTOMATION_CAPTCHA_DISABLED_IPS } = require('../../../config').getConfig();
const { UserModel } = require('../../../mypat-commons/mongodb/models');
const {
  OTP: { EXPIRATION_TIME_IN_MS },
  TEST_CASES: { MYPAT_ENROLLMENT_NO },
} = require('../../../mypat-commons/constants');

const emailLoginPayload = {
  email: 'student11@mypat.in',
  password: '123456',
  osType: 'android',
  device: 'phone',
};

const invalidEmailPayload = {
  email: 'student100001@mypat.in',
  password: '123456',
  osType: 'android',
  device: 'phone',
};

const invalidPasswordEmail = {
  email: 'student11@mypat.in',
  password: '1234567',
  osType: 'android',
  device: 'phone',
};

const mobileLoginPayload = {
  countryCode: '+91',
  mobile: '7555557828',
  password: '123456',
  osType: 'web',
  device: 'desktop',
};

const invalidPasswordMobile = {
  countryCode: '+91',
  mobile: '9997718999',
  password: '123456',
  osType: 'web',
  device: 'desktop',
};

const invalidMobilePayload = {
  countryCode: '+91',
  mobile: '9990000099',
  password: '123456',
  osType: 'web',
  device: 'desktop',
};

const invalidUserSendOTP = {
  mobile: '9990000099',
  countryCode: '+91',
};

const validUserSendOTP = {
  mobile: '9997718999',
  countryCode: '+91',
};

const enrollmentLoginPayload = {
  mypatEnrollmentNo: MYPAT_ENROLLMENT_NO,
  password: 'abc@123',
  osType: 'web',
  device: 'desktop',
};

const invalidPasswordEnrollmentNo = {
  mypatEnrollmentNo: MYPAT_ENROLLMENT_NO,
  password: 'test@123',
  osType: 'web',
  device: 'desktop',
};

const invalidEnrollmentNoPayload = {
  mypatEnrollmentNo: '20000920000001',
  password: 'test@123',
  osType: 'web',
  device: 'desktop',
};

const validateLoginAPI = async ({ chai, app }) => {
  const { expect } = chai;

  const headers = {
    'x-real-ip': AUTOMATION_CAPTCHA_DISABLED_IPS[0],
  };

  it('It should login user with email and password', (done) => {
    chai
      .request(app)
      .post('/v4/login')
      .set(headers)
      .send(emailLoginPayload)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
        expect(res.body).to.to.have.nested.property('data.authToken');
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should not let user login with unregistered email', (done) => {
    chai
      .request(app)
      .post('/v4/login')
      .set(headers)
      .send(invalidEmailPayload)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_INVALID_FORMAT);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should not let user login with registered email and incorrect password', (done) => {
    chai
      .request(app)
      .post('/v4/login')
      .set(headers)
      .send(invalidPasswordEmail)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_FORBIDDEN);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should login user with mobile and password', (done) => {
    chai
      .request(app)
      .post('/v4/login')
      .set(headers)
      .send(mobileLoginPayload)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
        expect(res.body).to.to.have.nested.property('data.authToken');
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should not let user login with unregistered mobile', (done) => {
    chai
      .request(app)
      .post('/v4/login')
      .set(headers)
      .send(invalidMobilePayload)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_INVALID_FORMAT);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should not let user login with registered mobile and incorrect password', (done) => {
    chai
      .request(app)
      .post('/v4/login')
      .set(headers)
      .send(invalidPasswordMobile)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_FORBIDDEN);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });
};

const validateSendOTPAPI = async ({ chai, app }) => {
  const { expect } = chai;

  const headers = {
    'x-real-ip': AUTOMATION_CAPTCHA_DISABLED_IPS[0],
  };

  it('It should not send OTP to unregistered user', (done) => {
    chai
      .request(app)
      .post('/v4/login/send-otp')
      .set(headers)
      .send(invalidUserSendOTP)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_INVALID_FORMAT);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  let OTP;
  it('It should send OTP to registered user', (done) => {
    chai
      .request(app)
      .post('/v4/login/send-otp')
      .set(headers)
      .send(validUserSendOTP)
      .end(async (err, res) => {
        const userData = await UserModel.findOne(
          { 'mobile.number': validUserSendOTP.mobile },
          { mobile: 1 },
        ).lean();
        OTP = userData.mobile.otp;
        expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should send the same OTP to registered user if it is not expired', (done) => {
    chai
      .request(app)
      .post('/v4/login/send-otp')
      .set(headers)
      .send(validUserSendOTP)
      .end(async (err, res) => {
        const currTime = new Date();
        currTime.setTime(currTime.getTime() - EXPIRATION_TIME_IN_MS);
        const userData = await UserModel.findOneAndUpdate(
          { 'mobile.number': validUserSendOTP.mobile },
          { lastOTPSentAt: currTime },
          { new: true },
        );
        const newOTP = userData.mobile.otp;
        expect(newOTP).to.equal(OTP);
        expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should send the new OTP to registered user if it is expired', (done) => {
    chai
      .request(app)
      .post('/v4/login/send-otp')
      .set(headers)
      .send(validUserSendOTP)
      .end(async (err, res) => {
        const userData = await UserModel.findOne(
          { 'mobile.number': validUserSendOTP.mobile },
          { mobile: 1 },
        ).lean();
        const newOTP = userData.mobile.otp;
        expect(newOTP).to.not.equal(OTP);
        expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });
};

const validateEnrollmentLoginAPI = async ({ chai, app }) => {
  const { expect } = chai;

  const headers = {
    'x-real-ip': AUTOMATION_CAPTCHA_DISABLED_IPS[0],
  };

  it('It should login user with mypatEnrollmentNo and password', (done) => {
    chai
      .request(app)
      .post('/v4/enrollment-login')
      .set(headers)
      .send(enrollmentLoginPayload)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_SUCCESS);
        expect(res.body).to.to.have.nested.property('data.authToken');
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should not let user login with unregistered mypatEnrollmentNo', (done) => {
    chai
      .request(app)
      .post('/v4/enrollment-login')
      .set(headers)
      .send(invalidEnrollmentNoPayload)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_DATA_NOT_FOUND);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });

  it('It should not let user login with registered mypatEnrollmentNo and incorrect password', (done) => {
    chai
      .request(app)
      .post('/v4/enrollment-login')
      .set(headers)
      .send(invalidPasswordEnrollmentNo)
      .end((err, res) => {
        expect(res.body.code).to.equal(STATUS_CODE_NOT_ACCEPTABLE);
        expect(res).to.satisfyApiSpec;
        done();
      });
  });
};

module.exports = {
  validateLoginAPI,
  validateSendOTPAPI,
  validateEnrollmentLoginAPI,
};
