import mammoth from "mammoth";

export const readDocxFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });

    const parser = new DOMParser();
    const doc = parser.parseFromString(result.value, "text/html");

    const questions = [];
    let currentQuestion: {
        question: string;
        options: string[];
        answer: string | null;
    } | null = null;

    const paragraphs = doc.querySelectorAll("p");

    for (const p of paragraphs) {
        const html = p.innerHTML.trim();
        const text = p.textContent?.trim() || "";

        if (/^\d+\./.test(text)) {
            if (currentQuestion) questions.push(currentQuestion);
            currentQuestion = {
                question: text.replace(/^\d+\.\s*/, ""),
                options: [],
                answer: null
            };
        }

        else if (/^[A-D]\./.test(text)) {
            if (!currentQuestion) return;

            const letter = text[0];
            const isBold = /<strong>|<b>/.test(html);

            currentQuestion.options.push(text);
            if (isBold) {
                currentQuestion.answer = letter;
            }
        }

        // TH3: Dòng đáp án ở cuối
        else if (/^Đáp án[:：]/i.test(text)) {
            const match = text.match(/Đáp án[:：]\s*([A-D])/i);
            if (match && currentQuestion) {
                currentQuestion.answer = match[1];
            }
        }

    }

    if (currentQuestion) questions.push(currentQuestion);

    return questions;
};
