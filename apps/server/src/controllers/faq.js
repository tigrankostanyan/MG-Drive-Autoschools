const faqService = require("../services/faq.service");
module.exports = {
  async getFaqs(req, res, next) {
    try {
      const { faqs, fromCache } = await faqService.getAll();
      res.status(200).json({
        status: "success",
        fromCache,
        time: `${Date.now() - req.time} ms`,
        faqs,
      });
    } catch (e) {
      next(e);
    }
  },
  async addFaq(req, res, next) {
    try {
      const faq = await faqService.create(req.body);
      res.status(201).json({
        status: "success",
        faq,
        time: `${Date.now() - req.time} ms`,
      });
    } catch (e) {
      next(e);
    }
  },
  async updateFaq(req, res, next) {
    try {
      const faq = await faqService.update(req.params.id, req.body);
      res.status(200).json({
        status: "success",
        faq,
        time: `${Date.now() - req.time} ms`,
      });
    } catch (e) {
      next(e);
    }
  },
  async deleteFaq(req, res, next) {
    try {
      await faqService.remove(req.params.id);
      res.status(200).json({
        status: "success",
      });
    } catch (e) {
      next(e);
    }
  },
  async getFaqCategories(req, res, next) {
    try {
      const categories = await faqService.getCategories();
      res.status(200).json({
        status: "success",
        categories,
      });
    } catch (e) {
      next(e);
    }
  },
  async updateFaqCategories(req, res, next) {
    try {
      const categories = await faqService.updateCategories(req.body.categories);
      res.status(200).json({
        status: "success",
        categories,
      });
    } catch (e) {
      next(e);
    }
  },
};
