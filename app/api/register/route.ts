import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, fullName, phone } = await request.json();

  const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error } = await supabaseAnon.auth.signUp({
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

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: user.id,
    full_name: fullName,
    phone: phone || null,
  });

  if (profileError) {
    return NextResponse.json({ 
      error: profileError.message, 
      code: profileError.code,
      details: profileError.details,
      hint: profileError.hint 
    }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}