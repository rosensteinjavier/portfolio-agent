import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

let rotations: any[] = [];
let portfolio: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    rotations = body.rotations || [];
    portfolio = body.portfolio || [];

    console.log('Using Groq API...');

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"), // Free model
      prompt: `
You are an AI portfolio manager.

Explain these portfolio rotations:

${JSON.stringify(rotations, null, 2)}

Portfolio:
${JSON.stringify(portfolio, null, 2)}

Be concise and professional.
      `,
      temperature: 0.7,
      maxTokens: 500,
    });

    console.log('Groq response received, length:', text.length);

    return Response.json({ explanation: text });

  } catch (err: any) {
    console.error("AGENT ERROR:", err.message);

    // Return fallback response
    return Response.json({
      explanation:
        rotations.length > 0
          ? `Fallback: rotate from ${rotations[0].from} to ${rotations[0].to} based on relative strength. Sorry for resumed explanation, we ran out of AI Gas :-(`
          : "No recommendation available.",
    });
  }
}