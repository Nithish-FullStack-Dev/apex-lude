"use client";

import { useState } from "react";
import { ShieldCheck, Award, Scale, Plus, Minus } from "lucide-react";

const TABS = ["What do we do?", "Certifications"];

const ACCORDIONS = [
  {
    title: "Quality",
    icon: ShieldCheck,
    content:
      "A personal and professional commitment to proactively protecting the well-being of our employees, our contractors, our customers and the people of the communities in which we operate.",
  },
  {
    title: "OEM Approvals",
    icon: Award,
    content:
      "A personal and professional commitment to proactively protecting the well-being of our employees, our contractors, our customers and the people of the communities in which we operate.",
  },
  {
    title: "Values, Vision & Mission",
    icon: Scale,
    content:
      "I am text block. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
];

export function CompanyValuesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(0);

  return (
    <section className="border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* LEFT: TABS AND CONTENT */}
          <div>
            <div className="flex border-b border-[var(--color-industrial-orange)]">
              {TABS.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`border border-b-0 px-7 py-5 text-sm font-medium transition-all duration-300 sm:text-base font-display ${
                    activeTab === index
                      ? "border-[var(--color-industrial-orange)] bg-[var(--color-industrial-orange)] text-[var(--color-charcoal)]"
                      : "border-[var(--color-light-grey)]/20 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pt-5 text-base leading-[1.85] text-slate-300 sm:text-lg">
              {activeTab === 0 ? (
                <>
                  <p>
                    We believe in building to positively impact communities,
                    infrastructure, the economy, opportunity and employment. We
                    take great pride in being proactive with our approach to
                    projects, while ensuring that the best interests of the
                    stakeholders are represented at every stage.
                  </p>

                  <p className="mt-6">
                    We are serious about our values. And in the context of those
                    values we can tackle your whole project in a comprehensive
                    customer focused way or a portion thereof.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    We are serious about our values. And in the context of those
                    values we can tackle your whole project in a comprehensive
                    customer focused way or a portion thereof.
                  </p>

                  <p className="mt-6">
                    We believe in building to positively impact communities,
                    infrastructure, the economy, opportunity and employment. We
                    take great pride in being proactive with our approach to
                    projects, while ensuring that the best interests of the
                    stakeholders are represented at every stage.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: ACCORDION */}
          <div className="space-y-0">
            {ACCORDIONS.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeAccordion === index;

              return (
                <div
                  key={item.title}
                  className="border border-b-0 border-[var(--color-light-grey)]/15 last:border-b"
                >
                  <button
                    onClick={() => setActiveAccordion(isActive ? -1 : index)}
                    aria-expanded={isActive}
                    className={`flex w-full items-center justify-between px-6 py-[17px] text-left transition-all duration-300 sm:px-10  ${
                      isActive
                        ? "bg-[var(--color-industrial-orange)] text-[var(--color-charcoal)]"
                        : "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-5">
                      <Icon className="h-6 w-6 shrink-0" strokeWidth={2.5} />

                      <span className="text-base font-medium sm:text-xl font-display">
                        {item.title}
                      </span>
                    </span>

                    {isActive ? (
                      <Minus className="h-5 w-5 shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 shrink-0" />
                    )}
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 py-5 text-base leading-[1.8] text-slate-300 sm:px-7 sm:text-lg">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
