import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

export async function GET() {
  if (!DATABASE_URL) {
    return Response.json({ success: false, error: 'DATABASE_URL not configured' }, { status: 500 })
  }

  try {
    const sql = neon(DATABASE_URL)
    const rows = await sql`SELECT * FROM thinking_notes ORDER BY created_at DESC`
    return Response.json({ success: true, data: rows })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
