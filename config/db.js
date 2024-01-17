import mongoose from "mongoose";

export const conectarDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        const url = `${connection.connection.host}: ${connection.connection.port}`//opcional
        console.log(`MongoDB Conectado en: ${url}`)
    }catch(error) {
        console.error("Hubo un error")
        console.error(error);
        process.exit(1);
    }
}
