"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Target, Users, Globe, Shield, Lightbulb, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const team = [
 { name: "Emily Carter", role: "CEO & Co-Founder", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
 { name: "Michael Zhang", role: "CTO & Co-Founder", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
 { name: "Sarah Okafor", role: "Head of Community", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
 { name: "James Rodriguez", role: "Head of Marketing", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
 { name: "Aisha Patel", role: "Head of Design", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" },
 { name: "David Kim", role: "Head of Engineering", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
]

const values = [
 { icon: Heart, title: "Compassion", description: "We believe in the power of empathy and generosity to transform lives and communities." },
 { icon: Shield, title: "Trust & Transparency", description: "Every campaign is verified. Every dollar is tracked. We maintain the highest standards of integrity." },
 { icon: Globe, title: "Global Impact", description: "We connect people across borders, enabling support for causes in over 200 countries." },
 { icon: Lightbulb, title: "Innovation", description: "We continuously improve our platform to make fundraising more accessible and effective." },
 { icon: Users, title: "Community", description: "We foster a global community of givers who inspire and support one another." },
 { icon: Target, title: "Accountability", description: "We hold ourselves to the highest standards and ensure funds reach their intended purpose." },
]

export default function AboutPage() {
 return (
 <div className="min-h-screen">
 {/* Hero */}
 <section className="relative overflow-hidden bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] py-24 sm:py-32">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="text-center">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <Badge className="mb-6 border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]">Our Story</Badge>
 </motion.div>
 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
 >
 Making the World a Better Place,
 <br />
 <span className="text-[#22c55e]">One Campaign at a Time</span>
 </motion.h1>
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="mx-auto mt-6 max-w-3xl text-lg text-gray-300"
 >
 FundForward was founded in 2020 with a simple mission: to connect people who want to
 help with the people who need it most. Today, we&apos;ve helped raise over $2 billion for
 causes that matter.
 </motion.p>
 </div>
 </div>
 </section>

 {/* Mission */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid items-center gap-12 lg:grid-cols-2">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <h2 className="text-3xl font-bold sm:text-4xl">Our Mission</h2>
 <p className="mt-6 text-lg text-gray-600">
 We believe that everyone deserves the chance to pursue their dreams and that no one
 should face hardship alone. FundForward empowers individuals, communities, and
 organizations to raise funds for the causes that matter most to them.
 </p>
 <p className="mt-4 text-gray-600">
 Through our platform, we provide the tools, resources, and global network needed to
 turn compassion into action. From medical emergencies to educational initiatives, from
 disaster relief to creative projects, we are the bridge between those who need help
 and those who want to give it.
 </p>
 <div className="mt-8 grid grid-cols-2 gap-6">
 {[
 { value: "$2B+", label: "Total Raised" },
 { value: "500K+", label: "Campaigns Funded" },
 { value: "150M+", label: "Total Donations" },
 { value: "200+", label: "Countries" },
 ].map((stat) => (
 <div key={stat.label}>
 <div className="text-2xl font-bold text-[#22c55e]">{stat.value}</div>
 <div className="text-sm text-gray-500">{stat.label}</div>
 </div>
 ))}
 </div>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="relative"
 >
 <div className="aspect-[4/3] overflow-hidden rounded-2xl">
 <Image
 src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"
 alt="People collaborating"
 width={800}
 height={600}
 className="h-full w-full object-cover"
 />
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* Values */}
 <section className="bg-gray-50 py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <h2 className="text-3xl font-bold sm:text-4xl">Our Values</h2>
 <p className="mt-3 text-gray-500">
 The principles that guide everything we do
 </p>
 </motion.div>
 <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {values.map((value, i) => (
 <motion.div
 key={value.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.05 }}
 >
 <Card className="h-full transition-all hover:shadow-md">
 <CardContent className="p-6">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10">
 <value.icon className="h-6 w-6 text-[#22c55e]" />
 </div>
 <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
 <p className="mt-2 text-sm text-gray-500">
 {value.description}
 </p>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Team */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center"
 >
 <h2 className="text-3xl font-bold sm:text-4xl">Meet Our Team</h2>
 <p className="mt-3 text-gray-500">
 The passionate people behind FundForward
 </p>
 </motion.div>
 <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
 {team.map((member, i) => (
 <motion.div
 key={member.name}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.05 }}
 >
 <Card className="text-center transition-all hover:shadow-md">
 <CardContent className="p-6">
 <Image
 src={member.avatar}
 alt={member.name}
 width={96}
 height={96}
 className="mx-auto h-24 w-24 rounded-full object-cover"
 />
 <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
 <p className="text-sm text-[#22c55e]">{member.role}</p>
 </CardContent>
 </Card>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="bg-gray-50 py-16">
 <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
 <h2 className="text-3xl font-bold sm:text-4xl">Join Us in Making a Difference</h2>
 <p className="mx-auto mt-4 max-w-xl text-gray-500">
 Whether you want to start a campaign or support a cause, we&apos;re here to help you make
 an impact.
 </p>
 <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
 <Link href="/create-campaign">
 <Button size="lg" className="bg-[#22c55e] text-white hover:bg-[#16a34a]">
 Start a Campaign
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 <Link href="/contact">
 <Button size="lg" variant="outline">
 Contact Us
 </Button>
 </Link>
 </div>
 </div>
 </section>
 </div>
 )
}
