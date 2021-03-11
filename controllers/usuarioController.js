const Usuario = require('../models/Usuario');
const bcrypts = require('bcryptjs');
const { validationResult } = require('express-validator'); // el resultado de la validacion en la ruta pasa aca
// importar json web token
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores con el resultado de express-validator, devuelve un arreglo
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer email y password
    const { email, password } = req.body;
    try {
        // Revisar que le usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({
                msg: 'El usuario ya existe'
            })
        }

        // crea el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcrypts.genSalt(10);
        usuario.password = await bcrypts.hash(password, salt);

        // guardar
        await usuario.save();

        /** Crear y Firmar el JWT */
        const payload = {
            usuario: {
                id: usuario._id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            res.json({ token: token })

        });



        

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}