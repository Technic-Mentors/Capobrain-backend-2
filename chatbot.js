import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced chatbot with better context understanding
export async function askChatbot(question) {
  console.log("=== askChatbot called ===");
  console.log("Question:", question);
  
  try {
    // Read website data
    const websiteDataPath = path.join(__dirname, "website_data.txt");
    
    if (!fs.existsSync(websiteDataPath)) {
      return "I don't have access to the website data. Please ensure website_data.txt exists in the Backend folder.";
    }

    const websiteData = fs.readFileSync(websiteDataPath, "utf8");
    console.log("✓ Website data loaded, length:", websiteData.length);

    // Extract relevant information based on the question
    const answer = generateSmartResponse(question, websiteData);
    
    console.log("✓ Answer generated, length:", answer.length);
    return answer;
    
  } catch (error) {
    console.error("=== askChatbot Error ===");
    console.error("Error:", error.message);
    throw error;
  }
}

function generateSmartResponse(question, content) {
  const lowerQuestion = question.toLowerCase();
  
  // Detect question type and intent
  const questionType = detectQuestionType(lowerQuestion);
  
  // Split content into sentences for better context
  const sentences = content
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
  
  // Extract keywords from question
  const keywords = extractKeywords(lowerQuestion);
  
  // Find relevant sentences with context scoring
  const relevantInfo = findRelevantSentences(sentences, keywords, questionType);
  
  if (relevantInfo.length === 0) {
    return generateFallbackResponse(questionType);
  }
  
  // Generate natural response based on question type
  return formatResponse(relevantInfo, questionType, question);
}

function detectQuestionType(question) {
  if (question.includes('what is') || question.includes('what are')) {
    return 'definition';
  }
  if (question.includes('how') || question.includes('how to')) {
    return 'how-to';
  }
  if (question.includes('feature') || question.includes('offer') || question.includes('provide')) {
    return 'features';
  }
  if (question.includes('price') || question.includes('cost') || question.includes('pricing')) {
    return 'pricing';
  }
  if (question.includes('benefit') || question.includes('advantage') || question.includes('why')) {
    return 'benefits';
  }
  if (question.includes('contact') || question.includes('reach') || question.includes('support')) {
    return 'contact';
  }
  if (question.includes('who') || question.includes('for whom') || question.includes('suitable')) {
    return 'audience';
  }
  return 'general';
}

function extractKeywords(question) {
  const commonWords = [
    'what', 'is', 'are', 'the', 'a', 'an', 'how', 'does', 'do', 'can', 
    'about', 'tell', 'me', 'your', 'our', 'it', 'this', 'that', 'these',
    'those', 'with', 'for', 'to', 'of', 'in', 'on', 'at', 'by'
  ];
  
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
  
  return [...new Set(words)]; // Remove duplicates
}

function findRelevantSentences(sentences, keywords, questionType) {
  const scored = sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase();
    let score = 0;
    
    // Score based on keyword matches
    keywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) {
        // Exact match gets higher score
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        score += regex.test(lowerSentence) ? 3 : 1;
      }
    });
    
    // Boost score based on question type context
    switch (questionType) {
      case 'features':
        if (lowerSentence.match(/feature|capability|function|tool|module|system/)) score += 2;
        break;
      case 'pricing':
        if (lowerSentence.match(/price|cost|plan|subscription|free|paid/)) score += 3;
        break;
      case 'benefits':
        if (lowerSentence.match(/benefit|advantage|help|improve|efficient|save/)) score += 2;
        break;
      case 'contact':
        if (lowerSentence.match(/contact|email|phone|support|reach|call/)) score += 3;
        break;
      case 'how-to':
        if (lowerSentence.match(/can|enable|allow|use|step|process|simply/)) score += 2;
        break;
      case 'definition':
        if (sentence.length < 200 && lowerSentence.match(/is a|is an|provides|offers/)) score += 2;
        break;
    }
    
    // Penalize very long or very short sentences
    if (sentence.length < 30 || sentence.length > 300) score -= 1;
    
    return { sentence, score };
  });
  
  // Return top 3-5 most relevant sentences
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.sentence);
}

function formatResponse(sentences, questionType, originalQuestion) {
  let response = '';
  
  switch (questionType) {
    case 'definition':
      response = sentences.slice(0, 2).join(' ');
      break;
      
    case 'features':
      response = 'Here are the key features:\n\n';
      sentences.forEach((sent, idx) => {
        response += `${idx + 1}. ${sent}\n\n`;
      });
      break;
      
    case 'pricing':
      response = sentences.join('\n\n');
      if (!response.toLowerCase().includes('contact')) {
        response += '\n\nFor detailed pricing information, please contact our sales team.';
      }
      break;
      
    case 'benefits':
      response = 'Key benefits include:\n\n';
      sentences.forEach((sent, idx) => {
        response += `• ${sent}\n\n`;
      });
      break;
      
    case 'contact':
      response = sentences.join('\n\n');
      break;
      
    case 'how-to':
      response = sentences.slice(0, 3).join(' ');
      break;
      
    default:
      response = sentences.slice(0, 3).join(' ');
  }
  
  return response.trim();
}

function generateFallbackResponse(questionType) {
  const fallbacks = {
    'pricing': 'For detailed pricing information, please contact our sales team or visit the pricing section on our website.',
    'contact': 'You can reach us through our website contact form or email our support team.',
    'features': 'CapoBrain offers comprehensive school management features. Please visit our website for a complete list of features.',
    'definition': 'CapoBrain is a comprehensive school management system designed to streamline educational administration.',
    'benefits': 'CapoBrain helps schools improve efficiency, reduce administrative burden, and enhance communication between stakeholders.',
    'general': 'For more specific information about CapoBrain, please visit our website or contact our support team.'
  };
  
  return fallbacks[questionType] || fallbacks['general'];
}