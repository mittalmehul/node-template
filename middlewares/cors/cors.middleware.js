const { getAllowedOrigins } = require('../../config');

const allowCrossDomain = (req, res, next) => {
  const { origin } = req.headers;
  const allowedOrigins = getAllowedOrigins();
  if (process.env.NODE_ENV !== 'production' && origin && allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Token',
  );

  if (req.method === 'OPTIONS') {
    return res.send(200);
  }

  return next();
};

module.exports = {
  allowCrossDomain,
};
