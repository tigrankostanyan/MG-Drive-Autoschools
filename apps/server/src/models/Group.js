module.exports = (con, DataTypes) => {
  const Groups = con.define(
    "groups",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortControl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      slug: DataTypes.STRING,
      date: {
        type: DataTypes.DATE,
        defaultValue: con.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [{ fields: ["number"] }, { fields: ["slug"] }],
    },
  );
  function syncSlug(group) {
    if (group.title) {
      group.slug = group.title.toLowerCase().replace(/\s+/g, "-");
    }
  }
  Groups.beforeCreate(syncSlug);
  Groups.beforeUpdate((group) => {
    if (group.changed("title")) syncSlug(group);
  });
  return Groups;
};
