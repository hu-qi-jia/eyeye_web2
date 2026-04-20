import { sql } from '@vercel/postgres'

export async function POST(request: Request) {
  try {
    const { title, content, category, medium } = await request.json()

    if (!title || !content || !category || !medium) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { rows } = await sql`
      INSERT INTO thinking_notes (title, content, category, medium)
      VALUES (${title}, ${content}, ${category}, ${medium})
      RETURNING *
    `

    return Response.json({ success: true, data: rows[0] })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
