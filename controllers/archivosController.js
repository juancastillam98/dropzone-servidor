import short from 'short-uuid';
import multer from 'multer';
import fs from 'fs';
import Enlaces from "../models/Enlace.js";

//es una librería de express llamada filesystem, para crear o eliiminar archivos
const subirArchivo = async (request, response, next)=>{

    const configuracionMulter = {
        limits: { fileSize: request.usuario ? 1024*1024*10 : 1024*1024 }, // 10MB ó 1MB
        storage: multer.diskStorage({
            destination: (request, file, callback) => {
                callback(null, "./uploads");
            },
            filename: (request, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);
                callback(null, `${short.generate()}${extension}`);
            },

        })
    };

    const upload = multer(configuracionMulter).single("archivo")

    //console.log(request.file) se genera un request llamado file
    upload(request, response, async (error) =>{
        if (!error){
            response.json({archivo: request.file.filename})//esto se le enseña al usuario
        }else{
            console.log(error)
            return next()
        }
    });
}
const eliminarArchivo = async (request, response)=>{
    console.log(request.archivoDescargar)//obtengo el nombre del archivo (que le en realidad es el nombre del enlace)
    try {
        fs.unlinkSync(`./uploads/${request.archivoDescargar}`);
    }catch(error){
        console.error("Hubo un error")
    }
}

const descargarArchivo = async (request, response, next) => {

    //obtener el enlace a partir del archivo
    const enlace = await Enlaces.findOne({nombre: request.params.archivo})

    const archivoDescarga = "./uploads/"+request.params.archivo;
    response.download(archivoDescarga)

    //Eliminar el archivo y la entra a ala bd.
    //Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
    const {descargas, nombre}=enlace;
    if (descargas === 1) {
        //Eliminar archivo
        request.archivoDescarga = nombre; //creamos un nuevo campo llamado archivo, que es el nombre del enlace
        next()//pasa al siguiente -> en el routing tenemos ("/:url", obtenerEnlace, eliminarArchivo), es decir el siguiente eliminarArchivo
        await Enlaces.findOneAndDelete(enlace.id)//Eliminar la entrada de la bd
        next();
    }else{
        //Si las descargas son > a 1 - Restar 1
        enlace.descargas--;
        await enlace.save();

    }

}
export {subirArchivo, eliminarArchivo, descargarArchivo}