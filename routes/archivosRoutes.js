import express from "express";
const router = express.Router();
import {subirArchivo, descargarArchivo, eliminarArchivo} from "../controllers/archivosController.js";
import {checkAuth} from "../middleware/checkAuth.js";

router.post("/",
    checkAuth,
    subirArchivo)
router.get("/:archivo", descargarArchivo, eliminarArchivo)
 export default router;