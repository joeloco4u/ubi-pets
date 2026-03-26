"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ user_metadata?: { full_name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    };
    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#FF6B35" }}></div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || "Usuario";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#FF6B35" }}>
        Dashboard - Ubi Pets
      </h1>
      <p className="text-xl mb-8">Bienvenido, {userName}</p>
      <button
        onClick={handleLogout}
        className="px-8 py-4 text-white font-semibold rounded-lg text-lg"
        style={{ backgroundColor: "#FF6B35" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}