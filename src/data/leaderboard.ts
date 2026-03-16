export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  score: number;
  language: string;
  code: string;
  filename: string;
  feedbackCount: number;
  createdAt: string;
}

export const leaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    username: "junior_dev_404",
    score: 2.1,
    language: "javascript",
    filename: "auth.js",
    feedbackCount: 47,
    createdAt: "2024-01-15",
    code: `function authenticate(user, pass) {
  if (user === "admin" && pass === "admin") {
    return true;
  }
  return false;
}`,
  },
  {
    id: "2",
    rank: 2,
    username: "spaghetti_coder",
    score: 2.8,
    language: "python",
    filename: "main.py",
    feedbackCount: 35,
    createdAt: "2024-01-14",
    code: `def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
        else:
            result.append(item)
    return result`,
  },
  {
    id: "3",
    rank: 3,
    username: "copy_paste_warrior",
    score: 3.4,
    language: "typescript",
    filename: "utils.ts",
    feedbackCount: 28,
    createdAt: "2024-01-13",
    code: `const x = 1;
const y = 2;
const z = 3;
const a = 4;
const b = 5;`,
  },
  {
    id: "4",
    rank: 4,
    username: "naming_is_hard",
    score: 4.0,
    language: "rust",
    filename: "lib.rs",
    feedbackCount: 22,
    createdAt: "2024-01-12",
    code: `fn main() {
    let a = vec![1, 2, 3];
    let b = a.iter().sum();
    println!("{}", b);
}`,
  },
  {
    id: "5",
    rank: 5,
    username: "variable_naming_champion",
    score: 4.8,
    language: "go",
    filename: "main.go",
    feedbackCount: 19,
    createdAt: "2024-01-11",
    code: `package main

import "fmt"

func main() {
    x := []int{1, 2, 3}
    fmt.Println(x)
}`,
  },
];

export const leaderboardStats = {
  totalSubmissions: 2847,
  averageScore: 4.2,
};
