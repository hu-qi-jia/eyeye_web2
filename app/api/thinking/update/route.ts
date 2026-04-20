import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request) {
  try {
    const { id, title, content, category, medium } = await request.json()

    if (!id || !title || !content || !category || !medium) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const rows = await sql`
      UPDATE thinking_notes
      SET title = ${title}, content = ${content}, category = ${category}, medium = ${medium}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return Response.json({ success: true, data: rows[0] })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
