const Enlaces = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlance = async (req, res, next) =>{
    //Revisar si hay error
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores: errores.array()
        });
    }

    //Creando un objeto
    //console.log(req.body);
    const {nombre_original, nombre} = req.body

    const enlace = new Enlaces;
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    //Si el usuario esta autenticado
    if(req.usuario){
        const { password, descargas} = req.body

        //Asignar a enlace el numero de descargas
        if(descargas){
            enlace.descargas = descargas
        }

        //asignar un password
        if(password){
            const salt = await bcrypt.genSalt(10)
            enlace.password = await bcrypt.hash(password, salt)
        }

        //Asignar el autor
        enlace.autor = req.usuario.id
    }

    //Alamcenar en la BD
    try {
        await enlace.save();
        res.json({
            msg: `${enlace.url}`
        });
        return next();
    } catch (error) {
        console.log(error);
    }

}

//Obtiene un listado de todos los enlaces
exports.todosEnalaces = async (req, res, next) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id')
        //console.log(enlaces);
        res.json({enlaces})

    } catch (error) {
        console.log(error);
    }
}

//Validar el password
exports.tienePassword = async (req, res, next)=>{
    //verificar si existe el enlace
    const {url} = req.params
    //console.log(url);

    const enlace = await Enlaces.findOne({url})
    //console.log(enlace);

    //En caso que no exista
    if(!enlace){
        res.status(400).json({
            msg: 'El enlance no existe'
        });
        return next();
    }

    if(enlace.password){
        return res.json({
            password: true,
            enlace: enlace.url,
            archivo: enlace.nombre //Importante esta linea se colocar para traer el nombre del archivo
        });
    }

    next();
}

//verifica si el password es correcto
exports.verificarPassword = async (req, res, next) =>{
    //console.log(req.params);
    //console.log(req.body);    
    const {url} = req.params;
    const {password} = req.body 

    //Consultar por el enlace
    const enlace = await Enlaces.findOne({url});
    //console.log(enlace);

    //Validar el password
    if(bcrypt.compareSync( password, enlace.password)){
        //Permite al uasuario descargar el enlace           
        next();
    }else{
        return res.status(401).json({msg: 'Password Incorrecto'})
    }


}

//Obtener el enlace
exports.obtenerEnlace = async (req, res, next) =>{
    //console.log(req.params.url);

    //verificar si existe el enlace
    const {url} = req.params
    const enlace = await Enlaces.findOne({url})
    //console.log(enlace);

    //En caso que no exista
    if(!enlace){
        res.status(404).json({
            msg: 'El enlance no existe'
        });
        return next();
    }

    //En caso que si exista
    res.json({
        archivo: enlace.nombre, 
        password: false
    })

    next(); 

}

