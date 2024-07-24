import dbConnect from "@/libs/mongodb";
import solicitud from "@/models/solicitud";

async function loadSolicitudes(){
  await dbConnect()

  const solicitudes = await solicitud.find()
  return solicitudes
}

async function HomePage() {
  const solicitudes = await loadSolicitudes()
  console.log(solicitudes)
  return <h1>HolaMundo</h1>
}

export default HomePage