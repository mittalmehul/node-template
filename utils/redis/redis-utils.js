const { promisify } = require('util');
const redisClient = require('./redis-connection');

const zadd = promisify(redisClient.zadd).bind(redisClient);
const zcount = promisify(redisClient.zcount).bind(redisClient);
const zrank = promisify(redisClient.zrank).bind(redisClient);
const redismulti = promisify(redisClient.multi).bind(redisClient);
const redisexec = promisify(redisClient.exec).bind(redisClient);
const zrevrank = promisify(redisClient.zrevrank).bind(redisClient);
const hgetall = promisify(redisClient.hgetall).bind(redisClient);
const hincrby = promisify(redisClient.hincrby).bind(redisClient);
const setKey = promisify(redisClient.SET).bind(redisClient);
const getKey = promisify(redisClient.get).bind(redisClient);
const EVAL = promisify(redisClient.EVAL).bind(redisClient);
const DEL = promisify(redisClient.DEL).bind(redisClient);
const LRANGE = promisify(redisClient.lrange).bind(redisClient);
const TTL = promisify(redisClient.TTL).bind(redisClient);
const INCRBYFLOAT = promisify(redisClient.incrbyfloat).bind(redisClient);
const setRedisKeyExpiry = promisify(redisClient.expire).bind(redisClient);
const { ONE_YEAR_IN_SECONDS } = require('../../mypat-commons/constants');

/**
 * Retrieves value from Redis using key. Saves method returned data to Redis if none exists.
 * @param {Function} method
 * @param {Object} params
 * @param {String} key
 * @param {Number} expiryTimeInSeconds
 * @param {Boolean} isAPICall
 */
async function cacheToRedis(
  method,
  params,
  key,
  expiryTimeInSeconds = ONE_YEAR_IN_SECONDS,
  isAPICall = false,
) {
  let data = await getKey(key);
  if (data) return JSON.parse(data);
  data = await method(params);
  if (isAPICall) {
    if (data.code && data.code !== 200) return data;
    if (data.statusCode && data.statusCode !== 200) return data;
    if (data.status && data.status.code && data.status.code !== 200) return data;
  }
  await setKey(key, JSON.stringify(data));
  await setRedisKeyExpiry(key, expiryTimeInSeconds);
  return data;
}

module.exports = {
  zadd,
  zcount,
  zrank,
  redismulti,
  redisexec,
  zrevrank,
  hgetall,
  hincrby,
  setKey,
  getKey,
  EVAL,
  cacheToRedis,
  DEL,
  LRANGE,
  TTL,
  setRedisKeyExpiry,
  INCRBYFLOAT,
};
