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
    res.render('add-image.ejs', { message: undefined }); // Renderiza formulario vacío
});

router.post('/new-image', async (req, res) => {
    const { title, url, date } = req.body;
    console.log('Datos recibidos:', req.body);

    // Validar título: solo letras, números, espacios y guión bajo
    const titleRegex = /^[A-Za-z0-9_ ]{1,30}$/; // Expresión regular para validar el título
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

    if (parsedDate > today) { // Verifica que la fecha no sea posterior a hoy
        return res.render('add-image.ejs', {
            message: 'La fecha no puede ser posterior a hoy.'
        });
    }

    if (parsedDate < minDate) { // Verifica que la fecha no sea anterior al 1 de enero de 1900
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
            responseType: 'arraybuffer' // Para manejar la imagen como un buffer
        });

        console.log('📦 Imagen descargada. Guardando temporalmente...');

        await fs.writeFile(filePath, response.data); // Guardar la imagen en el directorio temporal

        console.log('🎨 Analizando colores con get-image-colors...');

        const colors = await getColors(filePath);
        // Extraemos los primeros 3 colores en HEX
        const hexColors = colors.slice(0, 3).map(c => c.hex());

        console.log('✅ Colores extraídos:', hexColors);

        await fs.remove(filePath); // Eliminar el archivo temporal después de extraer el color
        console.log('🧹 Imagen temporal eliminada');

        // Guardamos la nueva imagen con sus datos
        const newImage = { title, url, date, colors: hexColors };
        images.push(newImage); // Añadimos la nueva imagen al array en memoria
        console.log('💾 Imagen añadida al array:', newImage);

        await fs.writeJson(dataPath, images, { spaces: 2 }); // Guardamos el array actualizado en el archivo JSON
        console.log('📁 Imagen guardada en images.json');

        res.render('add-image.ejs', {
            message: 'La imagen se ha añadido correctamente.',
        });

    } catch (error) {
        console.error('Error al analizar color:', error.message);
        console.error(error.stack);

        res.render('add-image.ejs', {
            message: 'La imagen fue añadida, pero no se pude extraer el color.'
        });
    }
});
// Middleware para manejar errores 404
router.use((req, res) => {
    res.status(404).render('404.ejs', { message: 'La página o recurso que buscas no existe o ha sido movido.' });
});

module.exports = router;

