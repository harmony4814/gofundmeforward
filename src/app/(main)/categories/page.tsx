"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutGrid } from "lucide-react"
import { categories } from "@/lib/data"
import { formatNumber } from "@/lib/utils"

export default function CategoriesPage() {
 return (
 <div className="min-h-screen">
 <section className="bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] py-20">
 <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <BadgeComponent className="mb-6 border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]">
 <LayoutGrid className="mr-1 h-3 w-3" />
 Browse
 </BadgeComponent>
 <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
 Explore Categories
 </h1>
 <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
 Find campaigns that match your interests and passions
 </p>
 </motion.div>
 </div>
 </section>

 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {categories.map((cat, i) => {
 const Icon = cat.icon
 return (
 <motion.div
 key={cat.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.03 }}
 >
 <Link href={`/categories/${cat.slug}`}>
 <Card className="group h-full transition-all duration-300 hover:border-[#22c55e] hover:shadow-lg hover:-translate-y-1">
 <CardContent className="flex items-start gap-4 p-6">
 <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#22c55e]/10 transition-colors group-hover:bg-[#22c55e]">
 <Icon className="h-7 w-7 text-[#22c55e] transition-colors group-hover:text-white" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-semibold transition-colors group-hover:text-[#22c55e]">
 {cat.name}
 </h3>
 <p className="mt-1 text-sm text-gray-500">
 {cat.description}
 </p>
 <p className="mt-3 text-sm font-medium text-[#22c55e]">
 {formatNumber(cat.campaignCount)} campaigns
 </p>
 </div>
 </CardContent>
 </Card>
 </Link>
 </motion.div>
 )
 })}
 </div>
 </div>
 </section>
 </div>
 )
}
