const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyCfJhXZscbovHFNFTVdt4Mr-WDSzRUAG9o"; // ✅ reemplázala si hace falta

async function generarDescripcionDesdeTexto(titulo) {
  const prompt = `Describe en una frase de máximo 7 palabras el siguiente animal: "${titulo}"`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const descripcion =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Descripción no disponible.";
    return descripcion.trim();
  } catch (error) {
    console.error("❌ Error al generar descripción con Gemini:", error.message);
    return "Descripción no disponible.";
  }
}

module.exports = { generarDescripcionDesdeTexto };
