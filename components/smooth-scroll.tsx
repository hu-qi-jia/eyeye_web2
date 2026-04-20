"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * 平滑滚动组件
 * 使用 Lenis 库实现平滑滚动效果，并集成 GSAP ScrollTrigger
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // 初始化 Lenis 平滑滚动
    const lenis = new Lenis({
      duration: 1.2,  // 滚动动画持续时间
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // 缓动函数
      orientation: "vertical",  // 垂直滚动
      smoothWheel: true,  // 平滑滚轮
    })

    lenisRef.current = lenis

    // 将 Lenis 连接到 GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    // 使用 GSAP ticker 更新 Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // 禁用 GSAP 的lag平滑以避免冲突
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return <>{children}</>
}
