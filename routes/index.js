const experess = require('express');

const router = experess.Router();

router.get('/health', (req, res) => {
  res.send({
    message: 'Server Running',
    code: 200,
  });
});

module.exports = router;
