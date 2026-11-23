import { ShieldCheck } from 'lucide-react';
import { APEX_CONTACT, CERTIFICATIONS } from '../../data/apexData';

export function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
              Heritage &amp; Standards · UAE
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white uppercase sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Built on Quality.
              <br />
              Driven by <span className="text-[var(--color-industrial-orange)]">Trust.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Headquartered in Dubai with dedicated automated manufacturing in Ajman,{' '}
              {APEX_CONTACT.legalName} supplies automotive, commercial, and industrial lubricants
              across the United Arab Emirates, Middle East, Africa, and international export
              markets.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-400">
              <div>
                <span className="font-mono-tech font-semibold text-white uppercase">
                  Corporate Office
                </span>
                <p className="mt-1">{APEX_CONTACT.dubaiOffice}</p>
              </div>
              <div>
                <span className="font-mono-tech font-semibold text-white uppercase">
                  Blending Plant
                </span>
                <p className="mt-1">{APEX_CONTACT.ajmanFactory}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.code}
                className="flex flex-col justify-between border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-sm font-semibold text-[var(--color-industrial-orange)]">
                      {cert.code}
                    </span>
                    <ShieldCheck className="h-5 w-5 text-[var(--color-industrial-orange)]" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-wide text-white uppercase">
                    {cert.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{cert.scope}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
