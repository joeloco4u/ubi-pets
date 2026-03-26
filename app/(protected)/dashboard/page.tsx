import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { cookies } from "next/headers";

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

export default async function DashboardPage() {
  const user = await getUser();
  const userName = user?.user_metadata?.full_name || "Usuario";

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity cursor-pointer">
        <PawPrint className="h-8 w-8" style={{ color: "#FF6B35" }} />
        <span className="font-bold text-xl">Ubi Pets</span>
      </Link>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#FF6B35" }}>
        Dashboard
      </h1>
      <p className="text-xl mb-8">Bienvenido, {userName}</p>
    </div>
  );
}