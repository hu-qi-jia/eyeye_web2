"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const thoughts = [
  {
    title: "产品思考",
    medium: "Product",
    description: "整理我对功能体验、用户需求和产品决策的观察。",
    span: "col-span-1 row-span-1",
    items: [
      { title: "从0到1的产品设计流程", date: "2024-01-15", content: "探索产品设计的核心方法论，从需求分析到原型迭代的完整流程分享。" },
      { title: "用户研究的本质", date: "2024-02-20", content: "深入理解用户研究不是为了验证想法，而是为了发现未知。" },
      { title: "MVP设计的陷阱", date: "2024-03-10", content: "最小可行产品不是最简陋的产品，而是最核心的产品。" },
    ],
  },
  {
    title: "CODING手记",
    medium: "Tech Notes",
    description: "记录组件设计、页面实现与真实项目里遇到的问题和解法。",
    span: "col-span-2 row-span-2",
    items: [
      { title: "React Server Components 实践", date: "2024-01-08", content: "RSC 不仅是技术升级，更是思维方式的重塑。" },
      { title: "动画库性能优化", date: "2024-02-14", content: "如何让页面60fps流畅运行，避免动画卡顿。" },
      { title: "TypeScript 高级技巧", date: "2024-03-01", content: "类型系统的深度应用，让代码更健壮。" },
      { title: "状态管理演进之路", date: "2024-03-22", content: "从 useState 到 Zustand，找到适合的平衡点。" },
    ],
  },
  {
    title: "设计灵感",
    medium: "Visual Notes",
    description: "收集值得记录的排版、界面节奏和视觉表达方式。",
    span: "col-span-1 row-span-2",
    items: [
      { title: "玻璃拟态设计趋势", date: "2024-01-20", content: "Glassmorphism 的复兴与创新应用。" },
      { title: "暗色模式设计原则", date: "2024-02-28", content: "如何在不同场景下打造舒适的暗色体验。" },
    ],
  },
  {
    title: "更新日志",
    medium: "Changelog",
    description: "持续记录这个博客本身的调整、迭代和新想法。",
    span: "col-span-1 row-span-1",
    items: [
      { title: "v2.0 全新改版", date: "2024-03-15", content: "视觉与交互的全面升级，带来更沉浸的体验。" },
      { title: "AI 对话模块上线", date: "2024-04-01", content: "用 AI 打造更智能的交互体验。" },
    ],
  },
]

interface ModalItem {
  title: string
  date: string
  content: string
}

export function ThinkingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLevel, setModalLevel] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [cardBounds, setCardBounds] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const openModal = useCallback((categoryTitle: string, bounds: DOMRect) => {
    setSelectedCategory(categoryTitle)
    setCardBounds(bounds)
    setIsModalOpen(true)
    setModalLevel(1)
  }, [])

  const openLevel2 = useCallback((item: ModalItem) => {
    setSelectedItem(item)
    setModalLevel(2)
  }, [])

  const closeToLevel1 = useCallback(() => {
    setSelectedItem(null)
    setModalLevel(1)
  }, [])

  const closeModal = useCallback(() => {
    if (modalContentRef.current) {
      gsap.to(modalContentRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsModalOpen(false)
          setModalLevel(1)
          setSelectedItem(null)
          setSelectedCategory(null)
          setCardBounds(null)
        },
      })
    } else {
      setIsModalOpen(false)
      setModalLevel(1)
      setSelectedItem(null)
      setSelectedCategory(null)
      setCardBounds(null)
    }
  }, [])

  useEffect(() => {
    if (isModalOpen && modalContentRef.current && cardBounds) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const modalW = Math.min(700, vw * 0.9)
      const modalH = Math.min(600, vh * 0.85)
      const startX = cardBounds.left + cardBounds.width / 2 - vw / 2
      const startY = cardBounds.top + cardBounds.height / 2 - vh / 2
      const endX = 0
      const endY = 0
      const startW = cardBounds.width
      const startH = cardBounds.height
      const endW = modalW
      const endH = modalH
      const startScaleX = startW / endW
      const startScaleY = startH / endH

      gsap.fromTo(
        modalContentRef.current,
        {
          x: startX,
          y: startY,
          scaleX: startScaleX,
          scaleY: startScaleY,
          opacity: 0,
        },
        {
          x: endX,
          y: endY,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          duration: 0.45,
          ease: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      )
    }
  }, [isModalOpen, cardBounds])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        if (modalLevel === 2) {
          closeToLevel1()
        } else {
          closeModal()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen, modalLevel, closeModal, closeToLevel1])

  const currentCategory = thoughts.find((t) => t.title === selectedCategory)

  return (
    <>
      <section ref={sectionRef} id="thinking" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
        <div ref={headerRef} className="mb-16 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">03 / Thinking</span>
            <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">THINKING</h2>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]"
        >
          {thoughts.map((thought, index) => (
            <ThinkingCard
              key={index}
              thought={thought}
              index={index}
              onClick={(bounds) => openModal(thought.title, bounds)}
            />
          ))}
        </div>
      </section>

      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div
            ref={modalContentRef}
            className="relative w-[90vw] max-w-[700px] h-[600px] max-h-[85vh] bg-background/95 backdrop-blur-xl border border-border/40 rounded-none shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none rounded-none" />

            <div className="relative z-10 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  {modalLevel === 1 && selectedCategory && (
                    <>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {currentCategory?.medium}
                      </span>
                      <h3 className="mt-2 font-[var(--font-bebas)] text-3xl lg:text-4xl tracking-wide">
                        {selectedCategory}
                      </h3>
                    </>
                  )}
                  {modalLevel === 2 && selectedItem && (
                    <>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {selectedItem.date}
                      </span>
                      <h3 className="mt-2 font-[var(--font-bebas)] text-3xl lg:text-4xl tracking-wide">
                        {selectedItem.title}
                      </h3>
                    </>
                  )}
                </div>
                <button
                  onClick={modalLevel === 2 ? closeToLevel1 : closeModal}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalLevel === 1 && currentCategory && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {currentCategory.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => openLevel2(item)}
                      className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/40 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-white/90 group-hover:text-accent transition-colors">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm text-white/50 line-clamp-2">{item.content}</p>
                        </div>
                        <span className="font-mono text-xs text-white/30 whitespace-nowrap">{item.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {modalLevel === 2 && selectedItem && (
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                  <p className="text-base lg:text-lg text-white/70 leading-relaxed">
                    {selectedItem.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ThinkingCard({
  thought,
  index,
  onClick,
}: {
  thought: {
    title: string
    medium: string
    description: string
    span: string
  }
  index: number
  onClick: (bounds: DOMRect) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  const handleClick = () => {
    if (cardRef.current) {
      const bounds = cardRef.current.getBoundingClientRect()
      onClick(bounds)
    }
  }

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden",
        thought.span,
        isHovered && "border-accent/60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute inset-0 bg-accent/5 transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{thought.medium}</span>
        <h3
          className={cn(
            "mt-3 font-[var(--font-bebas)] text-2xl md:text-4xl tracking-tight transition-colors duration-300",
            isHovered ? "text-accent" : "text-foreground",
          )}
        >
          {thought.title}
        </h3>
      </div>

      <div className="relative z-10">
        <p
          className={cn(
            "font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500 max-w-[280px]",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          {thought.description}
        </p>
      </div>

      <span
        className={cn(
          "absolute bottom-4 right-4 font-mono text-[10px] transition-colors duration-300",
          isHovered ? "text-accent" : "text-muted-foreground/40",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={cn(
          "absolute top-0 right-0 w-12 h-12 transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}
