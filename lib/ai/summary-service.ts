// workspace/link-thread-project/lib/ai/summary-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logToTelegram } from "../telegram-logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBGPbsQFyXJaa2DuquCnmTviNzzYaUCpbI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeContent(title: string, text: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyBGPbsQFyXJaa2DuquCnmTviNzzYaUCpbI";
  
  if (!geminiKey) {
    await logToTelegram("🚨 *Gemini Error*: API Key is missing in environment.");
    return "요약을 생성할 수 없습니다. (API Key Missing)";
  }

  const prompt = `
    LinkThread 서비스의 게시물 요약을 작성해줘. 
    제목: ${title}
    내용: ${text}
    
    위 내용을 바탕으로 흥미로운 요약 2문장과 토론을 유도하는 질문 1개를 한국어로 작성해줘.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    if (!summary) throw new Error("Empty response from Gemini");
    
    return summary;
  } catch (error: any) {
    console.error("[Gemini] Summary failed:", error);
    await logToTelegram(`🚨 *Gemini Summary Error*\nTitle: ${title}\nError: \`\`\`${error.message}\`\`\``);
    return "요약을 생성할 수 없습니다.";
  }
}
