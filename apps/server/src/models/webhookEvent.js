// Stripe webhook ledger: one UNIQUE row per event id gates idempotent fulfillment.
module.exports = (con, DataTypes) => {
  const WebhookEvent = con.define("webhook_events", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    // Matches db/schema.sql: snake_case created_at, no updated_at.
    underscored: true,
    updatedAt: false,
  });
  return WebhookEvent;
};
