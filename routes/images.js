const express = require('express');
const router = express.Router(); // Creamos un "mini servidor" con sus propias rutas
const fs = require('fs-extra'); // Para manejar archivos y directorios 
const { console } = require('inspector');
const path = require('path');

const dataPath = path.join(__dirname, '../images.json'); // Ruta al archivo JSON donde guardaremos las imágenes

// Cargar imágenes desde el archivo JSON al iniciar la aplicación
let images = [];
fs.readJson(dataPath)
    .then(data => {
        images = data;
        console.log('Imágenes cargadas desde images.json');
    })
    .catch(() => {
        console.log('No se pudo leer images.json, se usará un array vacío');
    });

router.get('/', (req, res) => {
    res.render('home.ejs', { images });  // Renderiza la vista y le pasa las imágenes
});

router.get('/new-image', (req, res) => {
    res.render('add-image.ejs', { message: undefined, description: '' });
});



router.post('/new-image', async (req, res) => {
    const { title, url, date } = req.body;
    console.log('Datos recibidos:', req.body);

    // Validar título: solo letras, números, espacios y guión bajo
    const titleRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9_ ]{1,30}$/; // Expresión regular para validar el título
    if (!titleRegex.test(title)) { // Verifica que el título cumpla con el formato
        return res.render('add-image.ejs', {
            message: 'El título debe tener máximo 30 caracteres y solo puede contener letras, números, espacios o guiones bajos (_).'
        });
    }

    // Validar URL
    try {
        new URL(url); // Lanza error si la URL no es válida
    } catch {
        return res.render('add-image.ejs', {
            message: 'La URL no es válida.',
            description: ''
        });
    }

    // Validar fecha: debe estar presente y ser válida
    if (!date) {
        return res.render('add-image.ejs', {
            message: 'La fecha es obligatoria.',
            description: ''
        });
    }

    // Verificar formato de fecha
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.render('add-image.ejs', {
            message: 'Formato de fecha inválido.',
            description: ''
        });
    }

    // Verificar que la fecha no sea futura o muy antigua
    const today = new Date();
    const minDate = new Date('1900-01-01');

    if (parsedDate > today) { // Verificamos que la fecha no sea posterior a hoy
        return res.render('add-image.ejs', {
            message: 'La fecha no puede ser posterior a hoy.'
        });
    }

    if (parsedDate < minDate) { // Verificamos que la fecha no sea anterior al 1 de enero de 1900
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

    // Extraemos los colores de la imagen y la guardamos 
    const getColors = require('get-image-colors'); // Importamos la librería para extraer colores
    const axios = require('axios'); // Para descargar la imagen desde la URL
    const tempPath = path.join(__dirname, '../tmp'); // Ruta al directorio temporal para almacenar imágenes descargadas
    fs.ensureDirSync(tempPath);

    // Intentamos descargar la imagen y analizar el color
    const fileName = `temp-${Date.now()}.jpg`; // Nombre único para la imagen temporal
    const filePath = path.join(tempPath, fileName); // Ruta completa del archivo temporal

    try {
        console.log('Descargando imagen desde:', url);

        const response = await axios({
            method: 'GET',
            url,
            responseType: 'arraybuffer'
        });

        console.log('Imagen descargada. Guardando temporalmente...');
        await fs.writeFile(filePath, response.data);

        console.log('Analizando colores...');
        const colors = await getColors(filePath);
        const hexColors = colors.slice(0, 3).map(c => c.hex());
        console.log('Colores:', hexColors);

        // Generaramos la descripción desde el título de la imagen
        const { generarDescripcionDesdeTexto } = require('../utils/gemini');
        const descripcion = await generarDescripcionDesdeTexto(title);
        console.log('Descripción:', descripcion);

        // Borramos imagen de archivo temporal
        await fs.remove(filePath);
        console.log('Imagen temporal eliminada');

        // Guardamos datos en un archivo JSON
        const newImage = { title, url, date, colors: hexColors, description: descripcion };
        images.push(newImage);
        await fs.writeJson(dataPath, images, { spaces: 2 });

        res.render('add-image.ejs', {
            message: 'La imagen se ha añadido correctamente.',
            description: descripcion
        });


    } catch (error) {
        console.error('Error:', error.message);
        console.error(error); // Gestion de errores

        res.render('add-image.ejs', {
            message: 'La imagen fue añadida, pero no se pudo procesar correctamente.',
            description: ''

        });
    }


});
// Middleware para manejar errores 404
router.use((req, res) => {
    res.status(404).render('404.ejs', { message: 'La página o recurso que buscas no existe o ha sido movido.' });
});

module.exports = router;

