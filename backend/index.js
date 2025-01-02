const express = require("express");
const app = express();
const PORT = 5000;

// 간단한 API 엔드포인트
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
