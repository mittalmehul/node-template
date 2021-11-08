const Validator = require('validatorjs');
const {
  errorResponse,
  statusCodes: { STATUS_CODE_INVALID_FORMAT },
} = require('../utils/response/response.handler');

const errorMessagesObj = {
  required: ':attribute is required',
  array: ':attribute should be array',
};

const arrayType = 'array';

const payloadTypes = {
  query: 'query',
  body: 'body',
  params: 'params',
};

function payloadValidator(expectedParams = [], payloadType, req, res, next) {
  const validatorRules = {};
  const errorMessageObj = {};
  if (!Object.values(payloadTypes).includes(payloadType)) {
    throw new Error('invalid payloadType');
  }
  const payload = req[payloadType];
  if (!expectedParams.length) next();
  expectedParams.forEach((param) => {
    validatorRules[param.field] = param.rules;
    if (param.rules.includes(arrayType)) {
      if (payload[param.field] && typeof payload[param.field] === 'string') {
        payload[param.field] = payload[param.field].split(',');
      }
      if (payload[param.field] === '') {
        payload[param.field] = [];
      }
    }
    param.rules.forEach((rule) => {
      if (errorMessagesObj[rule]) {
        errorMessageObj[`${rule}.${param.field}`] = errorMessagesObj[rule];
      }
    });
  });
  const validation = new Validator(payload, validatorRules, errorMessageObj);
  if (validation.fails()) {
    const { errors } = validation;
    const errorKeys = Object.keys(errors.errors);
    const errorList = errors.errors[errorKeys[0]];
    return errorResponse({
      req,
      res,
      code: STATUS_CODE_INVALID_FORMAT,
      message: errorList[0],
    });
  }
  req[payloadType] = payload;
  return next();
}

function queryValidator(params = []) {
  return (req, res, next) => {
    payloadValidator(params, payloadTypes.query, req, res, next);
  };
}

function bodyValidator(params = []) {
  return (req, res, next) => {
    payloadValidator(params, payloadTypes.body, req, res, next);
  };
}

function paramsValidator(params = []) {
  return (req, res, next) => {
    payloadValidator(params, payloadTypes.params, req, res, next);
  };
}

module.exports = {
  queryValidator,
  paramsValidator,
  bodyValidator,
};
