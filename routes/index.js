const experess = require('express');

const router = experess.Router();

router.get('/health', (req, res) => {
  res.send({
    message: 'Server Running',
    code: 200,
  });
});

require('../modules/login/routes/login.routes')(router);

require('../modules/s3/routes/s3.routes')(router);

module.exports = router;
