import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase nao esta configurado. Por favor, conecte a integracao do Supabase no painel lateral (Connect > Supabase).'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
