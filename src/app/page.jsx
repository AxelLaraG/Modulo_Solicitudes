
import Link from "next/link";
import Formulario from "../app/formulario/page";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import dbConnect from "../libs/mongodb";
import solicitud from "../models/solicitud";
import Login from "../components/Login";

export default function HomePage() {
  return (
    <>
      <Login/>
    </>
  );
}
