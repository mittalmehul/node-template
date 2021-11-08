/* eslint-disable global-require */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

const app = require('express')();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const dotenv = require('dotenv');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec, swaggerValidation } = require('./utils/apiDocs/swagger');
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
    const { getAllowedOrigins } = require('./config');

    // enable CORS - Cross Origin Resource Sharing
    const allowCrossDomain = function allowCrossDomain(req, res, next) {
      const { origin } = req.headers;
      const allowedOrigins = getAllowedOrigins();
      res.setHeader('Access-Control-Allow-Origin', origin);

      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Token',
      );

      // intercept OPTIONS method
      // eslint-disable-next-line eqeqeq
      if (req.method == 'OPTIONS') {
        res.send(200);
      } else {
        next();
      }
    };

    // gzip, deflate compression of API response to reduce data transfer over internet
    app.use(compression());

    app.use(allowCrossDomain);

    app.use(secureSignup);
    if (process.env.NODE_ENV !== 'production') {
      // swagger url and specs setup
      app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
          explorer: true,
        }),
      );
    }

    app.use('/v4/auth', validateAuth);
    app.use('/', routes);
    // eslint-disable-next-line no-unused-vars
    app.use((req, res, next) => errorResponse({
      code: STATUS_CODE_DATA_NOT_FOUND,
      req,
      res,
      message: 'Route not found',
    }));

    // error handler for API validation errors
    app.use((err, req, res, next) => {
      if (err instanceof swaggerValidation.InputValidationError) {
        return errorResponse({
          code: 400,
          req,
          res,
          message: JSON.stringify(err.errors),
        });
      }
      return next(err);
    });

    // eslint-disable-next-line no-unused-vars
    app.use((error, req, res, next) => errorResponse({
      code: STATUS_CODE_FAILURE,
      req,
      res,
      error,
      message: error.message,
    }));

    app.set('port', config.PORT || DEFAULT_PORT);

    const server = app.listen(app.get('port'), () => {
      mongoInit(config);
      logger.info(`Express server listening on port ${server.address().port}`);
    });
  })
  .catch((err) => {
    console.log('Failed to fetch config', err);
  });

module.exports = app;
