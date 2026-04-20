import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM thinking_notes ORDER BY created_at DESC`
    return Response.json({ success: true, data: rows })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
