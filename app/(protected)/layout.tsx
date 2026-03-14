"use client";

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6" />
            <span className="font-bold text-xl">Ubi Pets</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/pets">Mis Mascotas</a>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}