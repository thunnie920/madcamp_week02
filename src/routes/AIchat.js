const express = require("express");
const { handleChat } = require("../controllers/AIchatController");

const router = express.Router();

router.post("/", handleChat); // POST /chat
module.exports = router;
