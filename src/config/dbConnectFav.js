/*const mongoose = require("mongoose");
require("dotenv").config();

const connectFavoriteDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_FAVORITE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Favorite DB connected");
  } catch (err) {
    console.error("Error connecting to Favorite DB:", err);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

module.exports = connectFavoriteDB;*/
const mongoose = require("mongoose");
require("dotenv").config();

async function connectFavoriteDB() {
  const favoriteConnection = mongoose.createConnection(
    process.env.DB_CONNECT_FAVORITE
  );

  favoriteConnection.on("connected", () => {
    console.log("Connected to Favorite DB");
  });

  favoriteConnection.on("error", (err) => {
    console.error("Error connecting to Favorite DB:", err);
  });

  return favoriteConnection;
}

module.exports = connectFavoriteDB;
