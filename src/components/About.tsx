import React, { useEffect, useRef } from 'react';
import { Users, Award, Clock, TrendingUp, CheckCircle, Star } from 'lucide-react';

const stats = [
  { icon: Clock,       label: 'Years Experience', value: 12,   suffix: '+' },
  { icon: Award,       label: 'Cases Won',         value: 500,  suffix: '+' },
  { icon: Users,       label: 'Happy Clients',     value: 1000, suffix: '+' },
  { icon: TrendingUp,  label: 'Success Rate',      value: 98,   suffix: '%' },
];

const values = [
  'Transparent fees — no surprises',
  'Dedicated advocate for your matter',
  'Registered with the Law Society of Kenya',
  'Serving individuals, SMEs & corporations',
];

const easeOutQuad = (t: number) => t * (2 - t);

const animateCount = (el: HTMLElement, target: number, suffix = '', duration = 2200) => {
  const startTime = performance.now();
  const step = (now: number) => {
    const progress = easeOutQuad(Math.min((now - startTime) / duration, 1));
    el.innerText = `${Math.floor(progress * target)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const els      = entry.target.querySelectorAll('.anim-item');
          const counters = entry.target.querySelectorAll('.count-up');

          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            els.forEach((el, i) => setTimeout(() => el.classList.add('anim-visible'), i * 90));
            counters.forEach((c) =>
              animateCount(
                c as HTMLElement,
                Number(c.getAttribute('data-to')),
                c.getAttribute('data-suffix') || ''
              )
            );
          }
          if (!entry.isIntersecting) {
            hasAnimated = false;
            counters.forEach((c) => { (c as HTMLElement).innerText = '0'; });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About SOKLaw Advocates — Nairobi law firm"
      className="py-10 sm:py-20 lg:py-28 bg-[#f9f7f1] overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

        {/* ── Section header ── */}
        <div className="mb-6 sm:mb-12 lg:mb-14">
          <div className="anim-item flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className="block h-px w-5 sm:w-8 bg-[#bfa06f]" />
            <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
              Who We Are
            </span>
          </div>
          <h2 className="anim-item text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0d2340] leading-tight">
            Kenya's Law Firm Of Choice,<br className="hidden sm:block" /> Integrity & Results
          </h2>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 xl:gap-20 items-center">

          {/* Image col */}
          <div className="anim-item relative">
            <div className="absolute -inset-1.5 sm:-inset-3 rounded-xl sm:rounded-3xl border border-[#bfa06f]/20 pointer-events-none" />
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-2/3 h-2/3 rounded-3xl bg-[#bfa06f]/8 pointer-events-none" />

            <img
              loading="lazy"
              src="https://i.postimg.cc/Px2cZQf5/7-X2-A2923-1.jpg"
              alt="SOK Law Associates advocates working in Nairobi office — Kenya legal team"
              className="relative w-full object-cover shadow-md sm:shadow-lg rounded-lg sm:rounded-2xl h-[200px] sm:h-[380px] lg:h-[480px]"
              style={{ objectPosition: 'center 30%' }}
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
                if (t.parentElement) {
                  t.parentElement.style.background = 'linear-gradient(135deg,#bfa06f 0%,#8b7355 100%)';
                  t.parentElement.style.minHeight = '200px';
                  t.parentElement.style.borderRadius = '0.75rem';
                }
              }}
            />

            {/* Est. badge */}
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 lg:-bottom-5 lg:left-8 z-10 bg-white rounded-lg sm:rounded-xl shadow-md px-2.5 sm:px-4 py-1.5 sm:py-3 flex items-center gap-2 border border-[#e8e0d0]">
              <div className="flex items-center justify-center w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#bfa06f]/10 flex-shrink-0">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-[#0d2340] leading-tight">Est. 2014</p>
                <p className="text-[8px] sm:text-[10px] text-[#6a6a6a] leading-tight">12+ years of practice</p>
              </div>
            </div>

            {/* 5-star badge */}
            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[#e8e0d0]">
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-[#bfa06f] fill-[#bfa06f]" />
                ))}
              </div>
              <p className="text-[8px] sm:text-[10px] font-semibold text-[#0d2340]">Client rated</p>
            </div>
          </div>

          {/* Content col */}
          <div className="space-y-4 sm:space-y-7">

            {/* Body copy */}
            <div className="anim-item space-y-2 sm:space-y-4">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#0d2340]">
                Excellence in Legal Practice Since 2014
              </h3>
              <p className="text-[#4a4a4a] leading-relaxed text-xs sm:text-base">
                SOKLaw Advocates has been at the forefront of legal practice in Kenya,
                providing comprehensive legal solutions to individuals, corporations, and
                institutions. Our commitment to excellence, integrity, and client
                satisfaction has made us one of the most trusted law firms in the region.
              </p>
              <p className="hidden sm:block text-[#4a4a4a] leading-relaxed text-base">
                We combine deep legal expertise with innovative approaches to deliver
                outstanding results. Our experienced team specialises in a broad range
                of practice areas, handling complex matters with precision and care.
              </p>
            </div>

            {/* Value checklist */}
            <div className="anim-item grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {values.map((v) => (
                <div key={v} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#bfa06f] flex-shrink-0 mt-0.5" />
                  <span className="text-[0.65rem] sm:text-xs text-[#4a4a4a] leading-snug">{v}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="anim-item h-px w-full bg-[#e8e0d0]" />

            {/* Stats grid */}
            <div className="grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="anim-item group bg-white border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-lg sm:rounded-2xl p-2.5 sm:p-5 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="hidden sm:flex items-center mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#bfa06f]/10 group-hover:bg-[#bfa06f]/20 transition-colors duration-200">
                        <Icon className="h-4 w-4 text-[#bfa06f]" />
                      </div>
                    </div>
                    <div
                      className="count-up text-base sm:text-2xl md:text-3xl font-bold text-[#0d2340] leading-none mb-0.5 sm:mb-1"
                      data-to={stat.value}
                      data-suffix={stat.suffix}
                    >
                      0
                    </div>
                    <div className="text-[9px] sm:text-xs text-[#6a6a6a] font-medium leading-tight">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .anim-item {
          opacity: 0;
          transform: translateY(16px);
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

export default About;
