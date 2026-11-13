module.exports = (con, DataTypes) => {
  const Contact = con.define("contacts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mapsAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telegram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workingHours: {
      type: DataTypes.JSON(),
      allowNull: true,
    },
    subscriptionPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 15000,
    },
    subscriptionDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: con.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });
  return Contact;
};
