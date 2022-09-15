const express = require('express');
const fs = require('fs');
const morgan = require('morgan');


const app = express();
const userRouter = express.Router();
const countryRouter = express.Router();


app.use(morgan('dev'));
app.use('/users', userRouter);
app.use('/countries', countryRouter);


const users = JSON.parse(fs.readFileSync(
    `${__dirname}/dev-data/users.json`
));

const countries = JSON.parse(fs.readFileSync(
    `${__dirname}/dev-data/countries.json`
));

const getAllUsers = (_, res) => {
    res.status(200).json(users);
}

const getUser = (req, res) => {
    const id = req.params.id * 1;

    if (id < 0 || id >= users.length) {
        res.status(404).end('Invalid ID!');
        return;
    }

    const result = users.find(item => item.id === id);
    res.status(200).json({
        status: 'success',
        data: result
    });
}

const getAllCountries = (_, res) => {
    res.status(200).json(countries);
}

const getCountry = (req, res) => {
    const id = req.params.id * 1;

    if (id < 0 || id >= countries.length) {
        res.status(404).end('Invalid ID');
        return;
    }

    const result = countries.find(item => item.id === id);
    res.status(200).json({
        status: 'success',
        data: result
    });
}


userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUser);

countryRouter.route('/').get(getAllCountries);
countryRouter.route('/:id').get(getCountry);


app.listen(8000, err => {
    if (err) throw err;
    console.log('Listening on port 8000...');
});