const crypto = require("crypto");
const {
  hashPassword,
  verifyPassword,
} = require("../utils/password");
const {
  normalizeArmenianPhone,
  isValidArmenianPhone,
} = require("../utils/phone");
module.exports = (con, DataTypes) => {
  const User = con.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        set(value) {
          const norm = normalizeArmenianPhone(value);
          this.setDataValue("phone", norm || null);
        },
        validate: {
          isArmenianPhone(value) {
            if (!isValidArmenianPhone(value, { allowEmpty: true })) {
              throw new Error(
                "Հեռախոսահամարը պետք է լինի 0xxxxxxxx կամ +374 xx xxxxxx",
              );
            }
          },
        },
      },
      address: DataTypes.STRING,
      age: DataTypes.INTEGER,
      role: {
        type: DataTypes.ENUM("user", "student", "teacher", "admin"),
        defaultValue: "user",
      },
      experience: DataTypes.STRING,
      biography: DataTypes.TEXT,
      specialization: DataTypes.STRING,
      certificates: DataTypes.STRING,
      education: DataTypes.STRING,
      number_of_students: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      login_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      disabledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sessionVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // MFA (AUTH-04): TOTP secret, pending until enabled, never sent to clients.
      mfaSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mfaEnabledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // SHA-256 hashes of single-use recovery codes; plaintext shown only once.
      mfaRecoveryCodeHashes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Last successful MFA confirmation; drives requireStepUp() freshness.
      mfaVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: con.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      include_in_analytics: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      paymentExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sortControl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      defaultScope: {
        where: { deleted: false },
      },
      scopes: {
        withDeleted: {},
      },
      indexes: [
        { fields: ["role"] },
        { fields: ["isPaid"] },
        { fields: ["deleted"] },
        { unique: true, fields: ["email"] },
        { unique: true, fields: ["googleId"] },
      ],
      hooks: {
        beforeCreate: async (user) => {
          const max = await User.max("sortControl");
          user.sortControl = (max || 0) + 1;
        },
      // Rehash with Argon2id whenever the password changes (AUTH-02).
        beforeSave: async (user) => {
          if (user.changed("password")) {
            user.password = await hashPassword(user.password);
            user.passwordChangedAt = new Date(Date.now() - 1000);
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            user.sessionVersion = (user.sessionVersion || 0) + 1;
            user.login_token = null;
          }
          // Increment on role change too (demotion protection)
          if (user.changed("role") && !user.isNewRecord) {
            user.sessionVersion = (user.sessionVersion || 0) + 1;
            user.login_token = null;
          }
        },
        afterCreate: async (user, options) => {
          try {
            if (user.sequelize && user.sequelize.models.files) {
              await user.sequelize.models.files.destroy({
                where: {
                  row_id: user.id,
                  table_name: "users",
                },
                individualHooks: true,
              });
            }
          } catch (err) {
          }
        },
      },
    },
  );
  // Argon2id for new hashes, bcrypt for legacy ones (AUTH-02).
  User.prototype.correctPassword = function (candidatePassword) {
    return verifyPassword(candidatePassword, this.password);
  };
  User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (!this.passwordChangedAt) return false;
    const changedTS = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTS;
  };
  User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  };
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.passwordResetToken;
    delete values.passwordResetExpires;
    delete values.login_token;
    delete values.deleted;
    delete values.googleId;
    delete values.sessionVersion;
    delete values.disabledAt;
    // MFA secrets must never leave the server, like password.
    delete values.mfaSecret;
    delete values.mfaRecoveryCodeHashes;
    return values;
  };
  return User;
};
