const express = require('express');
const connectDB = require('./config/db');
const config = require('config');

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// connect with mongo DB Atlas
connectDB();

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

// For test
app.get('/', (request, response) => {
  response.status(200).send('Api Running');
});

const PORT = process.env.PORT || config.get('port');

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
