const AppError = require("../utils/appError");
const studentGroupService = require("../services/studentGroup.service");
exports.getStudentGroups = async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 50) limit = 50;
    const result = await studentGroupService.listPaged(page, limit);
    const groups = result && result.groups ? result.groups : [];
    const total = result && typeof result.total === "number" ? result.total : 0;
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      data: groups,
      meta: { page, limit, totalPages, totalCount: total },
    });
  } catch (err) {
    console.error("[getStudentGroups] Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getStudentGroup = async (req, res) => {
  try {
    const group = await studentGroupService.getById(req.params.id);
    res.status(200).json({ status: "success", group });
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.createStudentGroup = async (req, res) => {
  try {
    const group = await studentGroupService.create(req.body);
    res.status(201).json({ status: "success", group });
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateStudentGroup = async (req, res) => {
  try {
    const group = await studentGroupService.update(req.params.id, req.body);
    res.status(200).json({ status: "success", group });
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteStudentGroup = async (req, res) => {
  try {
    await studentGroupService.remove(req.params.id);
    res
      .status(200)
      .json({ status: "success", message: "Student group deleted" });
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 404) {
      return res.status(404).json({ message: "Student group not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getGroupStudents = async (req, res) => {
  try {
    const { students, allStudents } = await studentGroupService.getStudents(
      req.params.id,
    );
    res.status(200).json({ status: "success", students, allStudents });
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.setGroupStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;
    await studentGroupService.setStudents(req.params.id, studentIds);
    res.status(200).json({ status: "success" });
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.reorderStudentGroups = async (req, res) => {
  try {
    await studentGroupService.reorder(req.body.groupIds);
    res.status(200).json({ status: "success" });
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
