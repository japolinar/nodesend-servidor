const multer = require('multer');
const shortid= require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivos = async (req, res, next) => {

    const configuracionMulter = {
        limits : {fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) =>{
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) =>{
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }
    const upload = multer(configuracionMulter).single('archivo');
    
    upload(req, res, async (error) =>{
        //console.log(req.file);

        if(!error){
            res.json({
                archivo: req.file.filename
            });
        }else{
            console.log(error);
        }
        return next();
    });
}

exports.eliminarArchivos = async (req, res) => {
    //console.log(req.archivo);

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)        

    } catch (error) {
        console.log(error);
    }

}

//Descarga un archivos
exports.descargar = async (req, res, next) => {
    //console.log(req.params);
    
    //Obtener el enlace
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre: archivo});
    //console.log(enlace);

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);   
    
    //Emilinar el archivo y la entrada de la BBD
    // Si la descarga son iguales a 1 -Entonces borrar la entrada y borrar el archivo
    const {descargas, nombre} = enlace
    //console.log(enlace);    
 

    if(descargas === 1){   
        //Eliminar el archivo
        req.archivo = nombre

        //eliminar la entrada de la BD
        await Enlaces.findOneAndRemove(enlace.id);

        next();
        
    }else{
        // Si la descargas son > a 1 -Entonces restar 1       
        enlace.descargas--;
        await enlace.save();        
    }
}