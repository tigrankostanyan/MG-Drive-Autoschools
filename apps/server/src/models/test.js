module.exports = (con, DataTypes) => {
  const Test = con.define(
    "tests",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      slug: DataTypes.STRING,
    },
    {
      timestamps: true,
      indexes: [{ fields: ["number"] }, { fields: ["slug"] }],
    },
  );
  const syncTitleAndNumber = (test) => {
    // Derive the exam number from the first digit run in the title.
    const match = test.title.match(/\d+/);
    if (match) {
      test.number = parseInt(match[0], 10);
      test.title = test.title.replace(match[0], "").trim();
    }
    test.slug = test.title.toLowerCase().replace(/\s+/g, "-");
  };
  Test.beforeCreate(syncTitleAndNumber);
  // Only on a real title change, or unrelated edits destroyed the exam number.
  Test.beforeUpdate((test) => {
    if (test.changed("title")) syncTitleAndNumber(test);
  });
  return Test;
};
