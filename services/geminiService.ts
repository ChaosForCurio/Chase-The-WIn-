import { GoogleGenAI } from "@google/genai";
import { Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface MoveResponse {
  move: string;
  explanation: string;
}

export const getGeminiMove = async (
  fen: string,
  validMoves: string[],
  difficulty: Difficulty
): Promise<MoveResponse> => {
  try {
    // Select model based on difficulty
    const modelId = difficulty === Difficulty.GRANDMASTER 
      ? 'gemini-3-pro-preview' 
      : 'gemini-2.5-flash';

    const systemInstruction = `You are a Chess Grandmaster engine. 
    You are playing Black. 
    Your goal is to win efficiently.
    Analyze the current FEN position and the list of legal moves.
    Select the BEST legal move from the list provided.
    
    Return ONLY a raw JSON object with no markdown formatting.
    The JSON must have this structure:
    {
      "move": "SAN string of the selected move",
      "explanation": "A very short, one-sentence tactical reason for this move."
    }
    
    Strict Rules:
    1. You must only pick a move from the "Legal Moves" list.
    2. Do not output markdown code blocks.
    3. Output valid JSON only.
    `;

    const prompt = `
    Current FEN: ${fen}
    Legal Moves: ${JSON.stringify(validMoves)}
    
    Select the best move for Black.
    `;

    // Add thinking budget for Grandmaster mode to allow deeper calculation
    const config: any = {
       responseMimeType: "application/json",
    };
    
    if (difficulty === Difficulty.GRANDMASTER) {
        config.thinkingConfig = { thinkingBudget: 2048 }; 
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction,
        ...config
      },
    });

    const text = response.text || "{}";
    // Clean up any potential markdown residue if the model disobeys (rare with flash-2.5/3-pro but good safety)
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const json = JSON.parse(cleanText);
    return {
        move: json.move || validMoves[0], // Fallback to first valid move if AI fails
        explanation: json.explanation || "Thinking..."
    };

  } catch (error) {
    console.error("Gemini Move Error:", error);
    // Fallback: Pick a random move if API fails
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return {
      move: randomMove,
      explanation: "I'm playing intuitively right now."
    };
  }
};
