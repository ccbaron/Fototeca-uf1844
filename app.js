const express = require('express');
const path = require('path');
const app = express();                          // Creamos la app principal
const imagesRoutes = require('./routes/images'); // Importamos las rutas definidas en otro archivo

app.set('view engine', 'ejs');                             // Le decimos a Express que usaremos EJS para renderizar vistas
app.set('views', path.join(__dirname, 'views'));           // Define dónde están ubicadas las vistas (carpeta /views)

app.use(express.static('public'));                         // Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.urlencoded({ extended: true }));           // Leer datos de formularios HTML (req.body)
app.use(express.json());                                   // Leer datos en formato JSON

app.use('/', imagesRoutes);                                // Usa las rutas que definimos en routes/images.js

module.exports = app;  // Exporta la app para que pueda ser usada en index.js

