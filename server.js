const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

// connect with mongo DB Atlas
connectDB();

// Define routes
app.use('/api/users', require('./routs/api/users'));
app.use('/api/profile', require('./routs/api/profile'));
app.use('/api/posts', require('./routs/api/posts'));
app.use('/api/auth', require('./routs/api/auth'));

// For test
app.get('/', (request, response) => {
  response.status(200).send('Api Running');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
