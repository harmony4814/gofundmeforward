"use client";

import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
 icon: LucideIcon;
 title: string;
 description: string;
 action?: {
 label: string;
 href?: string;
 onClick?: () => void;
 };
 className?: string;
}

export default function EmptyState({
 icon: Icon,
 title,
 description,
 action,
 className,
}: EmptyStateProps) {
 return (
 <div
 className={cn(
 "flex flex-col items-center justify-center py-16 text-center",
 className
 )}
 >
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
 <Icon className="h-8 w-8 text-gray-400" />
 </div>
 <h3 className="mt-4 text-lg font-semibold text-gray-900">
 {title}
 </h3>
 <p className="mt-2 max-w-sm text-sm text-gray-500">
 {description}
 </p>
 {action && (
 <div className="mt-6">
 {action.href ? (
 <a href={action.href}>
 <Button className="rounded-full bg-green-500 px-6 text-white hover:bg-green-600">
 {action.label}
 </Button>
 </a>
 ) : (
 <Button
 onClick={action.onClick}
 className="rounded-full bg-green-500 px-6 text-white hover:bg-green-600"
 >
 {action.label}
 </Button>
 )}
 </div>
 )}
 </div>
 );
}
