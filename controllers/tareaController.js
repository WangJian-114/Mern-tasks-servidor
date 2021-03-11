const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    const errores = validationResult(req);

        if(!errores.isEmpty()){
            return res.status(400).json({ errores: errores.array() });
        }

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body; 
    

        const existepProyecto = await Proyecto.findById(proyecto);

        if(!existepProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
    
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}


// obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query; 
        const existepProyecto = await Proyecto.findById(proyecto);

        if(!existepProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas});
    

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }



}


// actualizar una tarea
exports.actualizarTarea = async (req, res) => {

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body; 
        
        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        // extraer proyecto
        const existepProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }


        // Crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findByIdAndUpdate({_id: req.params.id }, nuevaTarea, { new: true });

        res.json({tarea});
        


    


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}


// Eliminar tarea

exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query; 
        
        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        // extraer proyecto
        const existepProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existepProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }


        // Eliminar
        await Tarea.findByIdAndRemove({_id: req.params.id});
        res.json({ msg : 'Tarea Eliminada'});


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}