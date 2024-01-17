import Usuario from "../models/Usuario.js"
import {validationResult} from "express-validator";
import Enlaces from "../models/Enlace.js";

const nuevoUsuario = async (request, response) => {

    //mostrar los mensajes de error de express validator
    const errores = validationResult(request)
    if (!errores.isEmpty()){
        return response.status(400).json({errores: errores.array()})
    }

    //Verificar si el usuario ya estuvo registrado.
    const {email, password}=request.body;
    let usuario= await Usuario.findOne({email});
    if (usuario){
        return response.status(400).json({msg: 'El usuario ya existe'})
    }

    usuario = new Usuario(request.body)
    try {
        await usuario.save();
        response.json({msg: "Usuario creado correctamente"})
    }catch (error) {
        console.error(error)
    }
}

export {nuevoUsuario}