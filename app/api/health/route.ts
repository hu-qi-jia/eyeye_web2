import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

export async function GET() {
  if (!DATABASE_URL) {
    return Response.json({ 
      success: false, 
      error: 'DATABASE_URL environment variable is not configured'
    }, { status: 500 })
  }

  try {
    const sql = neon(DATABASE_URL)
    const result = await sql`SELECT NOW() as current_time`
    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      data: result[0]
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return Response.json({ 
      success: false, 
      error: 'Database connection failed',
      details: String(error)
    }, { status: 500 })
  }
}
