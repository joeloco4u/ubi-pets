import { createServerClient } from "@supabase/ssr";
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
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#FF6B35" }}>
        Dashboard - Ubi Pets
      </h1>
      <p className="text-xl mb-8">Bienvenido, {userName}</p>
    </div>
  );
}