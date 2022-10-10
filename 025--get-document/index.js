const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
const port = process.env.PORT || 8000;

mongoose
  .connect(DB)
  .then(() => console.log('Connect DB successfully.'))
  .catch(err => console.log(err));

const tourSchema = mongoose.Schema({});

const Tour = mongoose.model('Tour', tourSchema);

const app = express();

app.get('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.find({ _id: req.params.id });

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
