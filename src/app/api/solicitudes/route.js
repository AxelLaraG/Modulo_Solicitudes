import dbConnect from "@/libs/mongodb";
import solicitud from "@/models/solicitud";
import { NextResponse } from "next/server";

export async function GET(){
    await dbConnect()

    const solicitudes = await solicitud.find()
    return NextResponse.json(solicitudes)
}

export async function POST(req){
    await dbConnect()

    const data = await req.json()
    const solicitudes = await solicitud.create(data)
    return NextResponse.json(solicitudes)
}