import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { createModel } from '../../lib/ai-models';

const systemPrompt = `Analyze the content of the given URL and summarize the 
key points in exactly five sentences. The summary should be clear, concise, and informative, 
suitable for a general audience with common knowledge. Focus on the 
most important details, omitting unnecessary specifics. Maintain a neutral and 
objective tone. Do not include personal opinions or speculative statements.
`;

export async function POST(req: Request) {
  const { config, text } = await req.json();

  const model = createModel(config.provider, config.modelId, config.apiKey, config.baseURL);

  const { text: summerizedText } = await generateText({
    model,
    system: systemPrompt,
    prompt: `Summarize this with five line with bullet points.\n\n${text}`,
  });

  return new NextResponse(summerizedText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
