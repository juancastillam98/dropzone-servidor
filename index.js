import express from 'express';//recuerda, para poder usar el import, se ha tenido que añadir   "type": "module", al package.json
//sin el type module sería const express = require("express");
import {conectarDb} from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

import usuariosRoutes from "./routes/usuariosRoutes.js"
import authUsuarioRoutes from "./routes/authUsuarioRoutes.js"
import enlaces from "./routes/enlaces.js";
import archivosRoutes from "./routes/archivosRoutes.js";

//crear el serviddor
const app = express();
//ahora vamos agregando cors, puertos, rutas

//conectar a la bd
dotenv.config();//sin esto, no podrá leer las variables de entorno
app.use(express.json());//Para poder leer los datos en consola del servidor vía json
conectarDb();

app.use(cors({
    origin: process.env.FRONTEND_URL, // ajusta el origen según tu configuración de Next.js
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

//Puerto de la app
const port = process.env.PORT || 4000;

//Habilitar carpeta pública
app.use(express.static("uploads"))

//Rutas
app.use("/api/usuarios", usuariosRoutes)
app.use("/api/auth", authUsuarioRoutes)
app.use("/api/enlaces", enlaces)
app.use("/api/archivos", archivosRoutes)

//Arrancar la app
app.listen(port, "0.0.0.0", ()=>{
    console.log(`El servidor está corriendo en el puerto  ${port}`);
});