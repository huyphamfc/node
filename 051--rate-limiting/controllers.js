const AccountModel = require('./model');

exports.getAllAccounts = async (_, res) => {
  try {
    const accounts = await AccountModel.find();

    if (accounts.length === 0) throw 'Data not found.';

    res.status(200).json({
      status: 'success',
      results: accounts.length,
      data: accounts,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
