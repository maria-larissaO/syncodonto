import { getAuthenticatedClient } from "@/lib/supabase/api-helper"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const result = await getAuthenticatedClient()
  if ("error" in result && result.error) return result.error
  const { supabase, user } = result as any

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const status = searchParams.get("status")
  const patientId = searchParams.get("patientId")

  let query = supabase
    .from("appointments")
    .select(`*, patient:patients(id, full_name, phone, email)`)
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .order("time", { ascending: true })

  if (date) {
    query = query.eq("date", date)
  }

  if (startDate && endDate) {
    query = query.gte("date", startDate).lte("date", endDate)
  }

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (patientId) {
    query = query.eq("patient_id", patientId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const result = await getAuthenticatedClient()
  if ("error" in result && result.error) return result.error
  const { supabase, user } = result as any

  const body = await request.json()

  const { data, error } = await supabase
    .from("appointments")
    .insert({ ...body, user_id: user.id })
    .select(`*, patient:patients(id, full_name, phone, email)`)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
