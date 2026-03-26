"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-browser";

export function LogoutButton() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Cerrar Sesión
    </Button>
  );
}