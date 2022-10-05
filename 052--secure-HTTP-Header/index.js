const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.route('/').get((_, res) => {
  res.status(200).json({
    status: 'success',
    message: `Hello, I'm a server!`,
  });
});

app.listen(8000, err => {
  if (err) console.log(err);
  console.log('Server running on port 8000...');
});
