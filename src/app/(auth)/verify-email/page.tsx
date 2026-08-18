"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrandLogo } from "@/components/shared/BrandLogo"

export default function VerifyEmailPage() {
 const [resending, setResending] = useState(false)
 const [resent, setResent] = useState(false)

 const handleResend = async () => {
 setResending(true)
 await new Promise((r) => setTimeout(r, 1500))
 setResending(false)
 setResent(true)
 }

 return (
 <div className="flex min-h-screen items-center justify-center px-4">
 <div className="w-full max-w-md">
 <div className="mb-8 text-center">
 <Link href="/" className="inline-flex items-center">
 <BrandLogo />
 </Link>
 </div>

 <Card>
 <CardContent className="flex flex-col items-center p-8 text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CDF88D]/10">
 <Mail className="h-8 w-8 text-[#CDF88D]" />
 </div>
 <h2 className="mt-6 text-2xl font-bold">Check Your Email</h2>
 <p className="mt-3 text-gray-500">
 We&apos;ve sent a verification link to your email address. Click the link
 to verify your account.
 </p>
 <p className="mt-2 text-sm text-gray-500">
 Didn&apos;t receive it? Check your spam folder.
 </p>

 <div className="mt-8 flex flex-col gap-3">
 <Button
 onClick={handleResend}
 variant="outline"
 disabled={resending}
 >
 {resending ? (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 ) : resent ? (
 <CheckCircle className="mr-2 h-4 w-4" />
 ) : null}
 {resent ? "Email Sent!" : "Resend Verification Email"}
 </Button>
 <Link href="/login">
 <Button className="w-full bg-[#CDF88D] text-[#14532d] hover:bg-[#CDF88D]">
 Back to Login
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
