const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

router.post('/',
    [
        check('nombre', 'El nombre es Obligarorio').not().isEmpty(),        
        check('email', 'Agrega un Email valido').isEmail(),
        check('password', 'El password debe ser al menos de 6 caractares').isLength({min: 6})
    ],
    usuarioController.nuevoUsuario
);

module.exports = router;