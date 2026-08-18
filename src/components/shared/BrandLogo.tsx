import Image from "next/image"

export function BrandLogo({ className = "h-16 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/new-logo.png"
      alt="gofundme"
      width={269}
      height={148}
      className={className}
    />
  )
}
