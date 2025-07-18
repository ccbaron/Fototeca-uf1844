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
    console.log('Datos recibidos:', req.body);

    // Validar título: solo letras, números, espacios y guión bajo
    const titleRegex = /^[A-Za-z0-9_ ]{1,30}$/;
    if (!titleRegex.test(title)) {
        return res.render('add-image.ejs', {
            message: 'El título debe tener máximo 30 caracteres y solo puede contener letras, números, espacios o guiones bajos (_).'
        });
    }

    // Validar URL
    try {
        new URL(url); // Lanza error si la URL no es válida
    } catch {
        return res.render('add-image.ejs', {
            message: 'La URL no es válida.'
        });
    }

    // Validar fecha: debe estar presente y ser válida
    if (!date) {
        return res.render('add-image.ejs', {
            message: 'La fecha es obligatoria.'
        });
    }

    // Verificar formato de fecha
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.render('add-image.ejs', {
            message: 'Formato de fecha inválido.'
        });
    }

    // Verificar que la fecha no sea futura o muy antigua
    const today = new Date();
    const minDate = new Date('1900-01-01');

    if (parsedDate > today) {
        return res.render('add-image.ejs', {
            message: 'La fecha no puede ser posterior a hoy.'
        });
    }

    if (parsedDate < minDate) {
        return res.render('add-image.ejs', {
            message: 'La fecha no puede ser anterior al año 1900.'
        });
    }

    // Verificar duplicados (misma URL)
    const exists = images.find(img => img.url === url);
    if (exists) {
        return res.render('add-image.ejs', {
            message: 'Ya existe una imagen con esa URL.'
        });
    }

    // Si todo está correcto, guardar
    images.push({ title, url, date });
    console.log('Imagen añadida:', { title, url, date });

    res.render('add-image.ejs', {
        message: 'La imagen se ha añadido correctamente.'
    });
});


// Middleware para manejar errores 404
router.use((req, res) => {
    res.status(404).render('404.ejs', { message: 'La página o recurso que buscas no existe o ha sido movido.' });
});

module.exports = router;

