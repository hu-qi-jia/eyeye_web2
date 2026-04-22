import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

export async function POST(request: Request) {
  if (!DATABASE_URL) {
    return Response.json({ success: false, error: 'DATABASE_URL not configured' }, { status: 500 })
  }

  try {
    const sql = neon(DATABASE_URL)
    const { title, content, category, medium } = await request.json()

    if (!title || !content || !category || !medium) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const rows = await sql`
      INSERT INTO thinking_notes (title, content, category, medium)
      VALUES (${title}, ${content}, ${category}, ${medium})
      RETURNING *
    `

    return Response.json({ success: true, data: rows[0] })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
