var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/list', (req, res, next) => {
  res.json({
      erron: 0,
      data: [1, 2, 3]
  })
});

module.exports = router;
