function catchAsyncError(tryBlockFunc) {
  return async function middlewareFunc(req, res, next) {
    try {
      await tryBlockFunc(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = catchAsyncError;
