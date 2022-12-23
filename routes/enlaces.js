const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesCotroller');
const archivosController = require('../controllers/archivosController');
const { check } = require('express-validator');
const auth = require('../middleware/auth')


router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    enlacesController.nuevoEnlance
);

router.get('/',
    enlacesController.todosEnalaces
);

router.get('/:url',
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace    
)

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
)

module.exports = router;


