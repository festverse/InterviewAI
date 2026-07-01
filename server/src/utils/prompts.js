const questionGenerationPrompt = (type, role, level, count) => {
  return `Generate ${count} ${type} interview questions for a ${level} ${role} position.
  
Return the output EXACTLY as a raw JSON array of objects, with no markdown formatting, no code blocks, and no extra text. 

Each object must have the following properties:
- "text": The interview question.
- "category": The category of the question (e.g., "algorithm", "system design", "past experience", "conflict resolution").
- "difficulty": The difficulty level (e.g., "easy", "medium", "hard").

Example output format:
[
  {
    "text": "Tell me about a time you had a conflict with a coworker.",
    "category": "conflict resolution",
    "difficulty": "medium"
  }
]`;
};

const answerAnalysisPrompt = (questions, transcript, type, role) => {
  const interviewData = questions.map((q, idx) => {
    const answerData = transcript.find(t => t.questionIndex === idx);
    return {
      questionIndex: idx,
      questionText: q.text,
      category: q.category,
      answerText: answerData ? answerData.answer : "(No answer provided)",
      durationSeconds: answerData ? answerData.duration : 0
    };
  });

  return `You are an expert AI interview coach. Analyze the following ${type} interview transcript for a ${role} position.

Interview Data:
${JSON.stringify(interviewData, null, 2)}

Provide comprehensive feedback. Return the output EXACTLY as a raw JSON object, with no markdown formatting, no code blocks, and no extra text.

The JSON object must have the following structure:
{
  "scores": {
    "clarity": <number 1-10>,
    "technicalDepth": <number 1-10>,
    "structure": <number 1-10>,
    "fillerWords": <number 1-10>,
    "pacing": <number 1-10>
  },
  "overallScore": <number 1-10>,
  "summary": "<A 2-3 paragraph summary of their performance, highlighting strengths and weaknesses>",
  "suggestions": [
    "<Actionable suggestion 1>",
    "<Actionable suggestion 2>"
  ],
  "perQuestion": [
    {
      "questionIndex": <index>,
      "score": <number 1-10>,
      "feedback": "<Specific feedback for this answer>"
    }
  ]
}`;
};

module.exports = {
  questionGenerationPrompt,
  answerAnalysisPrompt,
};
