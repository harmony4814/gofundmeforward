"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge, HelpCircle } from "lucide-react"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
 Accordion,
 AccordionItem,
 AccordionTrigger,
 AccordionContent,
} from "@/components/ui/accordion"
import { faqData } from "@/lib/data"

const faqCategories = ["General", "Campaigns", "Donations", "Account", "Technical"]

export default function FAQPage() {
 const [activeCategory, setActiveCategory] = useState("General")

 const filteredFAQs = faqData.filter((faq) => faq.category === activeCategory)

 return (
 <div className="min-h-screen">
 <section className="bg-gradient-to-br from-[#CDF88D] via-[#CDF88D] to-[#CDF88D] py-20">
 <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <BadgeComponent className="mb-6 border-[#CDF88D]/30 bg-[#CDF88D]/10 text-[#CDF88D]">
 <HelpCircle className="mr-1 h-3 w-3" />
 Help Center
 </BadgeComponent>
 <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
 Frequently Asked Questions
 </h1>
 <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
 Find answers to the most common questions about gofundme
 </p>
 </motion.div>
 </div>
 </section>

 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <Tabs
 defaultValue="General"
 value={activeCategory}
 onValueChange={setActiveCategory}
 >
 <TabsList variant="line" className="mb-8 flex w-full flex-wrap justify-start gap-1 border-b pb-2">
 {faqCategories.map((cat) => (
 <TabsTrigger key={cat} value={cat} className="text-sm">
 {cat}
 </TabsTrigger>
 ))}
 </TabsList>

 <Accordion type="single" collapsible>
 {filteredFAQs.map((faq) => (
 <AccordionItem key={faq.id} value={faq.id}>
 <AccordionTrigger className="text-left">
 {faq.question}
 </AccordionTrigger>
 <AccordionContent>{faq.answer}</AccordionContent>
 </AccordionItem>
 ))}
 </Accordion>

 {filteredFAQs.length === 0 && (
 <div className="py-12 text-center text-gray-500">
 No questions found in this category yet.
 </div>
 )}
 </Tabs>
 </motion.div>
 </div>
 </section>
 </div>
 )
}
