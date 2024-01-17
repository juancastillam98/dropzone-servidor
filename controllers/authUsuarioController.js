import Usuario from "../models/Usuario.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";
import usuario from "../models/Usuario.js";

const autenticarUsuario = async (request, response, next) => {
    //Comprobar si hay errores
    const errores = validationResult(request)
    if (!errores.isEmpty()){
        return response.status(400).json({errores: errores.array()})
    }

    //Buscar el usuario para ver si está autenticado
    const {email, password}=request.body
    const usuario = await Usuario.findOne({email})

    if (!usuario) {
        response.status(401).json({msg: "El usuario no existe"})
        return next()//next para que pase al siguiente middleware. Si bien estamos cortando el flujo, queremos que pase al siguient paso.
    }
    //Verificar el password y autenticar el usuario. usamos compareSync porque la función es asíncrona
    if (bcrypt.compareSync(password, usuario.password)){
        //Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
        }, process.env.SECRETA,{
            expiresIn: "8h"
        })
        response.json({token: token})
    }else{
        response.status(401).json({msg: "El password es incorrecto"})    }

}
const usuarioAutenticado = async (request, response, next) => {
    response.json({usuario: request.usuario})
}
export {autenticarUsuario, usuarioAutenticado}