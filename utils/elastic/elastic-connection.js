/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const elasticsearch = require('elasticsearch');
const config = require('../../config').getConfig();

const { elasticConnection } = config;

const endPoint = `http://${elasticConnection.hostname}:${elasticConnection.port}`;

const client = new elasticsearch.Client({
  host: endPoint,
});

client.ping(
  {
    requestTimeout: 30000,
  },
  (error) => {
    if (error) {
      console.error('elasticsearch cluster is down!');
    } else {
      console.log('elasticsearch is running');
    }
  },
);

module.exports = client;
