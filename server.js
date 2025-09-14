const dotenv = require("dotenv");
const connectDB = require("./src/db/connectdb.js");
const app = require("./app.js");
// const removeUnverifiedAccounts = require("./service/removeunverifiedaccounts.js");
// const { notifyUsers } = require("./service/notifyUsers.js");

dotenv.config();
// notifyUsers();
// removeUnverifiedAccounts();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error", error);
      throw error;
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("server is running on port", process.env.PORT);
    });
  })
  .catch((error) => console.log("mongodb connection failed", error));
