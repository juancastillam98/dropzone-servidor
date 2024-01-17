import express from "express";
const router = express.Router();
import {nuevoEnlace,
    obtenerEnlace,
    todosEnlaces,
    tienePassword,
    verificarPassword} from "../controllers/enlacesController.js";
import { check } from 'express-validator';
import {checkAuth} from "../middleware/checkAuth.js";

//estas validación son para inserción de datos en el servidor, no es validación o comprobación del fichero en sí.
router.post("/",
    [
        check("nombre", "Sube un archivo").not().isEmpty(),
        check("nombre_original", "Sube un archivo").not().isEmpty()
    ],
    checkAuth,
    nuevoEnlace
    )
router.get("/", todosEnlaces)
router.get("/:url",
    tienePassword,
    obtenerEnlace)//le pasamos 2 controladores

router.post("/:url", verificarPassword, obtenerEnlace)
export default router;