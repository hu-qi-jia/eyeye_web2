"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useMemo, useState, useCallback, useEffect, useRef, createContext, useContext } from "react"
import { Volume2, VolumeX } from "lucide-react"

/**
 * 音频上下文类型定义
 */
interface AudioContextType {
  /** 是否静音 */
  isMuted: boolean
  /** 切换静音状态 */
  toggleMute: () => void
  /** 播放点击音效 */
  playClick: () => void
}

/** 音频上下文 */
const SplitFlapAudioContext = createContext<AudioContextType | null>(null)

/**
 * 使用音频上下文的 Hook
 */
function useSplitFlapAudio() {
  return useContext(SplitFlapAudioContext)
}

/**
 * 音频上下文提供者组件
 * 管理音效播放和静音状态
 */
export function SplitFlapAudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)

  // 获取或创建 AudioContext
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass()
      }
    }
    return audioContextRef.current
  }, [])

  // 触发触觉反馈
  const triggerHaptic = useCallback(() => {
    if (isMuted) return
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }, [isMuted])

  // 播放点击音效
  const playClick = useCallback(() => {
    if (isMuted) return

    triggerHaptic()

    try {
      const ctx = getAudioContext()
      if (!ctx) return

      // 如果音频上下文被暂停，则恢复
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      // 创建振荡器生成音效
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      const lowpass = ctx.createBiquadFilter()

      oscillator.type = "square"
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.015)

      filter.type = "bandpass"
      filter.frequency.setValueAtTime(1200, ctx.currentTime)
      filter.Q.setValueAtTime(0.8, ctx.currentTime)

      lowpass.type = "lowpass"
      lowpass.frequency.value = 2500
      lowpass.Q.value = 0.5

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)

      // 连接音频节点
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(lowpass)
      lowpass.connect(ctx.destination)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.02)
    } catch {
      // 不支持音频
    }
  }, [isMuted, getAudioContext, triggerHaptic])

  // 切换静音状态
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
    if (isMuted) {
      try {
        const ctx = getAudioContext()
        if (ctx && ctx.state === "suspended") {
          ctx.resume()
        }
      } catch {
        // 不支持音频
      }
    }
  }, [isMuted, getAudioContext])

  const value = useMemo(() => ({ isMuted, toggleMute, playClick }), [isMuted, toggleMute, playClick])

  return <SplitFlapAudioContext.Provider value={value}>{children}</SplitFlapAudioContext.Provider>
}

/**
 * 静音切换按钮组件
 */
