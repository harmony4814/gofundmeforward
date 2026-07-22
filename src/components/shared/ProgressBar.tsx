"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  color?: "green" | "blue" | "orange" | "purple"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const colorClasses = {
  green: "bg-gradient-to-r from-emerald-500 to-green-400",
  blue: "bg-gradient-to-r from-blue-600 to-blue-400",
  orange: "bg-gradient-to-r from-orange-500 to-amber-400",
  purple: "bg-gradient-to-r from-purple-600 to-purple-400",
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
}

export function ProgressBar({
  value,
  color = "green",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const [mounted, setMounted] = useState(false)
  const clampedValue = Math.min(Math.max(value, 0), 100)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {Math.round(clampedValue)}% funded
          </span>
          <span className="text-muted-foreground tabular-nums">
            {clampedValue.toFixed(1)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: mounted ? `${clampedValue}%` : 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />
      </div>
    </div>
  )
}
