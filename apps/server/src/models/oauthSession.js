'use strict';

module.exports = (con, DataTypes) => {
  const OAuthSession = con.define(
    'oauth_sessions',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      sessionTokenHash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: true,
        field: 'session_token_hash',
      },

      sessionSig: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        field: 'session_sig',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.STRING(512),
        allowNull: true,
        field: 'user_agent',
      },
      // Previous token hash, accepted briefly after rotation (parallel requests).
      previousTokenHash: {
        type: DataTypes.CHAR(64),
        allowNull: true,
        field: 'previous_token_hash',
      },
      previousValidUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'previous_valid_until',
      },
      rotatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'rotated_at',
      },
      fingerprintHash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        field: 'fingerprint_hash',
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_valid',
      },
      invalidatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'invalidated_at',
      },
      invalidationReason: {
        type: DataTypes.ENUM(
          'new_login',
          'manual_logout',
          'expired',
          'suspicious',
          'admin_action',
        ),
        allowNull: true,
        field: 'invalidation_reason',
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'last_used_at',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
    },
    {
      // This table has no updated_at, so Sequelize must not manage one
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['is_valid'] },
        { fields: ['expires_at'] },
        { unique: true, fields: ['session_token_hash'] },
        { fields: ['user_id', 'is_valid'] },
        { fields: ['previous_token_hash'] },
      ],
    },
  );

  OAuthSession.prototype.isExpired = function () {
    return new Date() > new Date(this.expiresAt);
  };

  OAuthSession.prototype.isUsable = function () {
    return this.isValid && !this.isExpired();
  };

  OAuthSession.invalidateAllForUser = async function (userId, reason = 'new_login') {
    return OAuthSession.update(
      {
        isValid: false,
        invalidatedAt: new Date(),
        invalidationReason: reason,
      },
      { where: { userId, isValid: true } },
    );
  };

  OAuthSession.getRecentlyInvalidatedHashes = async function (userId) {
    const { Op } = require('sequelize');
    const cutoff = new Date(Date.now() - 60_000);
    return OAuthSession.findAll({
      attributes: ['sessionTokenHash'],
      where: {
        userId,
        invalidatedAt: { [Op.gte]: cutoff },
      },
    });
  };

  return OAuthSession;
};
