# Fototeca - Galería Inteligente de Animales Salvajes

**Proyecto académico del módulo Backend del Bootcamp de Desarrollo Full Stack (Ironhack)**

Este proyecto es una aplicación web que permite al usuario añadir imágenes de animales salvajes y visualizarlas en una galería. Además, utiliza inteligencia artificial (Google Gemini) para generar automáticamente una breve descripción basada en el título de la imagen.

---

## Funcionalidades principales

- Subida de nuevas imágenes mediante un formulario.
- Validación de título, URL y fecha.
- Extracción de colores dominantes de la imagen (`get-image-colors`).
- Generación automática de una descripción corta mediante IA.
- Almacenamiento de imágenes en un archivo local `images.json`.
- Interfaz construida con `EJS` y diseño responsivo usando `PicoCSS`.

---

## Tecnologías utilizadas

- `Node.js`
- `Express`
- `EJS`
- `fs-extra`
- `axios`
- `get-image-colors`
- `Google Gemini API`
- `Render` (para el despliegue)

---

## Cómo ejecutar el proyecto en local

```bash
git clone https://github.com/ccbaron/Fototeca-uf1844.git
cd fototeca
npm install
npm run dev
```

Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## Sobre la IA (Gemini)

La app utiliza la API de Gemini para generar descripciones automáticas de animales. Dado que no siempre es posible analizar la imagen directamente (por cuota o permisos), la descripción se basa en el título proporcionado por el usuario.

```js
const prompt = `Describe en una frase de máximo 7 palabras el siguiente animal: "${titulo}"`;
```

---

## Ejemplo de entrada

- **Título**: León
- **URL**: https://example.com/leon.jpg

> **Descripción generada**: "Felino africano, melena dorada, gran rugido"

---

## Despliegue

La aplicación está desplegada en Render:  
🔗 [https://fototeca-inteligente.onrender.com](https://fototeca-inteligente.onrender.com)

---

## Autor

Christian Barón  
Full Stack Developer en formación
