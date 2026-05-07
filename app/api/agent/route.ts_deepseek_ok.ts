import { generateText } from "ai";
import { createOpenAI as createOpenAIProvider } from "@ai-sdk/openai";


// Debug - check key format
console.log("API Key loaded:", !!process.env.DEEPSEEK_API_KEY);
console.log("API Key length:", process.env.DEEPSEEK_API_KEY?.length);
console.log("API Key starts with sk-:", process.env.DEEPSEEK_API_KEY?.startsWith("sk-"));
console.log("First 10 chars:", process.env.DEEPSEEK_API_KEY?.substring(0, 10));



let rotations: any[] = [];
let portfolio: any[] = [];

// Alternative approach using custom headers
// const customProvider = (modelName: string) => {
//   return {
//     // @ts-ignore - Bypass type checking for custom configuration
//     modelId: modelName,
//     getHeaders: () => ({
//       'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//       'Content-Type': 'application/json',
//     }),
//     url: 'https://api.deepseek.com/v1/chat/completions',
//   };
// };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    rotations = body.rotations || [];
    portfolio = body.portfolio || [];


    console.log('Sending request to DeepSeek API...');


    // Use fetch directly with DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `
You are an AI portfolio manager.

Explain these portfolio rotations:

${JSON.stringify(rotations, null, 2)}

Portfolio:
${JSON.stringify(portfolio, null, 2)}

Be concise and professional.
            `
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });


    console.log('Response status:', response.status);
    console.log('Response ok?', response.ok);

// Get the raw response text first
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${responseText}`);
    }

    // Parse the JSON
    const data = JSON.parse(responseText);
    console.log('Parsed data structure:', Object.keys(data));

    // Check the response structure
    if (data.error) {
      console.error('DeepSeek API error:', data.error);
      throw new Error(`DeepSeek error: ${data.error.message}`);
    }

    // Try different possible response structures
    let text = null;

    if (data.choices && data.choices[0] && data.choices[0].message) {
      // Standard OpenAI-compatible format
      text = data.choices[0].message.content;
    } else if (data.response) {
      // Some API versions
      text = data.response;
    } else if (data.result) {
      // Alternative format
      text = data.result;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Unknown response format from DeepSeek');
    }

    console.log('Extracted text length:', text?.length);

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










// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
//
// let rotations: any[] = [];
// let portfolio: any[] = [];
//
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     rotations = body.rotations || [];
//     portfolio = body.portfolio || [];
//
//     //const { rotations, portfolio } = await req.json();
//
//     const { text } = await generateText({
//       model: openai("gpt-4o-mini"), // 👈 clave
//       prompt: `
// You are an AI portfolio manager.
//
// Explain these portfolio rotations:
//
// ${JSON.stringify(rotations, null, 2)}
//
// Portfolio:
// ${JSON.stringify(portfolio, null, 2)}
//
// Be concise and professional.
//       `,
//     });
//
//     return Response.json({ explanation: text });
//
//   } catch (err: any) {
//     console.error("AGENT ERROR:", err.message);
//
//     return Response.json({
//     explanation:
//         rotations.length > 0
//             ? `Fallback: rotate from ${rotations[0].from} to ${rotations[0].to} based on relative strength. sory for resumed explanation, we run out of IA Gas :-(`
//             : "No recommendation available.",
//     });
//
//   }
// }