import mongoose from "mongoose";

const schema = new mongoose.Schema({
    responsable: {
        type: [String],
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
    procedencia:{
        type: String,
        required: true
    },
    estatus: {
        type: String,
        required: true
    },
    correo: {
        type: String
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
    },
    delegacion: {
        type: String,
        required: true
    }
})

//Little change

export default mongoose.models.Solicitudes || mongoose.model('Solicitudes',schema)