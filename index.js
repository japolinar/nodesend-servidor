const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//Conectar a la BBDD de Mongo
conectarDB();

//Habilitar el cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(opcionesCors) );

// Puerto de la APP
const port = process.env.PORT || 4000;

//Habilitar leer los valores de un body
app.use(express.json());

//Habilitar la carpeta publica
app.use( express.static('uploads'));

//Rutas de la App
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//Arrancar el servidor
app.listen(port, '0.0.0.0', () =>{
    console.log(`El puerto esta funcionando en el puerto ${port}`);
});
