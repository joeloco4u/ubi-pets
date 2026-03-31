import Link from "next/link";
import { PawPrint, MapPin, QrCode, Heart, Shield, Clock } from "lucide-react";

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
            ubicación en tiempo real y recuperación en tiempo real.
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
              Cada mascota tiene su propio código QR resistente al agua y alta durabilidad.
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
            <h3 className="text-xl font-semibold text-white mb-2">Regreso Seguro</h3>
            <p className="text-gray-300">
              Sistema de alertas inmediatas cuando alguien escanea el código QR.
            </p>
          </div>
        </div>
      </main>

      <section className="py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto px-4 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#0A2540" }}>
            Bienvenidos
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#4A5568" }}>
            En Ubi Pets creemos que cada mascota merece una segunda oportunidad 
            para volver a casa. Por eso hemos creado una plataforma innovadora 
            que combina tecnología QR avanzada con geolocalización en tiempo real, 
            para que nunca pierdas de vista a tu compañero fiel.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F7FAFC" }}>
        <div className="container mx-auto px-4 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#0A2540" }}>
            Quiénes Somos
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#4A5568" }}>
            Somos un equipo de amantes de los animales comprometidos con la seguridad 
            y bienestar de las mascotas. Desarrollamos Ubi Pets para resolver un problema 
            que afecta a millones de familias: la pérdida de sus compañeros peludos. 
            Nuestra misión es简单: conectar a las mascotas con sus dueños mediante 
            tecnología accesible y confiable.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: "#0A2540" }}>
            ¿Por qué elegir Ubipets?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FF6B35" }}>
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#0A2540" }}>Información sin límites</h3>
              <p className="text-gray-600" style={{ color: "#4A5568" }}>
                Toda la información de tu mascota siempre disponible. 
                Salud, vacunas, contactos de emergencia y más.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FF6B35" }}>
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#0A2540" }}>Geolocalización instantánea</h3>
              <p className="text-gray-600" style={{ color: "#4A5568" }}>
                Know exactly where your pet is at all times with real-time tracking.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FF6B35" }}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#0A2540" }}>Actualización en tiempo real</h3>
              <p className="text-gray-600" style={{ color: "#4A5568" }}>
                Mantén los datos de tu mascota siempre actualizados al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#0A2540" }}>
        <div className="container mx-auto px-4 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Nuestra Filosofía
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 mb-8">
            Porque sabemos que su curiosidad no tiene límites, pero tu amor por ellos tampoco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-white font-semibold rounded-lg text-lg"
              style={{ backgroundColor: "#FF6B35" }}
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>© 2026 Ubi Pets. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
