import readline from "readline";
import { GoogleGenAI } from "@google/genai";

//  Hardcoded API key (for testing only)
const ai = new GoogleGenAI({
  apiKey: "AIzaSyA26_4mMQPN14TSMA9J9QdS4rZwbM3eSrw"
});

// Example website context for CapoBrain
const websiteContext = `
You are an intelligent chatbot for the website CapoBrain.com.

Your ONLY source of truth is the following verified information extracted from the CapoBrain public website:

CapoBrain is a cloud-based, AI-powered school management software designed to streamline education processes, improve communication, and centralize school operations. It serves schools, colleges, and multi-campus institutions.

MAIN MODULES & FEATURES:
- Cloud-Based School Management System
- Computer-Based Exam Management
- Student & Parent Portals
- Online Daily Diary Feature
- AI-Powered Reporting & Analytics
- Mobile App Support
- Biometric Attendance Management
- Fee & Payment Management with Automated Reminders
- Inventory / Resource Management
- Staff & Student Management with Task Assignments
- Expense & Financial Administration
- Exam Scheduling, Grading & Result Generation
- Auto-Paper Generation (Curriculum Aligned)
- Multi-Campus Integration
- Dynamic School Website Management
- Transport & Route Management
- Real-Time Notifications & Instant Information Sharing
- Admission Test Automation
- Timetable & Scheduling Module
- Teacher Portal & Reception Management
- Summer Tasks & Resource Tracking
- Parent-Teacher Communication System
- Salary, Advance & Loan Management
- Certificate & ID Card Generation
- Library Management (Physical + Digital)
- Sports & Extracurricular Management

TARGET USERS:
- School administrators
- Teachers
- Students
- Parents
- Reception/front desk staff
- Multi-campus coordinators

COMMUNICATION & INTEGRATION:
- Real-time messaging & alerts
- SMS/Email integration
- Payment gateway integration
- Notifications for parents, teachers, and staff

HOW YOU ANSWER:
1. Answer strictly and only using the information above.
2. If the user asks about something not in the list, reply:
   "Apologies, I can only answer questions based on CapoBrain's official information."
3. Speak in a friendly, helpful, professional tone.
4. Do NOT invent or assume information outside the context.
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function chat() {
  while (true) {
    const userQuestion = await askQuestion("You: ");

    // Exit chat
    if (userQuestion.toLowerCase() === "exit") {
      console.log("Chat ended.");
      rl.close();
      break;
    }

    const prompt = `${websiteContext}\nUser Question: "${userQuestion}"`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      console.log("CapoBrain Bot:", response.text, "\n");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  }
}

chat();
