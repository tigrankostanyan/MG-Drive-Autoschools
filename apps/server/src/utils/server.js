const security = require("../security");
const { startRetention } = require("./retention");
module.exports = function server(app) {
  const DB = require("../models");
  const syncOptions = process.env.DB_SYNC_ALTER === "true" ? { alter: true } : {};
  DB.con
    .sync(syncOptions)
    .then(async (res) => {
      startRetention();
      const port = process.env.PORT || 3300;
      const server = app.listen(port, () =>
        console.log(`App running on port ${port}...`),
      );
      security.configureServerTimeout(server);
      process.on("unhandledRejection", (e) => {
        console.log("UNHANDLED REJECTION! Shutting down...");
        console.log(e.name, e.message);
        server.close(() => process.exit(1));
      });
    })
    .catch((e) => console.log(e));
  return DB;
};
