const express = require('express');


const app = express();
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(`Hello, I'm a middleware!`);
    next();
});

app.get('/', (req, res) => {
    res.status(204).json({
        status: 'success',
        'request-time': req.requestTime,
        data: null
    });
});

app.listen(8000);