import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { rotations, portfolio } = await req.json();

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
    console.error("AGENT ERROR:", err);

    return Response.json(
      { error: "Agent error", detail: err.message },
      { status: 500 }
    );
  }
}