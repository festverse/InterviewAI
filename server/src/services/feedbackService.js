const llmService = require('./llmService');
const { answerAnalysisPrompt } = require('../utils/prompts');

const analyzeTranscript = async (questions, transcript, type, targetRole) => {
  const systemPrompt = "You are an expert technical interviewer and career coach. Your job is to provide highly constructive, precise, and actionable feedback based on a candidate's interview transcript.";
  const userPrompt = answerAnalysisPrompt(questions, transcript, type, targetRole);

  try {
    const feedbackData = await llmService.generateCompletion(systemPrompt, userPrompt);
    return feedbackData;
  } catch (error) {
    console.error("Error analyzing transcript:", error);
    throw error;
  }
};

module.exports = {
  analyzeTranscript,
};
