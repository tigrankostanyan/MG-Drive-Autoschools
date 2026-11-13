module.exports = (con, DataTypes) => {
  const FaqCategory = con.define(
    "faq_categories",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      timestamps: true,
      indexes: [{ unique: true, fields: ["name"] }],
    },
  );
  return FaqCategory;
};
