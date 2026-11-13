const AppError = require("./appError");
const { isValidArmenianPhone, normalizeArmenianPhone } = require("./phone");
class Validator {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }
  required(field, name) {
    if (!this.data[field] || String(this.data[field]).trim() === "") {
      this.errors.push(`${name || field} is required`);
    }
    return this;
  }
  email(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.data[field] && !emailRegex.test(this.data[field])) {
      this.errors.push("Invalid email format");
    }
    return this;
  }
  phone(field) {
    if (
      this.data[field] &&
      !isValidArmenianPhone(this.data[field], { allowEmpty: false })
    ) {
      this.errors.push(
        "Phone number must match format 0xxxxxxxx or +374 xx xxxxxx",
      );
      return this;
    }
    if (this.data[field]) {
      this.data[field] = normalizeArmenianPhone(this.data[field]);
    }
    return this;
  }
  min(field, length, name) {
    if (this.data[field] && this.data[field].length < length) {
      this.errors.push(
        `${name || field} must be at least ${length} characters`,
      );
    }
    return this;
  }
  validate() {
    if (this.errors.length > 0) {
      throw new AppError(this.errors.join(". "), 400, "VALIDATION_ERROR");
    }
  }
}
module.exports = Validator;
