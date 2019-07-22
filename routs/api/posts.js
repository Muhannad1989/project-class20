const express = require('express');

const router = express.Router();

// @route           GET api/posts
// @description     Test route
// @access          Public

router.get('/', (request, response) => {
  response.status(200).send('Posts route');
});

module.exports = router;
