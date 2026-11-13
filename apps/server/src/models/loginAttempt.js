'use strict';

module.exports = (con, DataTypes) => {
  const LoginAttempt = con.define(
    'login_attempts',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'ip_address',
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attemptedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'attempted_at',
      },
    },
    {
      timestamps: false,
      indexes: [
        { fields: ['identifier'] },
        { fields: ['ip_address'] },
        { fields: ['attempted_at'] },
        { fields: ['identifier', 'ip_address', 'attempted_at'] },
      ],
    },
  );
  return LoginAttempt;
};
