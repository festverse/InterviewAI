const llmService = require('./llmService');
const { questionGenerationPrompt } = require('../utils/prompts');

const generateQuestions = async (type, targetRole, experienceLevel, count = 5) => {
  const systemPrompt = "You are an expert technical interviewer helping to prepare candidates.";
  const userPrompt = questionGenerationPrompt(type, targetRole, experienceLevel, count);

  try {
    const questions = await llmService.generateCompletion(systemPrompt, userPrompt);
    if (!Array.isArray(questions)) {
      throw new Error("Invalid format returned from LLM for questions");
    }
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

module.exports = {
  generateQuestions,
};
