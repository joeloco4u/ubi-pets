import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: { user }, error: signUpError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
        },
      },
    });

    if (signUpError || !user) {
      return NextResponse.json(
        { error: signUpError?.message || "Error al crear usuario" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      created_at: now,
      updated_at: now,
    });

    if (profileError) {
      return NextResponse.json(
        { 
          error: profileError.message,
          code: profileError.code,
          details: profileError.details
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}