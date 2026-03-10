import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Phone, Shield, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image:          'https://npovpviamzjxlydkpulo.supabase.co/storage/v1/object/public/gallery/SOKLAW%20PHOTOS%202026%20(3).jpg',
    position:       'center 30%',
    mobilePosition: 'center 20%',
    alt:            'SOKLaw Advocates senior advocates in Nairobi office',
  },
  {
    image:          'https://i.postimg.cc/0NGHt0hF/7X2A2913-(1).jpg',
    position:       'center 30%',
    mobilePosition: 'center 15%',
    alt:            'SOKLaw Advocates legal team consultation session Nairobi',
  },
  {
    image:          'https://i.postimg.cc/Wzd9ZRf5/7X2A2982.jpg',
    position:       'center 50%',
    mobilePosition: 'center 30%',
    alt:            'SOKLaw Advocates advocates serving clients in Kenya',
  },
];

const trustBadges = [
  { icon: Shield,      text: 'Law Society of Kenya — Registered' },
  { icon: Clock,       text: 'Response within 24 hours'          },
  { icon: CheckCircle, text: 'Confidential & no obligation'      },
];

const schemaMarkup = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'SOKLaw Advocates',
  alternateName: 'Simiyu, Opondo, Kiranga & Advocates',
  description: 'Leading Nairobi law firm providing expert legal representation in litigation, corporate law, real estate, family law, and 14 other practice areas since 2009.',
  url: 'https://soklaw.co.ke',
  telephone: '+254705263776',
  email: 'Info@soklaw.co.ke',
  foundingDate: '2009',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Upperhill Gardens, Block D11, 3rd Ngong Avenue',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  areaServed: { '@type': 'Country', name: 'Kenya' },
  priceRange: '$$',
};

