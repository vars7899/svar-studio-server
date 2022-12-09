const mongoose = require("mongoose");

(async function _connectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    await mongoose.set("strictQuery", true);

    console.log(
      `\nSuccess: Connection established to ${connection.host}`.green,
      `\nDatabase: ${connection.name}`.yellow
    );
  } catch (err) {
    console.log(err);
  }
})();
