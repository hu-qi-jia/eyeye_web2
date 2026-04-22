"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Image from "next/image"
import PixelCard from "@/components/PixelCard"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

function Modal({ open, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-[90vw] sm:max-w-lg rounded-none border border-[#27272a] bg-[#0f0f0f] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center border border-[#27272a] bg-[#1a1a1a] text-white/60 hover:text-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

interface ContactCardProps {
  icon: string
  label: string
  variant: "blue" | "yellow" | "pink" | "default"
  triggerOnMount?: boolean
  onClick: () => void
}

function ContactCard({ icon, label, variant, triggerOnMount, onClick }: ContactCardProps) {
  return (
    <PixelCard
      variant={variant}
      className="w-full aspect-square cursor-pointer group"
      onClick={onClick}
      triggerOnMount={triggerOnMount}
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-3">
        <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-110">
          <Image
            src={icon}
            alt={label}
            fill
            className="object-contain invert opacity-90"
          />
        </div>
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70 group-hover:text-white/90 transition-colors">
          {label}
        </span>
      </div>
    </PixelCard>
  )
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [wechatOpen, setWechatOpen] = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("408490791@qq.com")
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = "408490791@qq.com"
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("article")
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="principles" className="relative py-24 md:py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      <div ref={headerRef} className="mb-12 md:mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / Contact</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">CONTACT ME</h2>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl"
      >
        <ContactCard
          icon="/wechaticon.svg"
          label="WeChat"
          variant="blue"
          triggerOnMount={false}
          onClick={() => setWechatOpen(true)}
        />
        <ContactCard
          icon="/phoneicon.svg"
          label="Phone"
          variant="yellow"
          triggerOnMount={false}
          onClick={() => setPhoneOpen(true)}
        />
        <ContactCard
          icon="/githubicon.svg"
          label="GitHub"
          variant="pink"
          triggerOnMount={false}
          onClick={() => window.open("https://github.com/hu-qi-jia", "_blank", "noopener,noreferrer")}
        />
        <ContactCard
          icon="/emailicon.svg"
          label="Email"
          variant="default"
          triggerOnMount={false}
          onClick={() => setEmailOpen(true)}
        />
      </div>

      <Modal open={wechatOpen} onClose={() => setWechatOpen(false)}>
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">WeChat QR Code</span>
          </div>
          <div className="flex justify-center">
            <Image
              src="/mywechat.png"
              alt="My WeChat"
              width={320}
              height={426}
              className="block w-auto h-auto max-w-[200px] sm:max-w-[280px]"
            />
          </div>
        </div>
      </Modal>

      <Modal open={phoneOpen} onClose={() => setPhoneOpen(false)}>
        <div className="px-6 py-10 sm:px-16 sm:py-12 text-center">
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Phone Number</span>
          </div>
          <p className="font-mono text-xl sm:text-3xl text-white/90 tracking-widest">198-5208-8553</p>
        </div>
      </Modal>

      <Modal open={emailOpen} onClose={() => setEmailOpen(false)}>
        <div className="px-6 py-10 sm:px-12 sm:py-12">
          <div className="text-center mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Email Address</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <p className="font-mono text-sm sm:text-3xl text-white/90 break-all">408490791@qq.com</p>
            <button
              onClick={copyEmail}
              className="shrink-0 border border-[#27272a] bg-[#1a1a1a] px-4 py-2 font-mono text-sm text-white/70 hover:text-white hover:bg-[#27272a] transition-colors"
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
