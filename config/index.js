/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SIGNATURE_VERSION,
  AWS_REGION,
  AWS_BUCKET_NAME,
  USE_CUSTOM_CONFIG = 'false',
  NODE_ENV = 'development',
} = process.env;
const PROJECT_NAME = 'auth-service';
const CONFIG_FILE_PATH = `${__dirname}/${NODE_ENV}.config.json`;

const fs = require('fs');
const AWS = require('aws-sdk');

async function fetchConfigFromS3() {
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_SIGNATURE_VERSION || !AWS_REGION) {
    throw new Error('Invalid AWS Credentials');
  }
  const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    signatureVersion: AWS_SIGNATURE_VERSION,
    region: AWS_REGION,
  });
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${PROJECT_NAME}/${NODE_ENV}.config.json`,
  };
  try {
    const data = await s3.getObject(params).promise();
    fs.writeFileSync(CONFIG_FILE_PATH, data.Body.toString());
  } catch (err) {
    console.log('Failed to fetch from s3');
    throw err;
  }
}

async function initConfig() {
  if (USE_CUSTOM_CONFIG === 'false') {
    await fetchConfigFromS3();
  }
  const fileData = fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(fileData);
  return config;
}

function getConfig() {
  const fileData = fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(fileData);
  return config;
}
/**
 * Paths which are not scrutinized as far as CORS is concerned.
 */
const allowedOrigins = ['*'];

/**
 * Returns a list of hosts which are cross origin whitelisted.
 */
function getAllowedOrigins() {
  return allowedOrigins;
}

module.exports = {
  getConfig,
  initConfig,
  getAllowedOrigins,
};
