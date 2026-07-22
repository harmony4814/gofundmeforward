"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Heart, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const resetSchema = z
 .object({
 password: z.string().min(8, "Password must be at least 8 characters"),
 confirmPassword: z.string(),
 })
 .refine((data) => data.password === data.confirmPassword, {
 message: "Passwords do not match",
 path: ["confirmPassword"],
 })

type ResetForm = z.infer<typeof resetSchema>

function getPasswordStrength(password: string) {
 let score = 0
 if (password.length >= 8) score++
 if (password.length >= 12) score++
 if (/[A-Z]/.test(password)) score++
 if (/[0-9]/.test(password)) score++
 if (/[^A-Za-z0-9]/.test(password)) score++
 return score
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
const strengthColors = [
 "bg-red-500",
 "bg-orange-500",
 "bg-yellow-500",
 "bg-lime-500",
 "bg-[#22c55e]",
]

export default function ResetPasswordPage() {
 const [showPassword, setShowPassword] = useState(false)
 const [showConfirm, setShowConfirm] = useState(false)
 const [isLoading, setIsLoading] = useState(false)
 const [success, setSuccess] = useState(false)

 const {
 register,
 handleSubmit,
 watch,
 formState: { errors },
 } = useForm<ResetForm>({
 resolver: zodResolver(resetSchema),
 })

 const password = watch("password", "")
 const strength = useMemo(() => getPasswordStrength(password), [password])

 const onSubmit = async (data: ResetForm) => {
 setIsLoading(true)
 await new Promise((r) => setTimeout(r, 1500))
 setIsLoading(false)
 setSuccess(true)
 }

 if (success) {
 return (
 <div className="flex min-h-screen items-center justify-center px-4">
 <Card className="w-full max-w-md">
 <CardContent className="flex flex-col items-center p-8 text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10">
 <CheckCircle className="h-8 w-8 text-[#22c55e]" />
 </div>
 <h2 className="mt-6 text-2xl font-bold">Password Reset Successfully</h2>
 <p className="mt-3 text-gray-500">
 Your password has been updated. You can now sign in with your new
 password.
 </p>
 <Link href="/login" className="mt-8">
 <Button className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
 Sign In
 </Button>
 </Link>
 </CardContent>
 </Card>
 </div>
 )
 }

 return (
 <div className="flex min-h-screen items-center justify-center px-4">
 <div className="w-full max-w-md">
 <div className="mb-8 text-center">
 <Link href="/" className="inline-flex items-center gap-2">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e]">
 <Heart className="h-5 w-5 text-white" fill="white" />
 </div>
 <span className="text-xl font-bold">FundForward</span>
 </Link>
 </div>

 <Card>
 <CardContent className="p-8">
 <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
 <p className="mt-2 text-sm text-gray-500">
 Enter your new password below.
 </p>

 <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
 <div className="space-y-2">
 <Label htmlFor="password">New Password</Label>
 <div className="relative">
 <Input
 id="password"
 type={showPassword ? "text" : "password"}
 placeholder="••••••••"
 {...register("password")}
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
 >
 {showPassword ? (
 <EyeOff className="h-4 w-4" />
 ) : (
 <Eye className="h-4 w-4" />
 )}
 </button>
 </div>
 {password && (
 <div className="space-y-1.5">
 <div className="flex gap-1">
 {[0, 1, 2, 3, 4].map((i) => (
 <div
 key={i}
 className={`h-1.5 flex-1 rounded-full ${
 i < strength
 ? strengthColors[strength - 1]
 : "bg-gray-200"
 }`}
 />
 ))}
 </div>
 <p className="text-xs text-gray-500">
 {strength > 0 ? strengthLabels[strength - 1] : "Enter a password"}
 </p>
 </div>
 )}
 {errors.password && (
 <p className="text-xs text-red-500">{errors.password.message}</p>
 )}
 </div>

 <div className="space-y-2">
 <Label htmlFor="confirmPassword">Confirm Password</Label>
 <div className="relative">
 <Input
 id="confirmPassword"
 type={showConfirm ? "text" : "password"}
 placeholder="••••••••"
 {...register("confirmPassword")}
 />
 <button
 type="button"
 onClick={() => setShowConfirm(!showConfirm)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
 >
 {showConfirm ? (
 <EyeOff className="h-4 w-4" />
 ) : (
 <Eye className="h-4 w-4" />
 )}
 </button>
 </div>
 {errors.confirmPassword && (
 <p className="text-xs text-red-500">
 {errors.confirmPassword.message}
 </p>
 )}
 </div>

 <Button
 type="submit"
 className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a]"
 size="lg"
 disabled={isLoading}
 >
 {isLoading ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 "Reset Password"
 )}
 </Button>
 </form>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
