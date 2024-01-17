import jwt from "jsonwebtoken";

export const checkAuth = (request, response, next) => {
    const authHeader = request.get("Authorization");
    if (authHeader) {
        //Obtener el token, descrifrarlo
        const token = authHeader.split(" ")[1]
        try {
            const usuario = jwt.verify(token,process.env.SECRETA)
            request.usuario = usuario;//request.usuario lo he creado yo. request es un objeto, y le añadido un campo llamado usuario
            console.log("desde auth")
        }catch (error) {
            console.log(error)
            console.log("JWT no válido")
        }
    }
    return next();
}