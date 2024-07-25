
import Link from "next/link";
import Principal from "../components/Principal";
import Formulario from "../app/formulario/page";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import dbConnect from "../libs/mongodb";
import solicitud from "../models/solicitud";

export default function HomePage() {
  return (
    <>
      <Principal/>
    </>
  );
}
