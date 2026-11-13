const DB = require("../utils/db");
const connect = DB.con;
const Sequelize = DB.Sequelize;
DB.models = {
  User: require("./user")(connect, Sequelize.DataTypes),
  Test: require("./test")(connect, Sequelize.DataTypes),
  Group: require("./Group")(connect, Sequelize.DataTypes),
  Question: require("./question")(connect, Sequelize.DataTypes),
  Registration: require("./Registration")(connect, Sequelize.DataTypes),
  Review: require("./review")(connect, Sequelize.DataTypes),
  File: require("./file")(connect, Sequelize.DataTypes),
  Contact: require("./contact")(connect, Sequelize.DataTypes),
  Gallery: require("./Gallery")(connect, Sequelize.DataTypes),
  Faq: require("./faq")(connect, Sequelize.DataTypes),
  FaqCategory: require("./faqCategory")(connect, Sequelize.DataTypes),
  ContactMessage: require("./contactMessage")(connect, Sequelize.DataTypes),
  TestResult: require("./testResult")(connect, Sequelize.DataTypes),
  GroupProgress: require("./groupProgress")(connect, Sequelize.DataTypes),
  RefreshToken: require("./refreshToken")(connect, Sequelize.DataTypes),
  StudentGroup: require("./StudentGroup")(connect, Sequelize.DataTypes),
  AdminMenuItem: require("./adminMenuItem")(connect, Sequelize.DataTypes),
  HeroSetting: require("./heroSetting")(connect, Sequelize.DataTypes),
  OAuthSession: require("./oauthSession")(connect, Sequelize.DataTypes),
  LoginAttempt: require("./loginAttempt")(connect, Sequelize.DataTypes),
  // Audit trail with no User association: userId is a hash, not a foreign key.
  SecurityEvent: require("./securityEvent")(connect, Sequelize.DataTypes),
  WebhookEvent: require("./webhookEvent")(connect, Sequelize.DataTypes),
};
DB.models.User.hasMany(DB.models.TestResult, {
  foreignKey: "userId",
  as: "testResults",
});
DB.models.TestResult.belongsTo(DB.models.User, {
  foreignKey: "userId",
  as: "user",
});
DB.models.Test.hasMany(DB.models.TestResult, {
  foreignKey: "testId",
  as: "results",
});
DB.models.TestResult.belongsTo(DB.models.Test, {
  foreignKey: "testId",
  as: "test",
});
DB.models.Group.hasMany(DB.models.TestResult, {
  foreignKey: "groupId",
  as: "results",
});
DB.models.TestResult.belongsTo(DB.models.Group, {
  foreignKey: "groupId",
  as: "group",
});
DB.models.StudentGroup.hasMany(DB.models.User, {
  foreignKey: "groupId",
  as: "students",
});
DB.models.User.belongsTo(DB.models.StudentGroup, {
  foreignKey: "groupId",
  as: "studentGroup",
});
DB.models.User.hasMany(DB.models.GroupProgress, {
  foreignKey: "userId",
  as: "groupProgress",
});
DB.models.GroupProgress.belongsTo(DB.models.User, {
  foreignKey: "userId",
  as: "user",
});
DB.models.Group.hasMany(DB.models.GroupProgress, {
  foreignKey: "groupId",
  as: "progress",
});
DB.models.GroupProgress.belongsTo(DB.models.Group, {
  foreignKey: "groupId",
  as: "group",
});
DB.models.User.hasMany(DB.models.File, {
  foreignKey: "row_id",
  sourceKey: "id",
  as: "files",
  constraints: false,
  scope: {
    name_used: "user_img",
  },
});
DB.models.File.belongsTo(DB.models.User, {
  foreignKey: "row_id",
  targetKey: "id",
  as: "user",
  constraints: false,
  scope: {
    name_used: "user_img",
  },
});
DB.models.Test.hasMany(DB.models.Question, {
  foreignKey: "row_id",
  as: "questions",
  constraints: false,
  scope: {
    table_name: "tests",
  },
});
DB.models.Question.belongsTo(DB.models.Test, {
  foreignKey: "row_id",
  as: "test",
  constraints: false,
});
DB.models.Group.hasMany(DB.models.Question, {
  foreignKey: "row_id",
  as: "questions",
  constraints: false,
  scope: {
    table_name: "groups",
  },
});
DB.models.Question.belongsTo(DB.models.Group, {
  foreignKey: "row_id",
  as: "group",
  constraints: false,
});
DB.models.Question.hasMany(DB.models.File, {
  foreignKey: "row_id",
  as: "files",
  constraints: false,
});
DB.models.File.belongsTo(DB.models.Question, {
  foreignKey: "row_id",
  as: "question",
  constraints: false,
});
DB.models.Gallery.hasMany(DB.models.File, {
  foreignKey: "row_id",
  as: "files",
  constraints: false,
  scope: {
    table_name: "gallery",
  },
});
DB.models.File.belongsTo(DB.models.Gallery, {
  foreignKey: "row_id",
  as: "gallery",
  constraints: false,
});
DB.models.User.hasMany(DB.models.Review, {
  foreignKey: "user_id",
  as: "reviews",
});
DB.models.Review.belongsTo(DB.models.User, {
  foreignKey: "user_id",
  as: "user",
});
DB.models.User.hasMany(DB.models.RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
});
DB.models.RefreshToken.belongsTo(DB.models.User, {
  foreignKey: "userId",
  as: "user",
});
DB.models.User.hasMany(DB.models.OAuthSession, {
  foreignKey: "userId",
  as: "oauthSessions",
});
DB.models.OAuthSession.belongsTo(DB.models.User, {
  foreignKey: "userId",
  as: "user",
});
module.exports = DB; 