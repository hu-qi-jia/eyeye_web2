"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * 工作/关于我区域组件
 * 展示个人简介信息和交互式对话功能
 */
export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // 标题从左侧滑入动画
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return

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

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* 区块标题 */}
      <div ref={headerRef} className="mb-16 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / About Me</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight whitespace-nowrap">ABOUT ME</h2>
        </div>
      </div>

      {/* 内容区域：左侧眼睛动画，右侧对话 */}
      <div className="flex flex-col lg:flex-row min-h-[220px] lg:min-h-[500px] items-stretch gap-12 lg:gap-20 w-full lg:w-[95%]">
        <div className="w-full lg:w-1/3 flex items-center justify-center">
          <EyeAnimation />
        </div>
        <div className="w-full lg:w-2/3 min-w-0">
          <EyeChat />
        </div>
      </div>
    </section>
  )
}

function EyeChat() {
  interface Message {
    id: number
    text: string
    isUser: boolean
    isTyping?: boolean
  }

  const [inputValue, setInputValue] = useState("")
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [aiStatus, setAiStatus] = useState<"online" | "thinking">("online")
  const [isHovered, setIsHovered] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentResponse, setCurrentResponse] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageIdRef = useRef(0)

  const aiIntro = "你可以问我任何关于产品、技术或项目的问题，我会尽量给你真实的答案。"

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let index = 0
    let mounted = true

    const tick = () => {
      if (index < aiIntro.length && mounted) {
        setDisplayedText(aiIntro.slice(0, index + 1))
        index++
      } else if (mounted) {
        setIsTyping(false)
        setAiStatus("online")
      }
    }

    if (!isTyping) return

    const interval = setInterval(tick, 30)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [isTyping])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true)
      setAiStatus("thinking")
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const suggestedQuestions = [
    "你做过最有意思的项目是什么？",
    "你是怎么做AI产品的？",
    "你现在在研究什么？",
    "如果我想和你合作，你看重什么？",
  ]

  const handleSend = (question?: string) => {
    const text = question || inputValue
    if (!text.trim() && !question) return

    const userMessage: Message = { id: messageIdRef.current++, text: question || text, isUser: true }
    setMessages([userMessage])
    setInputValue("")
    setAiStatus("thinking")
    setCurrentResponse("")

    const responses = [
      "这个问题很有意思，让我思考一下。我的经验告诉我，关键在于持续迭代和用户反馈。",
      "作为产品开发者，我一直相信技术应该服务于用户需求，而不是反过来。",
      "我目前主要在研究 AI 与产品设计的结合，寻找更自然的人机交互方式。",
      "合作的话，我更看重对方的思考方式和执行力。想法再好，执行不到位也没用。",
    ]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    let charIndex = 0
    let mounted = true

    setTimeout(() => {
      if (!mounted) return
      setAiStatus("online")

      const typeInterval = setInterval(() => {
        if (!mounted) {
          clearInterval(typeInterval)
          return
        }
        if (charIndex < randomResponse.length) {
          setCurrentResponse(randomResponse.slice(0, charIndex + 1))
          charIndex++
        } else {
          clearInterval(typeInterval)
        }
      }, 40)
    }, 1500)
  }

  const handleQuestionClick = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-full min-h-[550px] lg:min-h-[650px] rounded-none border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-8 lg:p-12 opacity-0 overflow-hidden"
    >
      {/* 呼吸光效背景 */}
      <div
        className={cn(
          "absolute inset-0 rounded-none bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-60"
        )}
      />
      {/* 呼吸动画边框 */}
      <div className="absolute inset-0 rounded-none opacity-30">
        <div className="absolute inset-0 rounded-none border border-accent/30 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col h-full pt-2 gap-6">
        {/* 标题区 + AI状态 */}
        <div className="flex items-center gap-3 shrink-0">
          <h3 className="font-[var(--font-bebas)] text-3xl lg:text-4xl tracking-wide text-white/90">ASK ME</h3>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                aiStatus === "online" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
              )}
            />
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
              {aiStatus === "online" ? "Online" : "Thinking..."}
            </span>
          </div>
        </div>

        {/* AI对话区 - 固定高度，内容过多时滚动 */}
        <div className="shrink-0 overflow-y-auto" style={{ maxHeight: "240px" }}>
          {/* 欢迎消息 - 无消息时显示 */}
          {messages.length === 0 && (
            <div className="flex gap-3 lg:gap-4 mb-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/eye_chat.svg" alt="AI" className="w-6 h-6 lg:w-7 lg:h-7 object-contain" />
                <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-0" />
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-4 lg:p-5 border border-white/5">
                <p className="text-white/80 text-base lg:text-lg leading-relaxed font-light">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          )}

          {/* 用户消息 - 始终在AI回复上方 */}
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 lg:gap-4 mb-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-accent/80 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <span className="text-white text-xs font-bold">ME</span>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-4 lg:p-5 border border-white/5">
                <p className="text-white/80 text-base lg:text-lg leading-relaxed font-light">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* AI回复 - 在用户消息下方 */}
          {messages.length > 0 && (
            <div className="flex gap-3 lg:gap-4 mb-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/eye_chat.svg" alt="AI" className="w-6 h-6 lg:w-7 lg:h-7 object-contain" />
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-4 lg:p-5 border border-white/5">
                <p className="text-white/80 text-base lg:text-lg leading-relaxed font-light">
                  {currentResponse}
                  {aiStatus === "thinking" && (
                    <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 推荐问题 - 行动按钮风格 */}
        <div className="flex flex-wrap gap-2 lg:gap-3 shrink-0">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="group relative px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm lg:text-base font-mono hover:bg-accent/20 hover:text-white hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(var(--accent-rgb),0.15)] active:translate-y-0 transition-all duration-200"
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              {question}
              <span className="absolute inset-0 rounded-lg bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>

        {/* 输入框区域 */}
        <div className="relative group shrink-0">
          {/* 输入框发光效果 */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />
          <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 lg:px-5 lg:py-4 focus-within:border-accent/50 focus-within:bg-white/[0.07] transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="问我点什么吧"
              className="flex-1 bg-transparent text-white/80 text-base lg:text-lg placeholder:text-white/30 focus:outline-none"
            />
            {/* 发送按钮 - 带箭头滑动动效 */}
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className={cn(
                "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 overflow-hidden",
                inputValue.trim()
                  ? "bg-accent/80 hover:bg-accent text-white shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              )}
            >
              <svg
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  inputValue.trim() && "group-hover:translate-x-0.5"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* 底部个人信息区 */}
        <div className="pt-4 border-t border-white/10 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div>
              <h4 className="font-mono text-xs lg:text-sm uppercase tracking-[0.15em] text-white/70 mb-1">What I do</h4>
              <p className="text-white/60 text-sm lg:text-base leading-relaxed">前端开发 / UI设计 / 产品思考</p>
            </div>
            <div>
              <h4 className="font-mono text-xs lg:text-sm uppercase tracking-[0.15em] text-white/70 mb-1">How I work</h4>
              <p className="text-white/60 text-sm lg:text-base leading-relaxed">注重细节/追求简洁/持续迭代</p>
            </div>
            <div>
              <h4 className="font-mono text-xs lg:text-sm uppercase tracking-[0.15em] text-white/70 mb-1">What I care about</h4>
              <p className="text-white/60 text-sm lg:text-base leading-relaxed">用户体验 / 代码质量 / 终身学习</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EyeAnimation() {
  const [isOpen, setIsOpen] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout> | null = null

    const blinkInterval = setInterval(() => {
      setIsOpen(false)
      blinkTimeout = setTimeout(() => {
        setIsOpen(true)
      }, 180)
    }, 2600)

    return () => {
      clearInterval(blinkInterval)
      if (blinkTimeout) clearTimeout(blinkTimeout)
    }
  }, [])

  const maskImage = isOpen ? "url('/eye_open.svg')" : "url('/eye_close.svg')"

  return (
    <div
      ref={containerRef}
      className="relative flex justify-start opacity-0 ml-4 md:ml-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-300",
          isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100",
        )}
        style={{
          width: "clamp(14rem, 28vw, 24rem)",
          height: "clamp(8rem, 16vw, 14rem)",
          backgroundColor: "var(--accent)",
          opacity: isHovered ? 0.22 : 0,
        }}
      />

      <div
        className={cn("relative transition-all duration-300 ease-out", isHovered ? "-translate-y-2 scale-110" : "translate-y-0 scale-100")}
        style={{
          width: "clamp(14rem, 28vw, 24rem)",
          aspectRatio: "1 / 1",
          backgroundColor: isHovered ? "var(--accent)" : "#ffffff",
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          filter: isHovered ? "drop-shadow(0 18px 32px rgba(249, 115, 22, 0.22))" : "none",
        }}
      />
    </div>
  )
}
