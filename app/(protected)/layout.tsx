import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

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
            <form action="/auth/signout" method="post">
              <Button variant="outline" type="submit">
                Cerrar Sesión
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}