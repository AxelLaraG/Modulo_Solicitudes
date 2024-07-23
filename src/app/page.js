import dbConnect from "@/libs/mongodb";
import solicitud from "@/models/solicitud";

async function loadSolicitudes(){
  await dbConnect()
  const solicitudes = await solicitud.find()
  return solicitudes
}

async function HomePage(){
  const solicitudes = await loadSolicitudes();
  console.log(solicitudes);
  return (
    <div>
      Hello World
    </div>
  )
}

export default HomePage;