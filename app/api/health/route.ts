import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
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
