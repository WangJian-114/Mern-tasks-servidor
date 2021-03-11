const Usuario = require('../models/Usuario');
const bcrypts = require('bcryptjs');
const { validationResult } = require('express-validator'); // el resultado de la validacion en la ruta pasa aca
// importar json web token
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

       // Revisar si hay errores con el resultado de express-validator, devuelve un arreglo
       const errores = validationResult(req);
       if(!errores.isEmpty()){
           return res.status(400).json({ errores: errores.array() });
       }

       // extraer el email y password
       const { email , password } = req.body;
       

       try {
           // revisar que sea un usuario registrado
            let usuario = await Usuario.findOne({ email });
            if(!usuario){
                return res.status(400).json({msg: 'El usuario no existe'});
            }

            // Revisar el password
            const passCorrecto = await bcrypts.compare(password, usuario.password);
            if(!passCorrecto){
                return res.status(400).json({msg:'Password incorrecto'});

            }

            // Si todos es correcto Crear y Firmar el JWT 
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
       }
   

}


// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}