import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Crear una respuesta
  const response = NextResponse.next();

  // Agregar encabezados CORS
  response.headers.set("Access-Control-Allow-Origin", "*"); // Permite todos los orígenes
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Manejar solicitudes OPTIONS (preflight)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  // Devolver la respuesta con los encabezados CORS
  return response;
}

// Configurar el middleware para que se aplique a todas las rutas de la API
export const config = {
  matcher: "/api/:path*", // Aplica a todas las rutas bajo /api
};
