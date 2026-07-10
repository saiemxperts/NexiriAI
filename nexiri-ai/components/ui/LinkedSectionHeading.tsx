import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface LinkedSectionHeadingProps {
  href: string;
  label: string;
  className?: string;
}

export default function LinkedSectionHeading({
  href,
  label,
  className = "",
}: LinkedSectionHeadingProps) {
  return (
    <Link
      href={href}
      aria-label={`Navigate to ${label.toLowerCase()}`}
      className={`group inline-flex items-end justify-center gap-0 hover:text-blue-500 ${className}`}
    >
      <h2 className="text-2xl font-semibold leading-none">{label}</h2>
      <ChevronRight
        strokeWidth={3}
        className="w-5 h-5 group-hover:text-blue-500"
      />
    </Link>
  );
}