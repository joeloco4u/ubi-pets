"use client";

import { useState } from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, phone }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = "/login?registered=true";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    await register(formData);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A2540" }}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <PawPrint className="h-10 w-10" style={{ color: "#FF6B35" }} />
            <span className="font-bold text-2xl" style={{ color: "#0A2540" }}>Ubi Pets</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6" style={{ color: "#0A2540" }}>
            Crear cuenta
          </h1>
          <p className="text-gray-500 mt-2">Únete a Ubi Pets</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              name="fullName"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:border-[#FF6B35]"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:border-[#FF6B35]"
              placeholder="+34 612 345 678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:border-[#FF6B35]"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:border-[#FF6B35]"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#FF6B35" }}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#FF6B35" }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}