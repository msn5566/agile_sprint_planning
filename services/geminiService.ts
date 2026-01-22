
import { GoogleGenAI, Type } from "@google/genai";
import { Issue, Sprint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSprintAnalysis = async (sprint: Sprint, issues: Issue[]) => {
  const prompt = `
    Analyze the following Agile Sprint plan and provide a concise summary including:
    1. A clear Sprint Goal suggestion if the current one is vague.
    2. Potential risks based on issue complexity and priorities.
    3. Suggested focus areas for the team.

    Sprint: ${JSON.stringify(sprint)}
    Issues: ${JSON.stringify(issues.map(i => ({ title: i.title, points: i.storyPoints, priority: i.priority })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Could not generate AI analysis at this time.";
  }
};

export const predictComplexity = async (title: string, description: string) => {
  const prompt = `
    Acting as an expert Agile Lead, estimate the story points (Fibonacci: 1, 2, 3, 5, 8, 13) for this task:
    Title: ${title}
    Description: ${description}
    
    Return ONLY a JSON object with "points" (number) and "reasoning" (short string).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            points: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["points", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Estimation failed:", error);
    return { points: 1, reasoning: "Defaulted due to error." };
  }
};
