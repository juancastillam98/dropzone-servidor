import express from "express";
const router = express.Router();
import {autenticarUsuario, usuarioAutenticado} from "../controllers/authUsuarioController.js";
import { check } from 'express-validator';
import {checkAuth} from "../middleware/checkAuth.js";

router.post("/",
    [
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password no puede ir vacío").not().isEmpty()
    ],
    autenticarUsuario)//para hacer el login
router.get("/", checkAuth, usuarioAutenticado)//obtener información del usuario logueado
export default router;