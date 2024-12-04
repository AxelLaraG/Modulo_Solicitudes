import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token"); // Obtiene el token desde las cookies

  const protectedRoutes = ["/alert", "/Principal", "/formulario"];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl); // Redirige al login si no hay token
  }

  return NextResponse.next();
}

// Configuración para aplicar el middleware a las rutas protegidas
export const config = {
  matcher: ["/alert", "/Principal", "/formulario"], // Define las rutas protegidas
};
