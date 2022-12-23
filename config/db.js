const mongoose = require("mongoose");

require('dotenv').config({
    path: 'variable.env'
});

const conectarDB = async () =>{

    try {
        await mongoose.connect( process.env.DB_URL, {
            useNewUrlParser : true,
            useUnifiedTopology: true
        });

        console.log('BBDD de Mongo Conectada');

    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarDB;