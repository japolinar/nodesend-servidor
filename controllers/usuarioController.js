const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
//bcrypt es la libreria para Hashear los password
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async (req, res) => {
    //console.log(req.body);

    //Mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores: errores.array()
        });
    }

    //Verificar si el usuario ya estuvo registrado
    const {email, password} = req.body;

    let usuario = await Usuario.findOne({ email })
    //console.log(usuario);

    //validar si el usuario existe
    if(usuario){
        return res.status(400).json({
            msg: 'El Usuario ya esta Registrado'
        })
    } 

    //crear un nuevo usuario
    usuario = new Usuario(req.body)
    //console.log(usuario);

    //Hashear el password
    const salt = await bcrypt.genSalt(10); //10 es buen numero para hashear
    usuario.password = await bcrypt.hash(password, salt);

    try {        
        await usuario.save();    
        //console.log(usuario);
    
        res.json({
            msg: 'Usuario creado correctamente'
        });
    } catch (error) {
        console.log(error);
    }

}