import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function getAuthenticatedClient() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      // Handle stale/expired sessions gracefully
      if (authError.message?.includes("session_not_found") || authError.status === 403) {
        await supabase.auth.signOut()
      }
      return { error: NextResponse.json({ error: "Sessao expirada. Faca login novamente." }, { status: 401 }) }
    }

    if (!user) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }

    return { supabase, user }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error"
    if (message.includes("Supabase nao esta configurado")) {
      return { error: NextResponse.json({ error: "Supabase nao esta configurado. Conecte a integracao no painel lateral." }, { status: 503 }) }
    }
    return { error: NextResponse.json({ error: message }, { status: 500 }) }
  }
}
