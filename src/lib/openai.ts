const API_KEY = process.env.GEMINI_API_KEY || "";

function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    return match[1].trim();
  }
  return text.trim();
}

export async function generateRoast(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
    const text = data.candidates[0].content.parts[0].text;
    return extractJSON(text);
  }

  return "{}";
}
