const express = require('express');

const router = express.Router();

// @route           GET api/profile
// @description     Test route
// @access          Public

router.get('/', (request, response) => {
  response.status(200).send('Profile route');
});

module.exports = router;
