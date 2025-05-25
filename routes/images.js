const express = require('express');
const router = express.Router(); // Creamos un "mini servidor" con sus propias rutas

const images = [];  // Simula una base de datos en memoria

router.get('/', (req, res) => {
    res.render('home.ejs', { images });  // Renderiza la vista y le pasa las imágenes
  });

  router.get('/new-image', (req, res) => {
    res.render('add-image.ejs', { message: undefined }); // Renderiza formulario vacío
  });

  router.post('/new-image', (req, res) => {
    const { title, url } = req.body;
    images.push({ title, url });
    console.log('Imagen añadida:', { title, url });
    res.render('add-image.ejs', { message: 'La imagen se ha añadido correctamente' });
  });
  
  
