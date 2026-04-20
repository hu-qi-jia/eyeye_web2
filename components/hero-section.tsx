"use client"

import { useEffect, useRef } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * 英雄区域组件
 * 页面顶部的首屏展示区域，包含姓名动画、欢迎文本和简历链接
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 滚动时内容向上移动并淡出
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12">
      {/* 动画噪点背景 */}
      <AnimatedNoise opacity={0.03} />

      {/* 左侧垂直标签 */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          EYEYE
        </span>
      </div>

      {/* 主要内容区域 */}
      <div ref={contentRef} className="flex-1 w-full">
        {/* 分 flap 文字动画 */}
        <SplitFlapAudioProvider>
          <div className="relative w-[80vw] max-w-[80vw]">
            <SplitFlapText text="HUQIJIA" speed={80} fillWidth className="w-full" />
            <div className="mt-4">
              <SplitFlapMuteToggle />
            </div>
          </div>
        </SplitFlapAudioProvider>

        {/* 副标题 */}
        <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide">
          Welcome to my world
        </h2>

        {/* 介绍文本 */}
        <p className="mt-12 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
          I&apos;m Eyeye. This blog is where I publish technical breakdowns, product reflections, and fragments of ideas worth
          keeping.
        </p>

        {/* 按钮组 */}
        <div className="mt-16 flex items-center gap-8">
          {/* 简历链接 */}
          <a
            href="/huqijia-resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="查看简历" as="span" duration={0.6} />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </a>
          {/* 个人项目链接 */}
          <a
            href="#signals"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            个人项目
          </a>
        </div>
      </div>

    </section>
  )
}
