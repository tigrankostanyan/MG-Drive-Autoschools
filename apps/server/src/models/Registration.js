module.exports = (con, DataTypes) => {
  const Registration = con.define("registrations", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    packageType: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: { isIn: [["տեսական", "գործնական", "ֆուլ փաթեթ"]] },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: con.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });
  const DEFAULT_PACKAGE = "տեսական";
  Registration.addHook("beforeValidate", (row) => {
    if (row.packageType == null || row.packageType === "") {
      row.packageType = DEFAULT_PACKAGE;
    }
  });
  return Registration;
};
