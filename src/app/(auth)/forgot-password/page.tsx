"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Heart, ArrowLeft, Loader2, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const forgotSchema = z.object({
 email: z.string().email("Please enter a valid email address"),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
 const [isLoading, setIsLoading] = useState(false)
 const [sent, setSent] = useState(false)
 const [email, setEmail] = useState("")

 const {
 register,
 handleSubmit,
 formState: { errors },
 } = useForm<ForgotForm>({
 resolver: zodResolver(forgotSchema),
 })

 const onSubmit = async (data: ForgotForm) => {
 setIsLoading(true)
 setEmail(data.email)
 await new Promise((r) => setTimeout(r, 1500))
 setIsLoading(false)
 setSent(true)
 }

 if (sent) {
 return (
 <div className="flex min-h-screen items-center justify-center px-4">
 <Card className="w-full max-w-md">
 <CardContent className="flex flex-col items-center p-8 text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10">
 <Mail className="h-8 w-8 text-[#22c55e]" />
 </div>
 <h2 className="mt-6 text-2xl font-bold">Check Your Email</h2>
 <p className="mt-3 text-gray-500">
 We&apos;ve sent a password reset link to{" "}
 <span className="font-medium text-gray-900">
 {email}
 </span>
 </p>
 <p className="mt-2 text-sm text-gray-500">
 Didn&apos;t receive the email? Check your spam folder or try again.
 </p>
 <div className="mt-8 flex flex-col gap-3">
 <Button
 variant="outline"
 onClick={() => {
 setSent(false)
 }}
 >
 Try Again
 </Button>
 <Link href="/login">
 <Button className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a]">
 Back to Login
 </Button>
 </Link>
 </div>
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
 <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
 <p className="mt-2 text-sm text-gray-500">
 Enter your email and we&apos;ll send you a link to reset your password.
 </p>

 <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
 <div className="space-y-2">
 <Label htmlFor="email">Email</Label>
 <Input
 id="email"
 type="email"
 placeholder="you@example.com"
 {...register("email")}
 />
 {errors.email && (
 <p className="text-xs text-red-500">{errors.email.message}</p>
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
 "Send Reset Link"
 )}
 </Button>
 </form>
 </CardContent>
 </Card>

 <div className="mt-6 text-center">
 <Link
 href="/login"
 className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
 >
 <ArrowLeft className="h-4 w-4" />
 Back to Login
 </Link>
 </div>
 </div>
 </div>
 )
}
