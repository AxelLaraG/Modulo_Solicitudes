import dbConnect from "../../../../libs/mongodb";
import solicitud from "../../../../models/solicitud";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();

  const solicitudEnc = await solicitud.findById(params.id);

  if (!solicitudEnc) {
    return NextResponse.json(
      { error: "Solicitud no encontrada" },
      { status: 404 }
    );
  }
  return NextResponse.json(solicitudEnc);
}

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const solicitudEliminada = await solicitud.findByIdAndDelete(params.id);
    if (!solicitudEliminada) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    // Manejo de errores en caso de que no se pueda analizar el cuerpo JSON
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const data = await request.json();

    const solicitudActualizada = await solicitud.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );
    return NextResponse.json(solicitudActualizada);
  } catch (error) {
    console.error(error);
  }
}
