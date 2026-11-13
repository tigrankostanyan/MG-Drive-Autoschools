module.exports = (con, DataTypes) => {
  return con.define(
    "admin_menu_items",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tabKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      sortControl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      indexes: [{ fields: ["tabKey"] }],
    },
  );
};
