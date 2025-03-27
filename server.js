
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
require("dotenv").config();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Store chat sessions
const chatSessions = {};

// Business Rules - Selects only ONE best recommendation
const applyBusinessRules = (answers) => {
  const { vehicleType, vehicleAge, coverageNeeded } = answers;

  let bestOption = "Third Party Car Insurance"; // Default option

  if (vehicleType && (vehicleType.toLowerCase().includes("truck") || vehicleType.toLowerCase().includes("racing car"))) {
    bestOption = "Third Party Car Insurance"; // Trucks & racing cars can't get MBI
  } else {
    if (coverageNeeded && coverageNeeded.toLowerCase().includes("full coverage")) {
      if (vehicleAge && parseInt(vehicleAge) < 10) {
        bestOption = "Comprehensive Car Insurance";
      } else {
        bestOption = "Third Party Car Insurance";
      }
    } else if (vehicleAge && parseInt(vehicleAge) < 10) {
      bestOption = "Mechanical Breakdown Insurance (MBI)";
    }
  }

  return bestOption;
};

// Start Consultation
app.post("/api/start-consultation", async (req, res) => {
  try {
    chatSessions[req.body.sessionID] = {
      chat: model.startChat({ history: [] }),
      optedIn: false,
      answers: {},
    };

    res.json({
      message: "I’m Tina. I help you choose the right vehicle insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle Chat Conversation
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionID, message } = req.body;
    const session = chatSessions[sessionID];

    if (!session) {
      return res.status(400).json({ error: "Chat session not found. Please start a new consultation." });
    }

    // Handle opt-in
    if (!session.optedIn) {
      if (message.toLowerCase().includes("yes") || message.toLowerCase().includes("sure")) {
        session.optedIn = true;
        const initialQuestion = await session.chat.sendMessage(
          "The user has agreed to proceed. Please ask a relevant first question about their vehicle insurance needs."
        );
        res.json({ message: initialQuestion.response.text() });
      } else {
        res.json({ message: "No problem! Let me know if you need assistance in the future." });
      }
      return;
    }

    // Store user response
    session.answers[Object.keys(session.answers).length + 1] = message;

    // Extract relevant answers
    let answers = {};
    Object.values(session.answers).forEach((answer) => {
      if (answer.toLowerCase().includes("car") || answer.toLowerCase().includes("truck")) answers.vehicleType = answer;
      if (answer.match(/\d+ years/)) answers.vehicleAge = answer.match(/\d+/)[0];
      if (answer.toLowerCase().includes("full coverage") || answer.toLowerCase().includes("liability")) {
        answers.coverageNeeded = answer;
      }
    });

    // Check if enough data is available to recommend a policy
    if (answers.vehicleType && answers.vehicleAge && answers.coverageNeeded) {
      const bestOption = applyBusinessRules(answers);
      let responseMessage = `Based on your details, I recommend: **${bestOption}**.`;
      responseMessage += `\n\nWould you like an insurance agent to contact you for further assistance? If so, please provide your contact details.`;
      res.json({ message: responseMessage });
    } else {
      // Generate next question dynamically
      const summary = Object.values(session.answers).join("\n");
      const nextQuestion = await session.chat.sendMessage(
        `Based on the user's responses so far:\n${summary}\nWhat is the next best question to ask about their vehicle insurance needs?`
      );
      res.json({ message: nextQuestion.response.text() });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});