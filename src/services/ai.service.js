const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function createImagetoCaption(base64ImageData) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageData,
      },
    },
    {
      text: "Caption this image",
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: `
         You are a creative assistant helping to generate engaging captions. 
         Keep the tone casual, fun, and suitable for social media. 
         Include relevant emojis and a few hashtags that match the content of the image.
         The caption should be short and catchy, no longer than 2-3 sentences.
`,
    },
  });

  return response.text;
}

module.exports = { createImagetoCaption };
