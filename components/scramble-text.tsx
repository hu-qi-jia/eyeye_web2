"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import gsap from "gsap"

/**
 * 文本乱码动画组件的属性接口
 */
interface ScrambleTextProps {
  /** 要显示的文本 */
  text: string
  /** 自定义样式类 */
  className?: string
  /** 动画开始前的延迟（毫秒） */
  delayMs?: number
  /** 动画持续时间（秒） */
  duration?: number
}

/**
 * 悬停时触发文本乱码动画的组件属性接口
 */
interface ScrambleTextOnHoverProps {
  /** 要显示的文本 */
  text: string
  /** 自定义样式类 */
  className?: string
  /** 动画持续时间（秒） */
  duration?: number
  /** 渲染的元素类型 */
  as?: "span" | "button" | "div"
  /** 点击处理函数 */
  onClick?: () => void
}

/** 乱码动画使用的随机字符集 */
const GLYPHS = "!@#$%^&*()_+-=<>?/\\[]{}Xx"

/**
 * 执行文本乱码动画
 * 文字会从随机字符逐渐变为目标文本
 */
function runScrambleAnimation(
  text: string,
  duration: number,
  setDisplayText: (text: string) => void,
  onComplete?: () => void,
): gsap.core.Tween {
  const lockedIndices = new Set<number>()
  const finalChars = text.split("")
  const totalChars = finalChars.length
  const scrambleObj = { progress: 0 }

  return gsap.to(scrambleObj, {
    progress: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      // 计算当前应该锁定多少个字符
      const numLocked = Math.floor(scrambleObj.progress * totalChars)

      for (let i = 0; i < numLocked; i++) {
        lockedIndices.add(i)
      }

      // 生成显示文本：已锁定的显示原字符，未锁定的显示随机字符
      const newDisplay = finalChars
        .map((char, i) => {
          if (lockedIndices.has(i)) return char
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join("")

      setDisplayText(newDisplay)
    },
    onComplete: () => {
      setDisplayText(text)
      onComplete?.()
    },
  })
}

/**
 * 文本乱码动画组件 - 挂载时执行动画
 * 文字会从随机字符逐渐变为目标文本
 */
export function ScrambleText({ text, className, delayMs = 0, duration = 0.9 }: ScrambleTextProps) {
  // 初始化显示文本以避免内容闪烁
  const [displayText, setDisplayText] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 挂载时执行一次动画
  useEffect(() => {
    if (hasAnimated || !text) return

    // 从乱码文本开始
    const scrambledStart = text
      .split("")
      .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
      .join("")
    setDisplayText(scrambledStart)

    // 延迟后执行动画
    timeoutRef.current = setTimeout(() => {
      animationRef.current = runScrambleAnimation(text, duration, setDisplayText, () => {
        setHasAnimated(true)
      })
    }, delayMs)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (animationRef.current) animationRef.current.kill()
    }
  }, []) // 空依赖数组 - 仅在挂载时运行

  // 处理文本属性变化
  useEffect(() => {
    if (hasAnimated && displayText !== text) {
      setDisplayText(text)
    }
  }, [text, hasAnimated, displayText])

  return (
    <span ref={containerRef} className={className}>
      {displayText || text}
    </span>
  )
}

/**
 * 文本乱码动画组件 - 悬停时执行动画
 * 鼠标悬停时文字会从随机字符逐渐变为目标文本
 */
export function ScrambleTextOnHover({
  text,
  className,
  duration = 0.4,
  as: Component = "span",
  onClick,
}: ScrambleTextOnHoverProps) {
  const [displayText, setDisplayText] = useState(text)
  const isAnimating = useRef(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true

    // 终止任何现有动画
    if (tweenRef.current) {
      tweenRef.current.kill()
    }

    // 从乱码开始
    const scrambledStart = text
      .split("")
      .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
      .join("")
    setDisplayText(scrambledStart)

    // 执行动画
    tweenRef.current = runScrambleAnimation(text, duration, setDisplayText, () => {
      isAnimating.current = false
    })
  }, [text, duration])

  // 如果文本属性变化则更新显示文本
  useEffect(() => {
    if (!isAnimating.current) {
      setDisplayText(text)
    }
  }, [text])

  return (
    <Component className={className} onMouseEnter={handleMouseEnter} onClick={onClick}>
      {displayText}
    </Component>
  )
}
