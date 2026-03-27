"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";

export function LogoutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Cerrar Sesión
    </Button>
  );
}