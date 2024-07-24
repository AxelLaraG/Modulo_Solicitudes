import mongoose from "mongoose";

const schema = new mongoose.Schema({
    responsable: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    solicitante: {
        type: String,
        required: true
    },
    estatus: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    asunto: {
        type: String,
        required: true
    },
    fechaVen: {
        type: Date
    }
})

export default mongoose.models.Solicitudes || mongoose.model('Solicitudes',schema)