export function SplitFlapMuteToggle({ className = "" }: { className?: string }) {
  const audio = useSplitFlapAudio()
  if (!audio) return null

  return (
    <button
      onClick={audio.toggleMute}
      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 ${className}`}
      aria-label={audio.isMuted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {audio.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      <span>{audio.isMuted ? "Sound Off" : "Sound On"}</span>
    </button>
  )
}

/**
 * 分 flap 文字组件属性
 */
interface SplitFlapTextProps {
  /** 要显示的文本 */
  text: string
  /** 自定义样式类 */
  className?: string
  /** 字符切换速度（毫秒） */
  speed?: number
  /** 是否填满宽度 */
  fillWidth?: boolean
}

/** 字符集 */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")

/**
 * 分 flap 文字内部组件
 */
function SplitFlapTextInner({ text, className = "", speed = 50, fillWidth = false }: SplitFlapTextProps) {
  const chars = useMemo(() => text.split(""), [text])
  const [animationKey, setAnimationKey] = useState(0)
  const [hasInitialized, setHasInitialized] = useState(false)
  const audio = useSplitFlapAudio()

  // 鼠标悬停时触发重新动画
  const handleMouseEnter = useCallback(() => {
    setAnimationKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialized(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`${fillWidth ? "grid w-full" : "inline-flex"} items-center cursor-pointer ${className}`}
      aria-label={text}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: "1000px",
        gap: fillWidth ? "clamp(2px, 0.4vw, 8px)" : "0.08em",
        gridTemplateColumns: fillWidth ? `repeat(${chars.length}, minmax(0, 1fr))` : undefined,
      }}
    >
      {chars.map((char, index) => (
        <SplitFlapChar
          key={index}
          char={char.toUpperCase()}
          index={index}
          animationKey={animationKey}
          skipEntrance={hasInitialized}
          speed={speed}
          playClick={audio?.playClick}
          fillWidth={fillWidth}
        />
      ))}
    </div>
  )
}

/**
 * 分 flap 文字组件 - 展示翻转动画的文字
 */
export function SplitFlapText(props: SplitFlapTextProps) {
  return <SplitFlapTextInner {...props} />
}

/**
 * 单个字符的翻转组件属性
 */
interface SplitFlapCharProps {
  /** 字符 */
  char: string
  /** 索引 */
  index: number
  /** 动画键 */
  animationKey: number
  /** 是否跳过入场动画 */
  skipEntrance: boolean
  /** 翻转速度 */
  speed: number
  /** 点击回调 */
  playClick?: () => void
  /** 是否填满宽度 */
  fillWidth: boolean
}

/**
 * 单个分 flap 字符组件
 * 实现字符翻转动画效果
 */
function SplitFlapChar({ char, index, animationKey, skipEntrance, speed, playClick, fillWidth }: SplitFlapCharProps) {
  const displayChar = CHARSET.includes(char) ? char : " "
  const isSpace = char === " "
  const [currentChar, setCurrentChar] = useState(skipEntrance ? displayChar : " ")
  const [isSettled, setIsSettled] = useState(skipEntrance)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 每个字符的延迟
  const tileDelay = 0.15 * index

  // 根据状态设置颜色
  const bgColor = isSettled ? "hsl(0, 0%, 0%)" : "rgba(239, 68, 68, 0.2)"
  const textColor = isSettled ? "#ffffff" : "#ef4444"

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (isSpace) {
      setCurrentChar(" ")
      setIsSettled(true)
      return
    }

    setIsSettled(false)
    setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)])

    const baseFlips = 8
    const startDelay = skipEntrance ? tileDelay * 400 : tileDelay * 800
    let flipIndex = 0
    let hasStartedSettling = false

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const settleThreshold = baseFlips + index * 3

        if (flipIndex >= settleThreshold && !hasStartedSettling) {
          hasStartedSettling = true
          if (intervalRef.current) clearInterval(intervalRef.current)
          setCurrentChar(displayChar)
          setIsSettled(true)
          if (playClick) playClick()
          return
        }
        setCurrentChar(CHARSET[Math.floor(Math.random() * CHARSET.length)])
        if (flipIndex % 2 === 0 && playClick) playClick()
        flipIndex++
      }, speed)
    }, startDelay)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayChar, isSpace, tileDelay, animationKey, skipEntrance, index, speed, playClick])

  // 空格字符
  if (isSpace) {
    return (
      <div
        style={{
          width: fillWidth ? "100%" : "0.3em",
          fontSize: fillWidth ? "clamp(2.8rem, 9vw, 12rem)" : "clamp(4rem, 15vw, 14rem)",
        }}
      />
    )
  }

  return (
    <motion.div
      initial={skipEntrance ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: tileDelay, duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden flex items-center justify-center font-[family-name:var(--font-bebas)]"
      style={{
        fontSize: fillWidth ? "clamp(2.8rem, 9vw, 12rem)" : "clamp(4rem, 15vw, 14rem)",
        width: fillWidth ? "100%" : "0.65em",
        height: fillWidth ? "auto" : "1.05em",
        aspectRatio: fillWidth ? "1 / 1.42" : undefined,
        backgroundColor: bgColor,
        transformStyle: "preserve-3d",
        transition: "background-color 0.15s ease",
      }}
    >
      {/* 中间分割线 */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/20 pointer-events-none z-10" />

      {/* 上半部分 */}
      <div className="absolute inset-x-0 top-0 bottom-1/2 flex items-end justify-center overflow-hidden">
        <span
          className="block translate-y-[0.52em] leading-none transition-colors duration-150"
          style={{ color: textColor }}
        >
          {currentChar}
        </span>
      </div>

      {/* 下半部分 */}
      <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-start justify-center overflow-hidden">
        <span
          className="-translate-y-[0.52em] leading-none transition-colors duration-150"
          style={{ color: textColor }}
        >
          {currentChar}
        </span>
      </div>

      {/* 翻转动画层 */}
      <motion.div
        key={`${animationKey}-${isSettled}`}
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        transition={{
          delay: skipEntrance ? tileDelay * 0.5 : tileDelay + 0.15,
          duration: 0.25,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="absolute inset-x-0 top-0 bottom-1/2 origin-bottom overflow-hidden"
        style={{
          backgroundColor: bgColor,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transition: "background-color 0.15s ease",
        }}
      >
        <div className="flex h-full items-end justify-center">
          <span
            className="translate-y-[0.52em] leading-none transition-colors duration-150"
            style={{ color: textColor }}
          >
            {currentChar}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
