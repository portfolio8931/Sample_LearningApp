import { describe, it, expect } from "vitest";
import { checkAnswer } from "../../utils/checkAnswer";
import type { Question } from "../../types";

describe("checkAnswer", () => {
  describe("single", () => {
    const singleQuestion: Question = {
      id: "q1",
      type: "single",
      prompt: "単一選択",
      choices: ["A", "B", "C"],
      answerIndex: 1,
      explanation: "",
    };

    it("正解", () => {
      expect(checkAnswer(singleQuestion, 1)).toBe(true);
    });

    it("不正解", () => {
      expect(checkAnswer(singleQuestion, 0)).toBe(false);
    });
  });

  describe("multi", () => {
    const multiQuestion: Question = {
      id: "q2",
      type: "multi",
      prompt: "複数選択",
      choices: ["A", "B", "C", "D"],
      answerIndices: [0, 2],
      explanation: "",
    };

    it("正解", () => {
      expect(checkAnswer(multiQuestion, [0, 2])).toBe(true);
      expect(checkAnswer(multiQuestion, [2, 0])).toBe(true);
    });

    it("不正解", () => {
      expect(checkAnswer(multiQuestion, [0])).toBe(false);
      expect(checkAnswer(multiQuestion, [0, 1])).toBe(false);
    });
  });

  describe("text", () => {
    const textQuestion: Question = {
      id: "q3",
      type: "text",
      prompt: "自由記述",
      expected: "const x = 10;",
      explanation: "",
    };

    it("正規化して判定", () => {
      expect(checkAnswer(textQuestion, "const x = 10;")).toBe(true);
      expect(checkAnswer(textQuestion, "CONST X = 10;")).toBe(true);
      expect(checkAnswer(textQuestion, "constx=10;")).toBe(true);
    });

    it("不正解", () => {
      expect(checkAnswer(textQuestion, "const x = 20;")).toBe(false);
    });
  });
});
