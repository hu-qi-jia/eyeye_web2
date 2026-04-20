import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 className 的工具函数
 * 使用 clsx 合并类名，并使用 tailwind-merge 处理冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
