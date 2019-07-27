const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

module.exports = singIn = async (request, response) => {
  const errors = validationResult(request);
  // if they are errors
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  // come from the body
  const { email, password } = request.body;
  try {
    // we make a request to the database to check if the user exsist
    let user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({ error: [{ message: 'Invalid Credentials' }] });
    }

    // match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.status(400).json({ error: [{ message: 'Invalid Credentials' }] });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      if (err) throw error;
      response.status(200).send({ token });
    });
  } catch (error) {
    // console.log(error.message)
    response.status(404).send('Server error');
  }
};
