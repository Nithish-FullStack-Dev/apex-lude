"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { APEX_CONTACT, PRODUCT_CATEGORIES } from "../../data/apexData";
import {
  validateContactInquiry,
  type ContactInquiryInput,
} from "../../utils/apexLogic";
import { ContactDropletScene } from "../three/ContactDropletScene";
import { MagneticButton } from "../ui/MagneticButton";

interface ContactSectionProps {
  preselectedProductTitle: string | null;
  reducedMotion: boolean;
}

export function ContactSection({
  preselectedProductTitle,
  reducedMotion,
}: ContactSectionProps) {
  const [form, setForm] = useState<ContactInquiryInput>({
    name: "",
    email: "",
    company: "",
    category: PRODUCT_CATEGORIES[0].title,
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactInquiryInput, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedProductTitle) {
      setForm((prev) => ({
        ...prev,
        category: preselectedProductTitle,
        message:
          prev.message.trim().length > 0
            ? prev.message
            : `Requesting technical specifications and availability for ${preselectedProductTitle}.`,
      }));
      setSubmitted(false);
    }
  }, [preselectedProductTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactInquiry(form);
    if (!result.valid) {
      setErrors(result.errors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Dramatic CTA + 3D Oil Droplet */}
          <div className="min-w-0 lg:col-span-6">
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
              Direct Technical &amp; Export Desk
            </p>
            <h2
              className="mt-3 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white uppercase sm:text-6xl"
              style={{ textWrap: "balance" }}
            >
              Let&apos;s Keep
              <br />
              The World{" "}
              <span className="text-[var(--color-industrial-orange)]">
                Moving.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
              Discover lubrication solutions designed for automotive, commercial
              and industrial performance. Reach our Dubai and Ajman engineering
              desk directly.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton href="#products" variant="secondary">
                <span>Explore Products</span>
              </MagneticButton>
              <a
                href={`mailto:${APEX_CONTACT.email}`}
                className="inline-flex items-center gap-2 border border-white/15 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-white/40 hover:text-white"
              >
                <Mail className="h-4 w-4 text-[var(--color-industrial-orange)]" />
                <span>{APEX_CONTACT.email}</span>
              </a>
              <a
                href={`tel:${APEX_CONTACT.phone}`}
                className="inline-flex items-center gap-2 font-mono-tech text-sm text-slate-300 hover:text-white"
              >
                <Phone className="h-4 w-4 text-[var(--color-industrial-orange)]" />
                <span>{APEX_CONTACT.phone}</span>
              </a>
            </div>

            <div className="mt-8 h-60 w-full max-w-md border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)]">
              <ContactDropletScene reducedMotion={reducedMotion} />
            </div>
          </div>

          {/* Right Validated Technical Inquiry Form */}
          <div className="border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] p-6 sm:p-8 lg:col-span-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-display text-2xl font-bold tracking-wide text-white uppercase">
                Contact Apex
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Request product datasheets, OEM grade guidance, or bulk supply
                pricing.
              </p>
            </div>

            {submitted ? (
              <div
                role="status"
                className="mt-6 border border-[var(--color-industrial-orange)]/30 bg-[var(--color-charcoal)] p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-industrial-orange)]" />
                  <div>
                    <h4 className="font-semibold text-white">
                      Inquiry Prepared for {form.name}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                      Your request regarding{" "}
                      <strong className="text-white">{form.category}</strong>{" "}
                      has been validated. Our team responds via{" "}
                      <span className="font-mono-tech text-[var(--color-industrial-orange)]">
                        {APEX_CONTACT.email}
                      </span>{" "}
                      and{" "}
                      <span className="font-mono-tech text-[var(--color-industrial-orange)]">
                        {APEX_CONTACT.phone}
                      </span>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: "",
                          email: "",
                          company: "",
                          category: PRODUCT_CATEGORIES[0].title,
                          message: "",
                        });
                      }}
                      className="mt-4 border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:border-white/40"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Tariq Al Mansoori"
                      className="mt-1.5 w-full border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-light-grey)] placeholder:text-[var(--color-light-grey)]/60 focus:border-[var(--color-industrial-orange)] focus:outline-none"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-[var(--color-industrial-orange)]">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Business Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="name@company.com"
                      className="mt-1.5 w-full border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-light-grey)] placeholder:text-[var(--color-light-grey)]/60 focus:border-[var(--color-industrial-orange)] focus:outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-[var(--color-industrial-orange)]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-company"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Company / Fleet
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="Optional organization name"
                      className="mt-1.5 w-full border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-light-grey)] placeholder:text-[var(--color-light-grey)]/60 focus:border-[var(--color-industrial-orange)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-category"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Product Category
                    </label>
                    <select
                      id="contact-category"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="mt-1.5 w-full border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-light-grey)] focus:border-[var(--color-industrial-orange)] focus:outline-none"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Technical / Supply Requirements *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Specify viscosity grade, API/ISO standard, or container packaging required..."
                    className="mt-1.5 w-full border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] px-3.5 py-2.5 text-sm text-[var(--color-light-grey)] placeholder:text-[var(--color-light-grey)]/60 focus:border-[var(--color-industrial-orange)] focus:outline-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-[var(--color-industrial-orange)]">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 bg-[var(--color-industrial-orange)] px-6 py-3.5 text-sm font-semibold tracking-wider text-[var(--color-charcoal)] uppercase transition-colors hover:bg-[var(--color-industrial-orange)]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
                >
                  <span>Submit Inquiry</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
