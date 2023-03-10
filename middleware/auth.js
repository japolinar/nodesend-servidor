const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variable.env'});

module.exports = (req, res, next)=>{
    //console.log(req.get('Authorization'));

    const authHeader = req.get('Authorization')

    if(authHeader){
        //Obtener el Token
        const token = authHeader.split(' ')[1];
        //console.log(token);

        //Comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA)
            //console.log(usuario);
            req.usuario = usuario
            
        } catch (error) {
            console.log(error);
            console.log('JWT Invalido');
        }        
    }
    return next();
}