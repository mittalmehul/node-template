/**
 * Login API test cases.
 */
/* eslint no-undef: 0 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiResponseValidator = require('chai-openapi-response-validator');
const app = require('../../../app');
const { swaggerSpec } = require('../../../utils/apiDocs/swagger');
const {
  validateLoginAPI,
  validateSendOTPAPI,
  validateEnrollmentLoginAPI,
} = require('./login.tests.helper');

// provides satisfyApiSpec method to validate api response against swagger specs
chai.use(chaiResponseValidator(swaggerSpec));

chai.use(chaiHttp);

describe('Login', () => {
  validateLoginAPI({ chai, app });
  validateSendOTPAPI({ chai, app });
  validateEnrollmentLoginAPI({ chai, app });
});
