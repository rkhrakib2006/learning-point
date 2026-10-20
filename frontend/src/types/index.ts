export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type ExamType = 'MCQ' | 'CQ' | 'MIXED';

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  classLevel?: number;
  isAccessUnlocked?: boolean;
}

export interface AuthResponse {
  access: string;
  user: User;
}

export interface Exam {
  id: string;
  title: string;
  type: ExamType;
  classLevel: number;
  durationMin: number;
  totalMarks: number;
  passMarks: number;
  startAt: string;
  endAt: string;
}

export interface Question {
  id: string;
  type: 'MCQ' | 'CQ';
  text: string;
  marks: number;
  options?: { id: string; text: string }[];
}

export interface Answer {
  questionId: string;
  mcqChoice?: string | null;
  cqText?: string | null;
}

export interface Submission {
  id: string;
  examId: string;
  status: string;
  mcqScore?: number;
  cqScore?: number;
  totalScore?: number;
  grade?: string;
  passed?: boolean;
  submittedAt?: string;
  exam?: { title: string; totalMarks: number; passMarks: number };
}