import express from "express";
import { askChatbot } from "../chatbot.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Chatbot API is running",
    timestamp: new Date().toISOString()
  });
});

// Main chatbot endpoint
router.post("/ask", async (req, res) => {
  console.log("=== Chatbot Request Received ===");
  console.log("Request body:", req.body);
  
  try {
    const { question } = req.body;
    
    // Validate input
    if (!question) {
      console.log("Error: No question provided");
      return res.status(400).json({
        success: false,
        error: "Question is required"
      });
    }

    if (typeof question !== 'string') {
      console.log("Error: Question is not a string");
      return res.status(400).json({
        success: false,
        error: "Question must be a string"
      });
    }

    if (question.trim().length === 0) {
      console.log("Error: Question is empty");
      return res.status(400).json({
        success: false,
        error: "Question cannot be empty"
      });
    }

    console.log("Processing question:", question);
    console.log("Calling askChatbot...");

    // Set a longer timeout for the response
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);

    const answer = await askChatbot(question);
    
    console.log("Answer generated successfully");
    console.log("Answer length:", answer.length);
    
    res.json({
      success: true,
      answer: answer,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("=== Chatbot Route Error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Don't crash the server
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while processing your question",
      errorType: error.name,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;