/* eslint-disable global-require */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

const app = require('express')();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv = require('dotenv');
const compression = require('compression');
const {
  errorResponse,
  statusCodes: { STATUS_CODE_FAILURE, STATUS_CODE_DATA_NOT_FOUND },
} = require('./utils/response/response.handler');

const { logger } = require('./utils/logs/logger');

const DEFAULT_PORT = 3000;
const mode = process.env.NODE_ENV || 'development';

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

dotenv.config({
  path: `.env.${mode}`,
});

const { initConfig } = require('./config');

initConfig()
  .then((config) => {
    const routes = require('./routes');
    const { validateAuth } = require('./middlewares/auth/auth.middleware');
    const { allowCrossDomain } = require('./middlewares/cors/cors.middleware');
    const { mongoInit } = require('./dbModels/connection');

    // gzip, deflate compression of API response to reduce data transfer over internet
    app.use(compression());

    // enable CORS - Cross Origin Resource Sharing
    app.use(allowCrossDomain);

    app.use('/auth', validateAuth);
    app.use('/', routes);

    app.use((req, res) => errorResponse({
      code: STATUS_CODE_DATA_NOT_FOUND,
      req,
      res,
      message: 'Route not found',
    }));

    app.use((error, req, res) => errorResponse({
      code: STATUS_CODE_FAILURE,
      req,
      res,
      error,
      message: error.message,
    }));

    app.set('port', config.PORT || DEFAULT_PORT);

    const server = app.listen(app.get('port'), () => {
      mongoInit({ db: config.db, logger });
      logger.info(`Express server listening on port ${server.address().port}`);
    });
  })
  .catch((err) => {
    console.log('Failed to fetch config', err);
  });

module.exports = app;
