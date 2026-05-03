import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { rotations, portfolio } = await req.json();

  const prompt = `
You are an AI portfolio manager.

The system already decided these rotations:

${JSON.stringify(rotations, null, 2)}

User portfolio:
${JSON.stringify(portfolio, null, 2)}

Explain WHY these rotations make sense.
Be concise, professional, and insightful.
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    explanation: data.choices?.[0]?.message?.content,
  });
}
