const crypto = require("crypto");
const { IDLE_TIMEOUT_MS } = require("../constants/session");
module.exports = (con, DataTypes) => {
  const RefreshToken = con.define(
    "refresh_tokens",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // SHA-256 of the refresh token; the raw token is never stored.
      tokenHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      jwtId: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      // Family id shared by a rotation chain; enables reuse detection.
      familyId: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lastActivityAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      revocationReason: {
        type: DataTypes.ENUM(
          "user_logout",
          "logout_all",
          "admin_revoked",
          "token_reuse",
          "password_changed",
          "user_disabled",
          "user_deleted",
          "suspicious_activity",
          "session_expired",
        ),
        allowNull: true,
      },
      revokedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Admin user ID who revoked this token",
      },
      ipHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ["userId"] },
        { fields: ["tokenHash"] },
        { fields: ["familyId"] },
        { fields: ["expiresAt"] },
        { fields: ["revokedAt"] },
        { fields: ["userId", "revokedAt"] },
      ],
      hooks: {
        beforeCreate: (token) => {
          if (!token.id) {
            token.id = undefined; // Let DB auto-increment
          }
        },
      },
    },
  );
  RefreshToken.generate = function () {
    const rawToken = crypto.randomBytes(48).toString("base64url");
    const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hash };
  };
  RefreshToken.prototype.isRevoked = function () {
    return this.revokedAt !== null;
  };
  RefreshToken.prototype.isExpired = function () {
    return new Date() > new Date(this.expiresAt);
  };
  RefreshToken.prototype.isIdleExpired = function () {
    return Date.now() - new Date(this.lastActivityAt).getTime() > IDLE_TIMEOUT_MS;
  };
  RefreshToken.prototype.isValid = function () {
    return !this.isRevoked() && !this.isExpired() && !this.isIdleExpired();
  };
  RefreshToken.revokeFamily = async function (familyId, reason, revokedBy) {
    return RefreshToken.update(
      {
        revokedAt: new Date(),
        revocationReason: reason,
        revokedBy: revokedBy || null,
      },
      { where: { familyId, revokedAt: null } },
    );
  };
  RefreshToken.revokeAllForUser = async function (userId, reason, revokedBy) {
    return RefreshToken.update(
      {
        revokedAt: new Date(),
        revocationReason: reason,
        revokedBy: revokedBy || null,
      },
      { where: { userId, revokedAt: null } },
    );
  };
  return RefreshToken;
};
