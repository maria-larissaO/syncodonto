import { NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/supabase/api-helper"

export async function GET(request: Request) {
  const result = await getAuthenticatedClient()
  if ("error" in result && result.error) return result.error as any
  const { supabase, user } = result as any

  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get("patient_id")

  let query = supabase
    .from("dental_chart_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (patientId) query = query.eq("patient_id", patientId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const result = await getAuthenticatedClient()
  if ("error" in result && result.error) return result.error as any
  const { supabase, user } = result as any

  const body = await request.json()
  const { data, error } = await supabase
    .from("dental_chart_snapshots")
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
