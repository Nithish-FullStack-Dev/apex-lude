"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  ariaLabel,
  type = "button",
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    setOffset({
      x: Math.max(-7, Math.min(7, dx)),
      y: Math.max(-7, Math.min(7, dy)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)] cursor-pointer";

  const variantStyles =
    variant === "primary"
      ? "bg-[var(--color-industrial-orange)] text-[var(--color-light-grey)] hover:bg-[var(--color-industrial-orange)]/90 border border-[var(--color-industrial-orange)]/40"
      : variant === "secondary"
        ? "bg-[var(--color-charcoal)] text-[var(--color-light-grey)] border border-[var(--color-light-grey)]/20 hover:border-[var(--color-industrial-orange)]/45 hover:bg-[var(--color-charcoal)]"
        : "text-[var(--color-light-grey)] hover:text-[var(--color-industrial-orange)] border border-transparent hover:border-[var(--color-industrial-orange)]/20";

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)"
        : "none",
  };

  if (href) {
    return (
      <a
        ref={btnRef}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}
