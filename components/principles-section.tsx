"use client"

import { useRef, useEffect } from "react"
import { HighlightText } from "@/components/highlight-text"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// 写作原则数据
const principles = [
  {
    number: "01",
    titleParts: [
      { text: "KEEP IT", highlight: false },
      { text: " HONEST", highlight: true },
    ],
    description: "尽量把真实经验写清楚，不用夸张表达代替明确观点。",
    align: "left",
  },
  {
    number: "02",
    titleParts: [
      { text: "WRITE FROM", highlight: false },
      { text: " PRACTICE", highlight: true },
    ],
    description: "优先记录亲自做过、踩过坑、验证过的方法，而不是空泛结论。",
    align: "right",
  },
  {
    number: "03",
    titleParts: [
      { text: "THINK ", highlight: false },
      { text: "LONG-TERM", highlight: true },
    ],
    description: "让文章能在未来继续被自己和别人重新阅读，而不只是一次性输出。",
    align: "left",
  },
  {
    number: "04",
    titleParts: [
      { text: "STAY ", highlight: false },
      { text: "CURIOUS", highlight: true },
    ],
    description: "技术、设计和生活都值得被记录，持续提问才能保持表达的生命力。",
    align: "right",
  },
]

/**
 * 写作原则区域组件
 * 展示作者的写作理念和原则，带有交错布局的动画效果
 */
export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)

  // 滚动时的动画效果
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !principlesRef.current) return

    const ctx = gsap.context(() => {
      // 标题滑入动画
      gsap.from(headerRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // 每个原则从对齐方向滑入
      const articles = principlesRef.current?.querySelectorAll("article")
      articles?.forEach((article, index) => {
        const isRight = principles[index].align === "right"
        gsap.from(article, {
          x: isRight ? 80 : -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: article,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="principles" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* 区块标题 */}
      <div ref={headerRef} className="mb-24">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / Writing</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">WRITING NOTES</h2>
      </div>

      {/* 交错排列的原则列表 */}
      <div ref={principlesRef} className="space-y-24 md:space-y-32">
        {principles.map((principle, index) => (
          <article
            key={index}
            className={`flex flex-col ${
              principle.align === "right" ? "items-end text-right" : "items-start text-left"
            }`}
          >
            {/* 标注标签 */}
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {principle.number} / {principle.titleParts[0].text.split(" ")[0]}
            </span>

            {/* 标题 */}
            <h3 className="font-[var(--font-bebas)] text-4xl md:text-6xl lg:text-8xl tracking-tight leading-none">
              {principle.titleParts.map((part, i) =>
                part.highlight ? (
                  <HighlightText key={i} parallaxSpeed={0.6}>
                    {part.text}
                  </HighlightText>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </h3>

            {/* 描述文本 */}
            <p className="mt-6 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
              {principle.description}
            </p>

            {/* 装饰线 */}
            <div className={`mt-8 h-[1px] bg-border w-24 md:w-48 ${principle.align === "right" ? "mr-0" : "ml-0"}`} />
          </article>
        ))}
      </div>
    </section>
  )
}
