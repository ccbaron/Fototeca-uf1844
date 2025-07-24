const fs = require("fs");
const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyCfJhXZscbovHFNFTVdt4Mr-WDSzRUAG9o"; // Token de la API de Gemini

async function testGeminiV1() {
  const imageBuffer = fs.readFileSync("./hipopotamo.jpg"); // Revisamos si la imagen existe en el directorio y la intentamos leer como un buffer
  
  const base64Image = imageBuffer.toString("base64"); // Convertimos el buffer de la imagen a una cadena en base64
 
  const prompt = "Describe brevemente esta imagen:";

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(" Descripción generada:", text);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testGeminiV1();
