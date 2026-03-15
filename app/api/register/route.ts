import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, fullName, phone } = await request.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() { },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
      },
    },
  });

  if (error || !user) {
    return NextResponse.json({ error: error?.message || "Error al registrar" }, { status: 400 });
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    full_name: fullName,
    phone: phone || null,
  });

  if (profileError) {
    return NextResponse.json({ error: "Usuario creado pero error al crear perfil" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}