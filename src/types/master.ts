// カリキュラム・章・単元
export type Curriculum = {
  id: string; // 一意ID
  title: string; // カリキュラム名
  description: string; // 説明文
  chapters: Chapter[]; // 章の配列
};

export type Chapter = {
  id: string;
  curriculumId: string; // 親カリキュラムのID
  order: number; // 表示順序(1以上の整数)
  title: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  chapterId: string; // 親章のID
  order: number; // 表示順序(1以上の整数)
  title: string;
  contentMarkdown: string; // 学習コンテンツ(Markdown形式)
  estimatedMinutes: number; // 目安学習時間(分)
  quiz: Quiz; // 単元末の確認問題
};

// 確認問題
export type Quiz = {
  questions: Question[];
};

// Question は3タイプの discriminated union
export type Question = QuestionSingle | QuestionMulti | QuestionText;

export type QuestionSingle = {
  id: string;
  type: "single";
  prompt: string; // 問題文
  choices: string[]; // 選択肢(2件以上)
  answerIndex: number; // 正解の選択肢のインデックス(0始まり)
  explanation: string; // 解説文
};

export type QuestionMulti = {
  id: string;
  type: "multi";
  prompt: string;
  choices: string[];
  answerIndices: number[]; // 正解の選択肢のインデックス配列
  explanation: string;
};

export type QuestionText = {
  id: string;
  type: "text";
  prompt: string;
  expected: string; // 期待される回答文字列
  explanation: string;
};
