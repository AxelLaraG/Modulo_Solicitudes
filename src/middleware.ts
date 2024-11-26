import { NextResponse } from "next/server";

export function middleware(req) {
  if (req.nextUrl.pathname === "/alert") {
    return NextResponse.redirect("/"); // Redirige a la página principal
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/alert",
};
