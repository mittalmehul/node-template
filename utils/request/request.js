const rp = require('request-promise');

const { cacheToRedis } = require('../redis/redis-utils');

const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

async function sendRequest(params) {
  const {
    method, headers, uri, body, query, json = true, form,
  } = params;
  const options = {
    method,
    uri,
    headers,
    body,
    qs: query,
    json,
    form,
  };
  return rp(options);
}

/**
 * Hits an API asynchronously, use cache=true with additional params to cache the response.
 * @param {String} method
 * @param {String} uri
 * @param {Object} body
 * @param {Object} query
 * @param {Object} headers
 * @param {Boolean} cache
 * @param {Boolean} json
 * @param {String} prefix
 * @param {Number} expiryTimeInSeconds
 */
async function requestAsync(params) {
  const {
    method, cache = false, expiryTimeInSeconds, prefix = '',
  } = params;

  if (!ALLOWED_METHODS.includes(method.toUpperCase())) {
    throw new Error({ message: `Invalid http method, allowed methods are ${ALLOWED_METHODS}` });
  }

  if (cache) {
    const key = `${prefix}_${JSON.stringify(params)}`;
    return cacheToRedis(sendRequest, params, key, expiryTimeInSeconds, true);
  }
  const response = await sendRequest(params);
  return response;
}

/**
 * Hits an API asynchronously, use cache=true with additional params to cache the response.
 * @param {String} uri
 * @param {Object} body
 * @param {Object} query
 * @param {Object} headers
 * @param {Boolean} cache
 * @param {Boolean} json
 * @param {String} prefix
 * @param {Number} expiryTimeInSeconds
 */
async function getAsync(params) {
  return requestAsync({ method: 'GET', ...params });
}

/**
 * Hits an API asynchronously, use cache=true with additional params to cache the response.
 * @param {String} uri
 * @param {Object} body
 * @param {Object} query
 * @param {Object} headers
 * @param {Boolean} cache
 * @param {Boolean} json
 * @param {String} prefix
 * @param {Number} expiryTimeInSeconds
 */
async function postAsync(params) {
  return requestAsync({ method: 'POST', ...params });
}

/**
 * Hits an API asynchronously, use cache=true with additional params to cache the response.
 * @param {String} uri
 * @param {Object} body
 * @param {Object} query
 * @param {Object} headers
 * @param {Boolean} cache
 * @param {Boolean} json
 * @param {String} prefix
 * @param {Number} expiryTimeInSeconds
 */
async function putAsync(params) {
  return requestAsync({ method: 'PUT', ...params });
}

/**
 * Hits an API asynchronously, use cache=true with additional params to cache the response.
 * @param {String} uri
 * @param {Object} body
 * @param {Object} query
 * @param {Object} headers
 * @param {Boolean} cache
 * @param {Boolean} json
 * @param {String} prefix
 * @param {Number} expiryTimeInSeconds
 */
async function patchAsync(params) {
  return requestAsync({ method: 'PATCH', ...params });
}

module.exports = {
  requestAsync,
  postAsync,
  getAsync,
  putAsync,
  patchAsync,
};
