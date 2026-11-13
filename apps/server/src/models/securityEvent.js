'use strict';

module.exports = (con, DataTypes) => {
  const SecurityEvent = con.define(
    'security_events',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      event: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      level: {
        type: DataTypes.ENUM('info', 'warn', 'error'),
        allowNull: false,
        defaultValue: 'info',
      },
      // Truncated actor hash, not a raw id, so this is a string not a key.
      userId: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'user_id',
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(512),
        allowNull: true,
        field: 'user_agent',
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      route: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['event'] },
        { fields: ['level'] },
        { fields: ['created_at'] },
      ],
    },
  );
  return SecurityEvent;
};
