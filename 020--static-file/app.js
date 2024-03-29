const express = require('express');
const morgan = require('morgan');


const app = express();


app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.listen(8000);