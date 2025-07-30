
const axios = require("axios");
// Importamos axios para realizar solicitudes HTTP

require("dotenv").config(); // Carga variables desde .env

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // API Key de Gemini

async function generarDescripcionDesdeTexto(titulo) {
  const prompt = `Describe en una frase de máximo 7 palabras el siguiente animal: "${titulo}"`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  // Configuración de la solicitud a Gemini
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      body,
      { headers: { "Content-Type": "application/json" } }
    );
    // Extraemos la descripción generada
    const descripcion =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Descripción no disponible.";
    return descripcion.trim();

  } catch (error) {
    console.error("Error al generar descripción con Gemini:", error.message);
    return "Descripción no disponible.";
  }
}

module.exports = { generarDescripcionDesdeTexto };
