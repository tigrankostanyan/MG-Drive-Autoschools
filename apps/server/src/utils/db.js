const Sequelize = require("sequelize");
const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
// 'localhost' may resolve to ::1 first and slow/fail the connect; use IPv4.
const dbHost =
  process.env.DB_HOST === "localhost" ? "127.0.0.1" : process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT);
const dbConfig = {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 100,
    min: Number(process.env.DB_POOL_MIN) || 2,
    acquire: 20000,
    idle: 5000,
  },
  define: {
    timestamp: true,
    createdAt: true,
    updatedAt: true,
    freezeTableName: true,
  },
};
const connect = new Sequelize(dbName, dbUsername, dbPassword, dbConfig);
connect
  .authenticate()
  .then(() => {
    console.log("DB connection ✔️");
  })
  .catch((e) => {
    console.error("Error connecting to the database:", e.message);
  });
const DB = { con: connect, Sequelize };
module.exports = DB;
