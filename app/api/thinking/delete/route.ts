import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

export async function DELETE(request: Request) {
  if (!DATABASE_URL) {
    return Response.json({ success: false, error: 'DATABASE_URL not configured' }, { status: 500 })
  }

  try {
    const sql = neon(DATABASE_URL)
    const { id } = await request.json()

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing id' },
        { status: 400 }
      )
    }

    await sql`DELETE FROM thinking_notes WHERE id = ${id}`

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
