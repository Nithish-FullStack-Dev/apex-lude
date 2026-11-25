"use client";

import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
import { APEX_CONTACT, PRODUCT_CATEGORIES } from "../../data/apexData";
import { useEffect, useState } from "react";

interface FooterProps {
  onSelectProduct: (productId: string) => void;
}

export function Footer({ onSelectProduct }: FooterProps) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] text-[var(--color-light-grey)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Summary */}
          <div className="lg:col-span-4">
            <a href="#hero" className="inline-flex items-center gap-2.5">
              <img src="/assets/images/logo.jpg" className="w-[50px]" />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {APEX_CONTACT.legalName} — Precision-blended automotive,
              commercial, and industrial lubricants manufactured in the United
              Arab Emirates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 font-mono-tech text-xs text-slate-400">
              <span>ISO 9001:2015</span>
              <span aria-hidden="true">·</span>
              <span>ISO 14001:2015</span>
              <span aria-hidden="true">·</span>
              <span>ISO 45001:2018</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-mono-tech text-xs font-medium tracking-wider text-white uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-display">
              <li>
                <a
                  href="#hero"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#technology"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#industries"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Industries
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  About Apex
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-mono-tech text-xs font-medium tracking-wider text-white uppercase">
              Product Ranges
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#products"
                    onClick={() => onSelectProduct(cat.id)}
                    className="text-slate-400 transition-colors hover:text-white font-display"
                  >
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified UAE Locations & Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-mono-tech text-xs font-medium tracking-wider text-white uppercase">
              UAE Headquarters & Plant
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-400 font-display">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-industrial-orange)]" />
                <span>
                  <strong className="text-slate-200">Dubai Office:</strong>{" "}
                  {APEX_CONTACT.dubaiOffice}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-industrial-orange)]" />
                <span>
                  <strong className="text-slate-200">Ajman Plant:</strong>{" "}
                  {APEX_CONTACT.ajmanFactory}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`tel:${APEX_CONTACT.phone}`}
                  className="font-mono-tech text-slate-200 hover:text-white"
                >
                  {APEX_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="font-mono-tech text-slate-300">
                  WhatsApp: {APEX_CONTACT.whatsapp}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${APEX_CONTACT.email}`}
                  className="text-slate-200 hover:text-white"
                >
                  {APEX_CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {currentYear ?? "2026"} {APEX_CONTACT.legalName}. All rights
            reserved.
          </p>
          <p className="font-mono-tech">
            Winning Through Engine Protection · Synthetically Engineered
          </p>
        </div>
      </div>
    </footer>
  );
}
