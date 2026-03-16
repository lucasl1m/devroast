import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import "dotenv/config";
import { db } from "./src/db";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
] as const;

const ROAST_MODES = ["full", "light"] as const;

const FEEDBACK_TITLES: Record<string, string[]> = {
  javascript: [
    "using var instead of const/let",
    "imperative loop pattern",
    "missing error handling",
    "callback hell detected",
    "mutating state directly",
    "magic numbers everywhere",
    "no input validation",
  ],
  typescript: [
    "any type everywhere",
    "missing type annotations",
    "unused generic types",
    "any instead of unknown",
  ],
  python: [
    "using list instead of generator",
    "missing type hints",
    "bare except clauses",
    "snake_case violations",
  ],
  default: [
    "clear naming conventions",
    "single responsibility",
    "good error handling",
    "proper separation of concerns",
  ],
};

const FEEDBACK_MESSAGES: Record<string, string[]> = {
  javascript: [
    "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    "for loops are verbose and error-prone. use .map() or .reduce() for cleaner, functional transformations.",
    "This code has no error handling. Always wrap async operations in try-catch blocks.",
    "Callback hell detected. Consider using Promises or async/await for better readability.",
    "Mutating objects directly can lead to unexpected side effects. Consider immutable patterns.",
    "Magic numbers like 42 make code hard to understand. Use named constants instead.",
    "No input validation detected. Always validate user input before processing.",
  ],
  typescript: [
    "Using 'any' defeats the purpose of TypeScript. Define proper types for better type safety.",
    "Missing type annotations make the code harder to maintain. Add explicit types for function parameters and returns.",
    "Unused generic types suggest the code could be simplified.",
    "Use 'unknown' instead of 'any' when you don't know the type, then narrow it with type guards.",
  ],
  python: [
    "Using list comprehensions when generators would be more memory efficient for large datasets.",
    "Type hints improve code readability and enable better IDE support.",
    "Bare except clauses catch everything including KeyboardInterrupt. Specify exception types.",
    "Python convention is snake_case for functions and variables, not camelCase.",
  ],
  default: [
    "Good naming conventions make the code self-documenting.",
    "This function follows the single responsibility principle well.",
    "Proper error handling makes the code more robust.",
    "Good separation of concerns makes the code maintainable.",
  ],
};

const SAMPLE_CODES: Record<string, string[]> = {
  javascript: [
    `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
    `const fetchData = async (url) => {
  const response = await fetch(url);
  const data = response.json();
  return data;
}`,
    `function processData(data) {
  data.result = data.value.map(x => x * 2);
  return data;
}`,
  ],
  typescript: [
    `function getUser(id: any): any {
  return db.query('SELECT * FROM users WHERE id = ?', id);
}`,
    `interface Config {
  url: string;
  timeout: any;
}
const config: Config = { url: 'api.test', timeout: '5000' };`,
  ],
  python: [
    `def calculate_total(items):
    total = 0
    for i in range(len(items)):
        total = total + items[i]['price']
    return total`,
    `def process(data):
    try:
        return json.loads(data)
    except:
        return None`,
  ],
  default: [
    `function process(input) {
  return input.map(x => x * 2);
}`,
  ],
};

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFeedbacksForLanguage(
  language: string,
  count: number
): Array<{
  title: string;
  message: string;
  severity: "critical" | "warning" | "good" | "info";
}> {
  const titles = FEEDBACK_TITLES[language] || FEEDBACK_TITLES.default;
  const messages = FEEDBACK_MESSAGES[language] || FEEDBACK_MESSAGES.default;

  const feedbacks = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * titles.length);
    feedbacks.push({
      title: titles[idx],
      message: messages[idx],
      severity: getRandomElement([
        "critical",
        "warning",
        "good",
        "info",
      ] as const),
    });
  }
  return feedbacks;
}

async function seed() {
  console.log("🌱 Starting seed...");

  const SUBMISSIONS_COUNT = 100;

  for (let i = 0; i < SUBMISSIONS_COUNT; i++) {
    const language = getRandomElement(LANGUAGES);
    const roastMode = getRandomElement(ROAST_MODES);
    const codes = SAMPLE_CODES[language] || SAMPLE_CODES.default;
    const code = getRandomElement(codes);
    const lineCount = code.split("\n").length;
    const score = parseFloat(
      faker.number.float({ min: 1, max: 10, fractionDigits: 1 }).toFixed(1)
    );

    // Insert submission
    const submissionResult = await db.execute<{ id: string }>(
      sql`INSERT INTO code_submissions (code, language, roast_mode, line_count, score)
          VALUES (${code}, ${language}, ${roastMode}, ${lineCount}, ${score})
          RETURNING id`
    );

    const submissionId = submissionResult.rows[0].id;

    // Insert feedbacks (3-6 per submission)
    const feedbackCount = faker.number.int({ min: 3, max: 6 });
    const feedbacks = getFeedbacksForLanguage(language, feedbackCount);

    for (const feedback of feedbacks) {
      await db.execute(
        sql`INSERT INTO feedbacks (submission_id, line_number, severity, title, message)
            VALUES (${submissionId}, ${faker.number.int({ min: 1, max: lineCount })}, ${feedback.severity}, ${feedback.title}, ${feedback.message})`
      );
    }

    // Insert diff lines (optional, for some submissions)
    if (Math.random() > 0.5) {
      const diffLineCount = faker.number.int({ min: 2, max: 6 });
      for (let j = 0; j < diffLineCount; j++) {
        const type = getRandomElement(["added", "removed", "context"] as const);
        await db.execute(
          sql`INSERT INTO diff_lines (submission_id, line_number, type, content)
              VALUES (${submissionId}, ${j + 1}, ${type}, ${faker.lorem.sentence()})`
        );
      }
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  ✓ Created ${i + 1}/${SUBMISSIONS_COUNT} submissions`);
    }
  }

  console.log("✅ Seed completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
