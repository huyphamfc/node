const AccountModel = require('./model');

// prettier-ignore
const createToken = id => jwt.sign(
    { id }, 
    process.env.JWT_PRIVATE_KEY, 
    { expiresIn: process.env.JWT_EXPIRATION}
);

exports.getAllAccounts = async (req, res) => {
  try {
    const query = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete query[field]);

    const accounts = await AccountModel.find(query);

    if (accounts.length === 0) throw new Error('Data not found.');

    res.status(200).json({
      status: 'success',
      results: accounts.length,
      data: accounts,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
