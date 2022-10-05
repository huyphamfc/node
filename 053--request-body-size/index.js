const express = require('express');

const app = express();

app.use(express.json({ limit: '0.1kb' }));

app.route('/uploads').post(async (req, res) => {
  try {
    res.status(201).json({
      status: 'success',
      data: req.body,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
});

app.listen(8000, err => {
  if (err) console.log(err);
  console.log('Server running on port 8000...');
});
