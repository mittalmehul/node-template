/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const redis = require('redis');
const config = require('../../config').getConfig();

const redisClient = redis.createClient(
  config.redisConnection.port,
  config.redisConnection.hostname,
);

redisClient.on('connect', () => {
  module.exports.client = redisClient;
  console.log(
    `Connected with redis server: host: ${config.redisConnection.hostname} port: ${config.redisConnection.port}`,
  );
});

redisClient.on('error', (err) => {
  console.log(err);
  console.log('Error while creating connection');
});

module.exports = redisClient;
