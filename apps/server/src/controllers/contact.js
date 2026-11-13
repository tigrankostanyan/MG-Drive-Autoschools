const DB = require("../models");
const redis = require("../utils/redisClient");
const { jobQueue } = require("../utils/queue");
const AppError = require("../utils/appError");
const { Contact } = DB.models;
exports.getContacts = async (req, res, next) => {
  try {
    const cacheKey = "contacts:data";
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "success",
        fromCache: true,
        time: `${Date.now() - req.time} ms`,
        contact: JSON.parse(cached),
      });
    }
    const contact = await Contact.findOne();
    if (!contact) {
      return next(new AppError("Կոնտակտային տվյալները չեն գտնվել։", 404));
    }
    const plain = contact.get({ plain: true });
    await redis.set(cacheKey, JSON.stringify(plain), { EX: 60 });
    res.status(200).json({
      status: "success",
      fromCache: false,
      time: `${Date.now() - req.time} ms`,
      contact: plain,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateContacts = async (req, res, next) => {
  try {
    let contact = await Contact.findOne();
    let message = "";
    let status = 200;
    if (!contact) {
      try {
        contact = await Contact.create(req.body);
      } catch (createErr) {
        return next(new AppError("Կոնտակտային տվյալները ստեղծելու սխալ", 400));
      }
      message = "Կոնտակտային տվյալները հաջողությամբ ստեղծվեցին։";
      status = 201;
    } else {
      try {
        await contact.update(req.body);
      } catch (updateErr) {
        return next(
          new AppError("Կոնտակտային տվյալները թարմացնելու սխալ", 400),
        );
      }
      message = "Կոնտակտային տվյալները հաջողությամբ թարմացվեցին։";
    }
    await redis.del("contacts:data");
    res.status(status).json({
      status: "success",
      time: `${Date.now() - req.time} ms`,
      message,
      contact,
    });
  } catch (err) {
    next(err);
  }
};
exports.createMessage = async (req, res) => {
  try {
    const { name, lastname, email, phone, subject, message } = req.body || {};
    if (!name || !lastname || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "Պարտադիր դաշտեր բացակայում են" });
    }
    const item = await DB.models.ContactMessage.create({
      name,
      lastname,
      email,
      phone,
      subject,
      message,
    });
    res
      .status(201)
      .json({ status: "success", item, time: `${Date.now() - req.time} ms` });
  } catch (e) {
    if (e?.name && e.name.startsWith("Sequelize") && Array.isArray(e.errors)) {
      const errors = e.errors.map((err) => ({
        path: err.path,
        message: err.message,
        value: err.value,
      }));
      const message = errors.map((x) => x.message).join("; ");
      return res.status(400).json({ status: "fail", message, errors });
    }
    console.error(e);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.getMessages = async (req, res) => {
  try {
    let limit = Number(req.query.limit || 50);
    if (!Number.isFinite(limit) || limit < 1) limit = 50;
    if (limit > 200) limit = 200;
    const items = await DB.models.ContactMessage.findAll({
      order: [["id", "DESC"]],
      limit,
    });
    res
      .status(200)
      .json({ status: "success", items, time: `${Date.now() - req.time} ms` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const item = await DB.models.ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Message not found!" });
    await item.destroy();
    res.status(204).json({ status: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error!" });
  }
};
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Խնդրում ենք մուտքագրել էլ․ հասցե" });
    }
    const user = { email, name: "Բաժանորդ" };
    const url = "https://mgdrive.am";
    await jobQueue.add(
      "sendEmail",
      {
        user,
        url,
        data: {},
        template: "subscribe",
        subject: "Բարի գալուստ MG Drive ընտանիք",
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
      },
    );
    res.status(200).json({
      status: "success",
      message:
        "Շնորհակալություն բաժանորդագրության համար։ Ստուգեք ձեր էլ․ փոստը։",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
