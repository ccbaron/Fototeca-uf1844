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
    const { title, url, date } = req.body;
    images.push({ title, url, date });
    console.log('Imagen añadida:', { title, url, date });
    res.render('add-image.ejs', { message: 'La imagen se ha añadido correctamente' });
});

// Middleware para manejar errores 404
router.use((req, res) => {
    res.status(404).render('404.ejs', { message: 'Página no encontrada' });
});

module.exports = router;

