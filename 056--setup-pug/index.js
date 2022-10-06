const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', (_, res) => {
  res.status(200).render('template');
});

app.listen(8000, err => {
  if (err) console.log(err);
  console.log('Server running on port 8000...');
});