const stagger = (i: number, base = 120) => ({
  animationDelay: `${i * base}ms`,
  animationFillMode: 'both' as const,
});

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(slides.map(() => false));
  const [mounted, setMounted]           = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(schemaMarkup);
    s.id   = 'sok-law-schema';
    if (!document.getElementById('sok-law-schema')) document.head.appendChild(s);
    return () => { document.getElementById('sok-law-schema')?.remove(); };
  }, []);

  useEffect(() => {
    slides.forEach((slide, i) => {
      const img = new Image();
      img.onload = () => setImagesLoaded(p => { const n = [...p]; n[i] = true; return n; });
      img.src = slide.image;
    });
  }, []);

  const startTimer = () => {
    intervalRef.current = setInterval(
      () => setCurrentSlide(p => (p + 1) % slides.length), 5500
    );
  };
  useEffect(() => { startTimer(); return () => clearInterval(intervalRef.current!); }, []);

  const goTo = (i: number) => {
    clearInterval(intervalRef.current!);
    setCurrentSlide(i);
    startTimer();
  };

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  };

  const handleConsultation = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section
      id="home"
      aria-label="SOKLaw Advocates — Nairobi's trusted legal representation"
      className="relative w-full overflow-hidden flex flex-col justify-end"
      style={{ height: '100svh', minHeight: '580px', maxHeight: '960px' }}
    >
      {/* ── Background slides ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {!imagesLoaded[i] && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d2340] to-[#1a3a5c]" />
          )}
          <img
            src={slide.image}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover ${
              i === currentSlide ? 'ken-burns' : ''
            }`}
            style={{ objectPosition: slide.position }}
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      ))}

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040f1e]/80 via-[#040f1e]/40 to-[#040f1e]/20 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040f1e]/40 via-transparent to-transparent z-10" />

      {/* Tap zones */}
      <button onClick={() => goTo((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-0 top-0 w-1/3 h-[75%] z-20 opacity-0 touch-manipulation" aria-label="Previous slide" />
      <button onClick={() => goTo((currentSlide + 1) % slides.length)}
        className="absolute right-0 top-0 w-1/3 h-[75%] z-20 opacity-0 touch-manipulation" aria-label="Next slide" />

      {/* ── Main content ── */}
      <div className="relative z-30 w-full px-5 sm:px-10 lg:px-16 pb-14 sm:pb-18 lg:pb-24">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div
            className={`flex items-center gap-2.5 mb-5 sm:mb-6 ${mounted ? 'hero-fade-up' : 'opacity-0'}`}
            style={stagger(0, 100)}
          >
            <span className={`block h-px bg-[#bfa06f] flex-shrink-0 ${mounted ? 'draw-line' : 'w-0'}`} />
            <span className="text-[0.62rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#bfa06f]">
              Nairobi's Trusted Legal Advocates
            </span>
          </div>

          {/* H1 line 1 — gold */}
          <div
            className={`overflow-hidden mb-1 ${mounted ? 'hero-fade-up' : 'opacity-0'}`}
            style={stagger(1)}
          >
            <h1
              className="font-black text-[1.65rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.12] gold-shimmer"
              style={{ textShadow: '0 2px 32px rgba(0,0,0,0.5)' }}
            >
              When the Stakes Are High,
            </h1>
          </div>

          {/* H1 line 2 — gold */}
          <div
            className={`overflow-hidden mb-5 sm:mb-6 ${mounted ? 'hero-fade-up' : 'opacity-0'}`}
            style={stagger(2)}
          >
            <h1
              className="font-black text-[1.65rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.12] gold-shimmer"
              style={{ textShadow: '0 2px 32px rgba(0,0,0,0.5)' }}
            >
              You Need the Right Advocate.
            </h1>
          </div>

          {/* Subtext */}
          <p
            className={`text-white/70 text-[0.8rem] sm:text-base md:text-lg max-w-lg leading-relaxed mb-3 sm:mb-4 ${
              mounted ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={{ ...stagger(3), textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}
          >
            Don't navigate Kenya's legal system alone. SOKLaw delivers
            strategic, battle-tested representation across litigation,
            corporate, real estate, family law, and more.
          </p>

          {/* Micro social proof */}
          <p
            className={`text-[#bfa06f]/90 text-[0.65rem] sm:text-sm font-semibold tracking-wide mb-8 sm:mb-10 ${
              mounted ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={stagger(4)}
          >
            1,000+ clients protected &nbsp;·&nbsp; 98% success rate &nbsp;·&nbsp; 15 years in practice
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 sm:mb-10 ${
              mounted ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={stagger(5)}
          >
            <button
              onClick={handleConsultation}
              className="group flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white font-bold text-sm sm:text-[0.95rem] px-6 sm:px-8 py-3.5 rounded-full shadow-[0_4px_28px_rgba(191,160,111,0.38)] hover:shadow-[0_6px_36px_rgba(191,160,111,0.5)] transition-all duration-200"
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>

            <a
              href="tel:+254705263776"
              style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
              className="group flex items-center justify-center gap-2 border border-white/25 hover:border-white/55 hover:bg-white/10 hover:!text-white font-semibold text-sm sm:text-[0.95rem] px-6 sm:px-8 py-3.5 rounded-full backdrop-blur-sm transition-all duration-200"
            >
              <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#bfa06f' }} />
              <span>+254 705 263 776</span>
            </a>
          </div>

          {/* Trust badges */}
          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 ${
              mounted ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={stagger(6)}
          >
            {trustBadges.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#bfa06f] flex-shrink-0" />
                <span
                  className="text-[0.58rem] sm:text-[0.7rem] text-white/55 font-medium"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 sm:bottom-7 right-5 sm:right-10 lg:right-16 z-30 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === currentSlide}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-7 bg-[#bfa06f]' : 'w-2.5 bg-white/30 hover:bg-white/55'
            }`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 opacity-35 hover:opacity-60 transition-opacity cursor-pointer"
        onClick={() => scrollTo('#about')}
      >
        <span className="text-[0.48rem] text-white uppercase tracking-[0.22em] font-semibold">Scroll</span>
        <div className="w-px h-5 sm:h-7 bg-white/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-[#bfa06f] animate-scroll-line" style={{ height: '40%' }} />
        </div>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-fade-up {
          animation: heroFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes drawLine {
          from { width: 0;      }
          to   { width: 2.5rem; }
        }
        .draw-line {
          animation: drawLine 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .gold-shimmer {
          color: #bfa06f;
          background: linear-gradient(
            105deg,
            #bfa06f 0%,
            #bfa06f 38%,
            #e8c97a 50%,
            #bfa06f 62%,
            #bfa06f 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear 1.2s 1 forwards;
        }
        @supports not (-webkit-text-fill-color: transparent) {
          .gold-shimmer { color: #bfa06f; background: none; }
        }

        @keyframes kenBurns {
          from { transform: scale(1.06); }
          to   { transform: scale(1.0);  }
        }
        .ken-burns {
          animation: kenBurns 6s ease-out forwards;
        }

        @keyframes scrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%);  }
        }
        .animate-scroll-line { animation: scrollLine 1.8s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default Hero;
