const DB = require("../models");
const { Registration } = DB.models;
const { jobQueue } = require("../utils/queue");
const { appendRegistrationToSheet } = require("../utils/googleSheets");
const { publicUrl } = require("../utils/publicUrl");
module.exports = {
  createRegistration: async (req, res) => {
    try {
      const registerCourse = await Registration.create(req.body);
      
      appendRegistrationToSheet(registerCourse).catch(console.error);

      const URL = publicUrl("/admin");
      await jobQueue.add(
        "sendEmail",
        {
          user: {},
          url: URL,
          data: registerCourse,
          template: "registerCourse",
          subject: "New Course Registration",
        },
        {
          attempts: 3,
          removeOnComplete: true,
        },
      );
      res.status(201).json({
        status: "success",
        registerCourse,
        time: `${Date.now() - req.time} ms`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Internal server error!",
      });
    }
  },
  getRegistration: async (req, res) => {
    try {
      let limit = Number(req.query.limit || 50);
      if (!Number.isFinite(limit) || limit < 1) limit = 50;
      if (limit > 200) limit = 200;
      const registrations = await Registration.findAll({
        order: [["id", "DESC"]],
        limit,
      });
      if (!registrations) {
        return res.status(404).json({ message: "Registration not found!" });
      }
      res.status(200).json({
        status: "success",
        time: `${Date.now() - req.time} ms`,
        registrations,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Internal server error!",
      });
    }
  },
  updateRegistration: async (req, res) => {
    try {
      const registration = await Registration.findByPk(req.params.id);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found!" });
      }
      for (let key in req.body) {
        registration[key] = req.body[key];
      }
      await registration.save();
      res.status(200).json({
        status: "success",
        time: `${Date.now() - req.time} ms`,
        registration,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Internal server error!",
      });
    }
  },
  deleteRegistration: async (req, res) => {
    try {
      const registration = await Registration.findByPk(req.params.id);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found!" });
      }
      await registration.destroy();
      res.status(200).json({
        message: "Registration deleted successfully!",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Internal server error!",
      });
    }
  },
};
