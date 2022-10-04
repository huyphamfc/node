const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 8000;
const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE)
  .then(() => console.log('Connect MongoDB successfully.'))
  .catch(err => console.log(err));

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`Server running on port ${PORT}...`);
});
