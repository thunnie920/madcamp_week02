const User = require("../models/userModel");

// 샘플 회원 데이터 생성
const createSampleUsers = async (req, res) => {
  try {
    const users = [
      {
        user_id: "user001",
        password: "password123",
        email: "user001@example.com",
      },
      {
        user_id: "user002",
        password: "securepass456",
        email: "user002@example.com",
      },
      {
        user_id: "user003",
        password: "mypassword789",
        email: "user003@example.com",
      },
    ];

    // 기존 데이터 제거 후 새로 삽입
    await User.deleteMany({});
    await User.insertMany(users);

    res.status(200).send("샘플 회원 데이터가 성공적으로 삽입되었습니다.");
  } catch (err) {
    res.status(500).send("회원 데이터 삽입 실패: " + err.message);
  }
};

// 모든 회원 조회
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("회원 조회 실패: " + err.message);
  }
};

// 회원 추가 (가입)
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).send("필수값이 지정되지 않았습니다.");
    }
    res.status(201).send("회원 가입 성공");
  } catch (err) {
    res.send(error.message);
  }
};

module.exports = {
  createSampleUsers,
  getAllUsers,
  createUser,
};
