exports.renderUI = view => (_, res, next) => {
  try {
    res.status(200).render(view);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  next();
};
