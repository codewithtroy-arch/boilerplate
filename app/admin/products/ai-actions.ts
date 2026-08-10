'use server';

import { getSettings } from '@/lib/get-settings';

export async function generateProductDescription(productName: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !productName.trim()) return '';

  const settings = await getSettings();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `Write one short, appealing product description (under 15 words, no quotes, no markdown) for "${productName}", sold by ${settings.business_name}, a skincare business. Reply with only the description text, nothing else.`,
          },
        ],
      }),
    });

    if (!res.ok) return '';

    const data = await res.json();
    const text = data?.content?.find((b: { type: string }) => b.type === 'text')?.text;
    return typeof text === 'string' ? text.trim() : '';
  } catch {
    return '';
  }
}
