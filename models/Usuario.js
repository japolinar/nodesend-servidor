const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//el trim va a eliminar los espacios 
//el lowercase va colocar todo en minusculas 

const usuariosSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true 
    },
    nombre:{
        type: String,
        required: true,   
        trim: true 
    },
    password:{
        type: String,
        required: true,   
        trim: true 

    }  
})

module.exports = mongoose.model('Usuarios', usuariosSchema);


