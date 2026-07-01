const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates a completion from Groq Llama 3 model
 * @param {string} systemPrompt 
 * @param {string} userPrompt 
 * @returns {Promise<any>} The parsed JSON object or array
 */
const generateCompletion = async (systemPrompt, userPrompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No content received from LLM");
    }

    // Attempt to extract JSON from the string if there are any markdown wrappers
    let jsonStr = responseContent.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7);
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      }
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.substring(3);
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      }
    }
    
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("LLM Service Error:", error);
    throw new Error("Failed to generate response from LLM");
  }
};

module.exports = {
  generateCompletion,
};
