import Enlace from "../models/Enlace.js";
import short from 'short-uuid';
import bcrypt from "bcrypt";
import {validationResult} from "express-validator";
import Enlaces from "../models/Enlace.js";
const nuevoEnlace = async (request, response, next)=>{
    //Revisar si hay errors
   const errores = validationResult(request);//Recuerda, validationResult es una función propia de Express para validar errores
   if (!errores.isEmpty()){
      return response.status(400).json({errores: errores.array()})
   }

    //Almacenar enlaces en la bd
   const {nombre_original, nombre}=request.body;
   const enlace = new Enlace();
   enlace.url=short.generate();
   enlace.nombre = nombre;
   enlace.nombre_original = nombre_original;

   //Si el usuario está autenticado
   if (request.usuario){//solo va a existir el request.usuario si se ha autenticado
      const {password, descargas} = request.body
      //Asignar a enlace el número de descargas
      if (descargas){
         enlace.descargas = descargas//El número de descargas y el será la que le pasemos en el body
      }
      //Asignar un password
      if (password){
         const salt = await bcrypt.genSalt(10);
         enlace.password = await bcrypt.hash(password, salt);
      }
      //Asignar el autor
      enlace.autor=request.usuario.id
   }
   //Si no está autenticado, por default el nº de descargas será 1 y la contraseña null

   try {
      await  enlace.save();
      response.json({msg: `${enlace.url}`})
      return next();
   }catch (error){
      console.error(error)
   }
};

const tienePassword = async (request, response, next) => {
   try {
      const enlace = await Enlaces.findOne({url: request.params.url});
      if (!enlace) {
         response.status(404).json({msg: "Este enlace no existe"});
         return next();
      }

      if (enlace.password) {
         return response.json({password: true, enlace: enlace.url});
      }

      next();
   } catch (error) {
      console.error(error);
      response.status(500).json({msg: "Error interno del servidor"});
   }
}

//Verificar el password
const verificarPassword = async (request, response, next) => {
   const {url}=request.params;
   const {password}=request.body;
   //obtener el enlce
   const enlace = await Enlaces.findOne({url});
   //Verificar el password
   if (bcrypt.compareSync(password, enlace.password)){
      next(); //pasamos al siguiente middleware que es el de obtenerEnlace
   }else{
      return response.status(401).json({msg: "Password incorrecto"})
   }

}

//Obtener el enlace. Este es el enlace que le pasaremos al usuario para compartir el archivo.
//Además hay que hacer que cuando se descargue un archivo, se elimine por completo de internet

const obtenerEnlace = async (request, response, next) => {
   //Verificar si existe el enlace
   const enlace = await Enlaces.findOne({url: request.params.url})//obtengo el enlace a través de la url
   if (!enlace){
      response.status(404).json({msg: "Este enlace no existe"})
      return next();
   }
   //Si el enlace existe
   response.json({archivo: enlace.nombre, password: false})
   next() ;
}

const todosEnlaces = async (request, response) => {
   try {
      const enlaces = await Enlaces.find({}).select("url -_id")
      response.json({enlaces})
   }catch (error) {
      console.log(error.message)
   }
}


export {nuevoEnlace, obtenerEnlace, todosEnlaces, tienePassword, verificarPassword}