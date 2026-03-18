import React, { useEffect, useRef } from 'react';
import { Shield, Users, Lightbulb, Award } from 'lucide-react';

const stats = [
  { num: '12', suffix: '+', label: 'Years of practice' },
  { num: '98', suffix: '%', label: 'Case success rate' },
  { num: '1K', suffix: '+', label: 'Satisfied clients' },
  { num: '10', suffix: '',  label: 'Practice areas'   },
];

const pillars = [
  {
    icon: Shield,
    title: 'Proven Legal Expertise',
    body: 'Deep knowledge across 14 practice areas — from commercial litigation to family succession — grounded in 12+ years of Kenyan legal practice.',
  },
  {
    icon: Users,
    title: 'Personalised Strategy',
    body: 'Every mandate gets a bespoke approach built around your circumstances and goals. No templates — only counsel that truly fits.',
  },
  {
    icon: Lightbulb,
    title: 'Integrity & Transparency',
    body: 'Clear communication on fees, strategy, and outcomes. We hold ourselves to the highest ethical standards in every engagement.',
  },
  {
    icon: Award,
    title: 'End-to-End Representation',
    body: 'From initial consultation through final resolution, your dedicated attorney manages every step so you can focus on what matters.',
  },
];

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-item').forEach((el, i) => {
              setTimeout(() => el.classList.add('anim-visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 lg:py-28 bg-[#f9f7f1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="anim-item flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-12 lg:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-8 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                Our Difference
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0d2340] leading-tight">
              Why Choose Us
            </h2>
          </div>
          <p className="hidden sm:block text-sm text-[#6a6a6a] max-w-xs leading-relaxed sm:text-right">
            Trusted by individuals, corporations, and institutions across Kenya.
          </p>
        </div>

        {/* ── Stat strip ── */}
        <div className="anim-item grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#e8e0d0] rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 lg:mb-14 border border-[#e8e0d0]">
          {stats.map(({ num, suffix, label }) => (
            <div
              key={label}
              className="bg-white hover:bg-[#faf8f4] transition-colors px-4 sm:px-6 py-4 sm:py-6 group"
            >
              <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d2340] leading-none mb-1 sm:mb-1.5">
                {num}<span className="text-[#bfa06f]">{suffix}</span>
              </div>
              <p className="text-[0.58rem] sm:text-xs text-[#6a6a6a] font-medium uppercase tracking-widest">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Content — image + feature grid ── */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-stretch">

          {/* Image */}
          <div
            className="anim-item relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#e8e0d0]"
            style={{ minHeight: 'clamp(240px, 52vw, 520px)' }}
          >
            <img
              src="https://i.postimg.cc/Px2cZQf5/7-X2-A2923-1.jpg"
              alt="SOK Law Team"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 25%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2340]/90 via-[#0d2340]/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-7">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="block h-px w-4 bg-[#bfa06f] flex-shrink-0" />
                <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                  Established 2014
                </span>
              </div>
              <h3 className="text-white font-bold text-sm sm:text-xl lg:text-2xl leading-tight">
                A Legacy of Legal Excellence
              </h3>
              <p className="hidden sm:block text-white/65 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-sm">
                Over 12+ years serving individuals, corporations, and institutions across
                Kenya with integrity, precision, and unwavering commitment.
              </p>
            </div>
          </div>

          {/* Feature cards 2×2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 content-start">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="anim-item group bg-white border border-[#e8e0d0] hover:border-[#bfa06f]/40 hover:shadow-[0_4px_20px_rgba(191,160,111,0.10)] rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#bfa06f]/10 group-hover:bg-[#bfa06f]/20 transition-colors mb-3 sm:mb-3.5 flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#bfa06f]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0d2340] mb-1.5 leading-snug">
                  {title}
                </h3>
                <p className="text-[0.63rem] sm:text-xs text-[#6a6a6a] leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .anim-item {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease-out, transform 0.55s ease-out;
        }
        .anim-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
