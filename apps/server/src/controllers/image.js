const DB = require("../models");
const { File } = DB.models;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
module.exports = {
  deleteImage: catchAsync(async (req, res, next) => {
    const file = await File.findOne({ where: { id: req.params.id } });
    if (!file) return next(new AppError("Image not found.", 404));
    await file.destroy();
    res.status(200).json({
      message: "Gallery and associated files deleted successfully!",
    });
  }),
};
