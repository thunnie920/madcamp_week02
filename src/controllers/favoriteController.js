const mongoose = require("mongoose");
const FavoriteModel = require("../models/favoriteModel");

const favoriteController = {
  // 기존 toggleFavorite 메서드 유지
  toggleFavorite: async (req, res) => {
    try {
      const { symbol, fullName, isFavorite, user } = req.body;

      console.log("Received data:", req.body); // 요청 데이터 확인

      if (!symbol || !user) {
        return res
          .status(400)
          .json({ message: "Symbol and User are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const userId = new mongoose.Types.ObjectId(user);

      if (isFavorite) {
        const updatedFavorite = await FavoriteModel.findOneAndUpdate(
          { symbol, user: userId },
          { fullName, isFavorite: true },
          { upsert: true, new: true }
        );
        return res
          .status(200)
          .json({ message: "Favorite added", data: updatedFavorite });
      } else {
        const deletedFavorite = await FavoriteModel.findOneAndDelete({
          symbol,
          user: userId,
        });
        return res
          .status(200)
          .json({ message: "Favorite removed", data: deletedFavorite });
      }
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
      res
        .status(500)
        .json({ message: "An error occurred.", error: error.message });
    }
  },

  // 새로운 getFavorites 메서드
  getFavorites: async (req, res) => {
    try {
      const { user } = req.query;

      if (!user) {
        return res.status(400).json({ message: "User ID is required" });
      }

      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const userId = new mongoose.Types.ObjectId(user);

      const favorites = await FavoriteModel.find({ user: userId }).select(
        "symbol -_id"
      );

      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error in getFavorites:", error);
      res
        .status(500)
        .json({ message: "An error occurred.", error: error.message });
    }
  },
};

module.exports = favoriteController;
