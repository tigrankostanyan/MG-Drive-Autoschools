const AppError = require("../utils/appError");
const service = require("../services/adminMenuItem.service");

exports.getMenuItems = async (req, res) => {
  try {
    const items = await service.list();
    res.status(200).json({ data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.reorderMenuItems = async (req, res) => {
  try {
    await service.reorder(req.body.ids);
    res.status(200).json({ status: "success" });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode || 400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};