import Link from "next/link"
import { Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
 "For Campaigners": [
 { label: "Start a Campaign", href: "/create-campaign" },
 { label: "Campaign Tips", href: "/about" },
 { label: "Pricing", href: "/faq" },
 { label: "Success Stories", href: "/#testimonials" },
 ],
 "For Donors": [
 { label: "Browse Campaigns", href: "/categories" },
 { label: "How It Works", href: "/about" },
 { label: "Trust & Safety", href: "/faq" },
 { label: "FAQ", href: "/faq" },
 ],
 Company: [
 { label: "About Us", href: "/about" },
 { label: "Contact", href: "/contact" },
 { label: "Careers", href: "/about" },
 { label: "Blog", href: "/about" },
 ],
 Legal: [
 { label: "Terms of Service", href: "/faq" },
 { label: "Privacy Policy", href: "/faq" },
 { label: "Cookie Policy", href: "/faq" },
 { label: "Accessibility", href: "/faq" },
 ],
}

export function Footer() {
 return (
 <footer className="border-t bg-gray-50">
 <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
 <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
 <div className="col-span-2 md:col-span-1">
 <Link href="/" className="flex items-center gap-2">
 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22c55e]">
 <Heart className="h-5 w-5 text-white" fill="white" />
 </div>
 <span className="text-xl font-bold tracking-tight">FundForward</span>
 </Link>
 <p className="mt-4 text-sm text-gray-500">
 Empowering people to fund what matters. Join millions of generous donors making a difference.
 </p>
 </div>
 {Object.entries(footerLinks).map(([title, links]) => (
 <div key={title}>
 <h3 className="text-sm font-semibold text-gray-900">
 {title}
 </h3>
 <ul className="mt-4 space-y-3">
 {links.map((link) => (
 <li key={link.label}>
 <Link
 href={link.href}
 className="text-sm text-gray-500 transition-colors hover:text-[#22c55e]"
 >
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 <Separator className="my-8" />
 <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
 <p className="text-sm text-gray-500">
 &copy; {new Date().getFullYear()} FundForward. All rights reserved.
 </p>
 </div>
 </div>
 </footer>
 )
}
