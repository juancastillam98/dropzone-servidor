import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;
const usuariosSchema = new Schema({
    email:{
        type: 'String',
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre:{
        type: 'String',
        required: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: 'String',
        required: true,
        trim: true
    }
})
usuariosSchema.pre("save", async function(next){
    if (!this.isModified("password")){//si ya está hasheada (ejem, al hacer login) me lo salto
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const Usuario = mongoose.model('Usuarios', usuariosSchema);
export default Usuario;
