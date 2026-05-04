import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

let rotations: any[] = [];
let portfolio: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    rotations = body.rotations || [];
    portfolio = body.portfolio || [];

    //const { rotations, portfolio } = await req.json();

    const { text } = await generateText({
      model: openai("gpt-4o-mini"), // 👈 clave
      prompt: `
You are an AI portfolio manager.

Explain these portfolio rotations:

${JSON.stringify(rotations, null, 2)}

Portfolio:
${JSON.stringify(portfolio, null, 2)}

Be concise and professional.
      `,
    });

    return Response.json({ explanation: text });

  } catch (err: any) {
    console.error("AGENT ERROR:", err.message);

    return Response.json({
    explanation:
        rotations.length > 0
            ? `Fallback: rotate from ${rotations[0].from} to ${rotations[0].to} based on relative strength. sory for resumed explanation, we run out of IA Gas :-(`
            : "No recommendation available.",
    });

  }
}