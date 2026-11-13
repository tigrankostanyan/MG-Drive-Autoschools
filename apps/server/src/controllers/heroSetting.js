const DB = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getHeroSettings = catchAsync(async (req, res, next) => {
  let settings = await DB.models.HeroSetting.findOne({ where: { id: 1 } });
  if (!settings) {
    settings = await DB.models.HeroSetting.create({ id: 1 });
  }
  res.status(200).json({
    status: "success",
    data: settings,
  });
});

exports.updateHeroSettings = catchAsync(async (req, res, next) => {
  let settings = await DB.models.HeroSetting.findOne({ where: { id: 1 } });
  if (!settings) {
    settings = await DB.models.HeroSetting.create({ id: 1, ...req.body });
  } else {
    settings = await settings.update(req.body);
  }

  res.status(200).json({
    status: "success",
    data: settings,
  });
});
