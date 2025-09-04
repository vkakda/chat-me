// import { GoogleGenrativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenrativeAI(process.env.GOOGLE_AI_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"})

// export const generateResult = async(prompt)=> {
    
//     const result = await model.generateContent(prompt);

//     return result.response.text();
// }


import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_AI_KEY);

export const generateResult = async(prompt)=> {
  const model =  genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  console.log(prompt)

  const result = await model.generateContent(prompt);

  return result.response.text;
}
