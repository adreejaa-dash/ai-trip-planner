"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { cn } from "@/lib/utils";

/**
 * Wraps a section in a scroll-reveal container.
 * When the element enters the viewport it gains the "revealed" class
 * which triggers the CSS opacity + translateY transition.
 */
export function RevealSection({
  children,
  className,
  threshold = 0.1,
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRevealOnScroll<HTMLElement>(threshold);
  return (
    // @ts-expect-error — dynamic tag with ref is fine here
    <Tag ref={ref} className={cn("reveal-on-scroll", className)}>
      {children}
    </Tag>
  );
}
