"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, MessageSquare, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const contactSchema = z.object({
 name: z.string().min(2, "Name must be at least 2 characters"),
 email: z.string().email("Please enter a valid email address"),
 subject: z.string().min(5, "Subject must be at least 5 characters"),
 message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
 const [isLoading, setIsLoading] = useState(false)
 const [sent, setSent] = useState(false)

 const {
 register,
 handleSubmit,
 formState: { errors },
 reset,
 } = useForm<ContactForm>({
 resolver: zodResolver(contactSchema),
 })

 const onSubmit = async (data: ContactForm) => {
 setIsLoading(true)
 await new Promise((r) => setTimeout(r, 1500))
 setIsLoading(false)
 setSent(true)
 reset()
 }

 return (
 <div className="min-h-screen">
 <section className="bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] py-20">
 <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <Badge className="mb-6 border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]">
 <MessageSquare className="mr-1 h-3 w-3" />
 Get in Touch
 </Badge>
 <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
 Contact Us
 </h1>
 <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
 Have a question, suggestion, or need help? We&apos;d love to hear from you.
 </p>
 </motion.div>
 </div>
 </section>

 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid gap-12 lg:grid-cols-5">
 {/* Contact Info */}
 <div className="lg:col-span-2">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="space-y-6"
 >
 <h2 className="text-2xl font-bold">Contact Information</h2>
 <p className="text-gray-500">
 Reach out to us through any of the channels below, or fill out the form and
 we&apos;ll get back to you within 24 hours.
 </p>

 <div className="space-y-4">
 {[
 { icon: Mail, label: "Email", value: "support@fundforward.com" },
 { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
 { icon: MapPin, label: "Address", value: "123 Innovation Drive, San Francisco, CA 94102" },
 ].map((item) => (
 <div key={item.label} className="flex items-start gap-3">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22c55e]/10">
 <item.icon className="h-5 w-5 text-[#22c55e]" />
 </div>
 <div>
 <p className="text-sm font-medium">{item.label}</p>
 <p className="text-sm text-gray-500">{item.value}</p>
 </div>
 </div>
 ))}
 </div>

 <div>
 <h3 className="mb-3 text-sm font-semibold">Follow Us</h3>
 <div className="flex gap-3">
 {[
 {
 label: "Twitter",
 svg: (
 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
 </svg>
 ),
 },
 {
 label: "Instagram",
 svg: (
 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
 </svg>
 ),
 },
 {
 label: "Facebook",
 svg: (
 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
 </svg>
 ),
 },
 {
 label: "LinkedIn",
 svg: (
 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
 </svg>
 ),
 },
 ].map((social) => (
 <a
 key={social.label}
 href="#"
 aria-label={social.label}
 className="flex h-10 w-10 items-center justify-center rounded-xl border transition-colors hover:border-[#22c55e] hover:bg-[#22c55e]/5 hover:text-[#22c55e]"
 >
 {social.svg}
 </a>
 ))}
 </div>
 </div>
 </motion.div>
 </div>

 {/* Contact Form */}
 <div className="lg:col-span-3">
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <Card>
 <CardContent className="p-6 sm:p-8">
 {sent ? (
 <div className="flex flex-col items-center py-8 text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10">
 <CheckCircle className="h-8 w-8 text-[#22c55e]" />
 </div>
 <h3 className="mt-4 text-xl font-semibold">Message Sent!</h3>
 <p className="mt-2 text-gray-500">
 Thank you for reaching out. We&apos;ll get back to you within 24 hours.
 </p>
 <Button
 className="mt-6"
 variant="outline"
 onClick={() => setSent(false)}
 >
 Send Another Message
 </Button>
 </div>
 ) : (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <div className="grid gap-4 sm:grid-cols-2">
 <div className="space-y-2">
 <Label htmlFor="name">Name</Label>
 <Input id="name" placeholder="John Doe" {...register("name")} />
 {errors.name && (
 <p className="text-xs text-red-500">{errors.name.message}</p>
 )}
 </div>
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
 </div>
 <div className="space-y-2">
 <Label htmlFor="subject">Subject</Label>
 <Input
 id="subject"
 placeholder="How can we help?"
 {...register("subject")}
 />
 {errors.subject && (
 <p className="text-xs text-red-500">{errors.subject.message}</p>
 )}
 </div>
 <div className="space-y-2">
 <Label htmlFor="message">Message</Label>
 <Textarea
 id="message"
 placeholder="Tell us more..."
 rows={6}
 {...register("message")}
 />
 {errors.message && (
 <p className="text-xs text-red-500">{errors.message.message}</p>
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
 <>
 <Send className="mr-2 h-4 w-4" />
 Send Message
 </>
 )}
 </Button>
 </form>
 )}
 </CardContent>
 </Card>
 </motion.div>
 </div>
 </div>
 </div>
 </section>
 </div>
 )
}
