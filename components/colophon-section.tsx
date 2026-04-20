"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * 版权/关于区域组件
 * 展示博客的版权信息、技术栈和联系方式
 */
export function ColophonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // 滚动时的动画效果
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // 标题滑入动画
      if (headerRef.current) {
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
      }

      // 网格列依次淡入
      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // 页脚淡入
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      {/* 区块标题 */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">05 / About</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">ABOUT THIS BLOG</h2>
      </div>

      {/* 多列布局信息 */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
        {/* Design */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Owner</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">Eyeye</li>
            <li className="font-mono text-xs text-foreground/80">Personal Blog</li>
          </ul>
        </div>

        {/* Stack */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Stack</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">Next.js</li>
            <li className="font-mono text-xs text-foreground/80">Tailwind CSS</li>
            <li className="font-mono text-xs text-foreground/80">Vercel</li>
          </ul>
        </div>

        {/* Typography */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Focus</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">技术实践</li>
            <li className="font-mono text-xs text-foreground/80">产品思考</li>
            <li className="font-mono text-xs text-foreground/80">生活记录</li>
          </ul>
        </div>

        {/* Location */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Identity</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">Builder</li>
            <li className="font-mono text-xs text-foreground/80">Writer</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:hello@eyeye.blog"
                className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                Social
              </a>
            </li>
          </ul>
        </div>

        {/* Year */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Year</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">2026</li>
            <li className="font-mono text-xs text-foreground/80">Ongoing</li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div
        ref={footerRef}
        className="mt-24 pt-8 border-t border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          © 2026 Eyeye. All rights reserved.
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">A quiet place for writing, building, and thinking.</p>
      </div>
    </section>
  )
}
