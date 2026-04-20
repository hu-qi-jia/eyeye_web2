"use client"

import { useEffect, useRef } from "react"

/**
 * 动画噪点背景组件
 * 使用 Canvas 生成动态噪点效果，用于增加视觉纹理
 */
interface AnimatedNoiseProps {
  /** 噪点透明度 */
  opacity?: number
  /** 自定义样式类 */
  className?: string
}

export function AnimatedNoise({ opacity = 0.05, className }: AnimatedNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let frame = 0

    // 调整 Canvas 大小
    const resize = () => {
      canvas.width = canvas.offsetWidth / 2
      canvas.height = canvas.offsetHeight / 2
    }

    // 生成随机噪点
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value     // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 255   // A
      }

      ctx.putImageData(imageData, 0, 0)
    }

    // 动画循环
    const animate = () => {
      frame++
      // 每隔一帧更新一次噪点以优化性能
      if (frame % 2 === 0) {
        generateNoise()
      }
      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener("resize", resize)
    animate()

    // 清理函数
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  )
}
