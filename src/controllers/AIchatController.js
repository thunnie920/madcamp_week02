const openai = require("../config/openai");

exports.handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: "Message is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 사용할 모델
      messages: [
        {
          role: "system",
          content:
            "사용자는 코인에 대해 잘 몰라. 너는 친절하게 사용자가 물어보는 모든 코인에 대한 것들을 대답해주어야해.",
        }, // 시스템 메시지
        { role: "user", content: message }, // 사용자 입력
      ],
    });
    const gptReply = response.choices[0].message.content;
    res.json({ reply: gptReply });
  } catch (error) {
    console.error(
      "Error communicating with GPT:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send({ error: "GPT API error." });
  }
};
