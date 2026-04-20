import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS thinking_notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        medium VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const result = await sql`SELECT COUNT(*) as count FROM thinking_notes`
    const count = Number(result[0].count)

    if (count === 0) {
      await sql`
        INSERT INTO thinking_notes (title, content, category, medium) VALUES
        ('从0到1的产品设计流程', '探索产品设计的核心方法论，从需求分析到原型迭代的完整流程分享。', '产品思考', 'Product'),
        ('用户研究的本质', '深入理解用户研究不是为了验证想法，而是为了发现未知。', '产品思考', 'Product'),
        ('MVP设计的陷阱', '最小可行产品不是最简陋的产品，而是最核心的产品。', '产品思考', 'Product'),
        ('React Server Components 实践', 'RSC 不仅是技术升级，更是思维方式的重塑。', 'CODING手记', 'Tech Notes'),
        ('动画库性能优化', '如何让页面60fps流畅运行，避免动画卡顿。', 'CODING手记', 'Tech Notes'),
        ('TypeScript 高级技巧', '类型系统的深度应用，让代码更健壮。', 'CODING手记', 'Tech Notes'),
        ('状态管理演进之路', '从 useState 到 Zustand，找到适合的平衡点。', 'CODING手记', 'Tech Notes'),
        ('玻璃拟态设计趋势', 'Glassmorphism 的复兴与创新应用。', '设计灵感', 'Visual Notes'),
        ('暗色模式设计原则', '如何在不同场景下打造舒适的暗色体验。', '设计灵感', 'Visual Notes'),
        ('v2.0 全新改版', '视觉与交互的全面升级，带来更沉浸的体验。', '更新日志', 'Changelog'),
        ('AI 对话模块上线', '用 AI 打造更智能的交互体验。', '更新日志', 'Changelog')
      `
    }

    return Response.json({ success: true, message: 'Database initialized successfully' })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
