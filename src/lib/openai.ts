export async function generateRoast(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // Mock response for testing - replace with real API when ready
  const mockResponse = {
    verdict:
      "This code is so simple even a beginner would be embarrassed to submit it. But hey, at least it works!",
    score: 7,
    feedbacks: [
      {
        lineNumber: null,
        severity: "good" as const,
        title: "It actually runs",
        message:
          "Surprisingly, this code does what it's supposed to do. A miracle, really.",
      },
      {
        lineNumber: 1,
        severity: "warning" as const,
        title: "Missing semicolon",
        message:
          "Use semicolons consistently in JavaScript to avoid ASI issues.",
      },
    ],
    diff: [
      {
        lineNumber: 1,
        type: "context" as const,
        content: "function hello() {",
      },
      { lineNumber: 2, type: "added" as const, content: '  return "world";' },
      { lineNumber: 3, type: "context" as const, content: "}" },
    ],
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return JSON.stringify(mockResponse);
}
