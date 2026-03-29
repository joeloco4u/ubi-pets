import Link from "next/link";
import { PawPrint, MapPin, QrCode } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A2540" }}>
      <header className="container mx-auto px-4 py-6 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <PawPrint className="h-8 w-8" style={{ color: "#FF6B35" }} />
          <span className="font-bold text-2xl text-white">Ubi Pets</span>
        </div>
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="px-3 py-2 text-white font-medium text-sm hover:opacity-80 transition-opacity"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="px-3 py-2 text-white font-semibold rounded-lg text-sm"
            style={{ backgroundColor: "#FF6B35" }}
          >
            Registrarse
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-screen-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-white mb-6 px-2">
            Protege a tu mascota con QR y geolocalización
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            La solución completa para mantener a tu mascota segura. Código QR único,
            ubicación en tiempo real y recuperación garantizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-white font-semibold rounded-lg text-lg"
              style={{ backgroundColor: "#FF6B35" }}
            >
              Registrarse
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-white font-semibold rounded-lg text-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <QrCode className="h-12 w-12 mx-auto mb-4" style={{ color: "#FF6B35" }} />
            <h3 className="text-xl font-semibold text-white mb-2">Código QR Único</h3>
            <p className="text-gray-300">
              Cada mascota tiene su propio código QR resistente al agua y durabilidad extrema.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4" style={{ color: "#FF6B35" }} />
            <h3 className="text-xl font-semibold text-white mb-2">Geolocalización</h3>
            <p className="text-gray-300">
              Rastrea la ubicación de tu mascota en tiempo real desde cualquier dispositivo.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
            <PawPrint className="h-12 w-12 mx-auto mb-4" style={{ color: "#FF6B35" }} />
            <h3 className="text-xl font-semibold text-white mb-2">Recuperación Garantizada</h3>
            <p className="text-gray-300">
              Sistema de alertas inmediatas cuando alguien escanea el código QR.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>© 2026 Ubi Pets. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}