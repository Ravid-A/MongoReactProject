const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  try {
    console.log("Connecting to database...");
    const port = process.env.PORT || "3000";
    await mongoose.connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  } catch (err) {
    console.log(`FAILED TO START: ${err}`);
  }
};

run();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
