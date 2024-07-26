import dbConnect from "../../../libs/mongodb";
import solicitud from "../../../models/solicitud";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const solicitudes = await solicitud.find();
  return NextResponse.json(solicitudes);
}

export async function POST(request) {
  await dbConnect();

  const formData = await request.json(); // Obtener los datos del cuerpo de la solicitud

  const fechaHoraServidor = new Date().toISOString();
  const newDocument = {
    responsable: formData.responsable,
    fecha: fechaHoraServidor, // Usar la fecha y hora del servidor
    solicitante: formData.solicitante,
    estatus: formData.estatus, // Valor por defecto si no se envía
    correo: formData.correo,
    telefono: formData.telefono,
    asunto: formData.asunto,
    fechaVen: formData.fechaVen,
  };

  const solicitudes = await solicitud.create(newDocument);
  return NextResponse.json(solicitudes);
}
