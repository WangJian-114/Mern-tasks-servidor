// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tareaController = require('../controllers/tareaController');
const { check } = require('express-validator'); // hay que instalarlo primero



// crear una tarea
// api/tareas
router.post('/',
        auth,
        [
            check('nombre','El nombre de la tarea es obligatorio').not().isEmpty(),
            check('proyecto','El proyecto es obligatorio').not().isEmpty()
        ],
        tareaController.crearTarea
);

// obtener tarea por proyecto
router.get('/',
        auth,
        tareaController.obtenerTareas
);

// actualizar la tarea
router.put('/:id',
        auth,
        tareaController.actualizarTarea

);

// Eliminar una tarea
router.delete('/:id',
            auth,
            tareaController.eliminarTarea

);



module.exports = router;