const app = require('./app');  // Importa la aplicación Express desde app.js

const PORT = 3000;             // Define el puerto donde se ejecutará el servidor

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
