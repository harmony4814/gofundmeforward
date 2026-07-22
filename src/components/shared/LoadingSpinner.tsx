"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
 size?: "sm" | "md" | "lg";
 className?: string;
}

const SIZE_MAP = {
 sm: "h-5 w-5",
 md: "h-8 w-8",
 lg: "h-12 w-12",
};

const BORDER_MAP = {
 sm: "border-2",
 md: "border-2",
 lg: "border-3",
};

export default function LoadingSpinner({
 size = "md",
 className,
}: LoadingSpinnerProps) {
 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className={cn("flex items-center justify-center", className)}
 >
 <div
 className={cn(
 "animate-spin rounded-full border-gray-200 border-t-green-500",
 SIZE_MAP[size],
 BORDER_MAP[size]
 )}
 />
 </motion.div>
 );
}
