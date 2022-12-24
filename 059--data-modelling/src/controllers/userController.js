const AppError = require('../utils/AppError');
const catchAsyncError = require('../utils/catchAsyncError');
const UserModel = require('../models/UserModel');

exports.getAllUsers = catchAsyncError(async (req, res) => {
  const users = await UserModel.find({});

  const results = users.length;
  if (results === 0) throw new AppError(404, 'Data not found.');

  res.status(200).json({
    status: 'success',
    results,
    users,
  });
});
