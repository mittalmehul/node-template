/**
 * User Password API test cases.
 */
/* eslint no-undef: 0 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiResponseValidator = require('chai-openapi-response-validator');
const app = require('../../../app');
const { swaggerSpec } = require('../../../utils/apiDocs/swagger');
const { getS3LinkAPI } = require('./s3.tests.helper');

// provides satisfyApiSpec method to validate api response against swagger specs
chai.use(chaiResponseValidator(swaggerSpec));

chai.use(chaiHttp);

describe('S3 upload link', () => {
  getS3LinkAPI({ chai, app });
});
