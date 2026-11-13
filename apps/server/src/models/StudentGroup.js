module.exports = (con, DataTypes) => {
  const StudentGroup = con.define(
    "student_groups",
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
      grantStudentAccess: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Խմբի ուսանողները ստանում են անվճար մուտք դեպի թեստեր և խմբեր",
      },
      sortControl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Հերթականությունը քաշել-թողնելու (drag) վերադասավորման համար",
      },
      activeFrom: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Խումբը ավտոմատ ակտիվանում է այս պահից",
      },
      activeUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Խումբը ավտոմատ անջատվում է այս պահին",
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: con.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      indexes: [{ fields: ["title"] }],
    },
  );
  return StudentGroup;
};
