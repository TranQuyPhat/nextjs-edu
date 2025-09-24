import { BackendQuizResponse, QuizzFormData } from "@/types/quiz.type";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {

  return twMerge(clsx(inputs))
}

export function mapBackendToFormData(apiData: BackendQuizResponse): QuizzFormData {
  console.log('apiData :', apiData);
  return {
    title: "",
    subject: "",
    startDate: "",
    endDate: "",
    timeLimit: 0,
    description: "",
    questions: apiData.questions.map((q, idx) => ({
      id: String(idx), // hoặc String(q.id) nếu API có id số
      correctAnswerTexts: null,
      correctAnswerRegex: null,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options.map(opt => ({
        optionLabel: opt.optionLabel,
        optionText: opt.optionText,
      })),
      correctOptions: String.fromCharCode(65 + q.correctIndex),
      explanation: q.explanation ?? "",
      topic: q.topic ?? "",
      difficulty: q.difficulty,
    })),
  };
}


interface JwtPayload {
  id: number;
  sub: string;
  roles: { name: string; id: number }[];
}

export function getCurrentUser(): JwtPayload | null {
  if (typeof window === "undefined") return null; // ✅ bảo vệ SSR

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

export function getCurrentUserId(): number | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.id;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

/** ========= TÁCH VÀ THAY THẾ CÔNG THỨC ========= */
export type Segment =
  | { type: "text"; content: string }
  | { type: "math"; content: string; display: boolean; index: number };

const MATH_INLINE = /\$([\s\S]+?)\$/g;
const MATH_BLOCK = /\$\$([\s\S]+?)\$\$/g;

export function splitLatexSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;
  let mathIndex = 0;

  const blocks: any[] = [];
  for (const m of input.matchAll(MATH_BLOCK)) {
    if (m.index == null) continue;
    blocks.push({
      start: m.index,
      end: m.index + m[0].length,
      latex: m[1].trim(),
      display: true,
    });
  }
  const inlines: any[] = [];
  for (const m of input.matchAll(MATH_INLINE)) {
    if (m.index == null) continue;
    inlines.push({
      start: m.index,
      end: m.index + m[0].length,
      latex: m[1].trim(),
      display: false,
    });
  }

  const all = [...blocks, ...inlines].sort((a, b) => a.start - b.start);

  const filtered: typeof all = [];
  for (const m of all) {
    const insideBlock = blocks.some(
      (b) => m !== b && m.start >= b.start && m.end <= b.end
    );
    if (!insideBlock) filtered.push(m);
  }

  for (const m of filtered) {
    if (cursor < m.start)
      segments.push({ type: "text", content: input.slice(cursor, m.start) });
    segments.push({
      type: "math",
      content: m.latex,
      display: m.display,
      index: mathIndex++,
    });
    cursor = m.end;
  }
  if (cursor < input.length)
    segments.push({ type: "text", content: input.slice(cursor) });
  return segments;
}

export function replaceNthMath(
  input: string,
  nth: number,
  newLatex: string,
  display: boolean
): string {
  let count = -1;
  const replBlock = (match: string) => {
    count++;
    return count === nth ? `$$${newLatex}$$` : match;
  };
  const replInline = (match: string) => {
    count++;
    return count === nth ? `$${newLatex}$` : match;
  };
  count = -1;
  let out = input.replace(MATH_BLOCK, replBlock);
  out = out.replace(MATH_INLINE, replInline);
  return out;
}