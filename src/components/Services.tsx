import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { useServices } from '../hooks/useSiteData';  // ← CHANGED (was ../hooks/useServices)
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { services: dynamicServices, loading, error } = useServices();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.service-card').forEach((card, i) => {
              setTimeout(() => card.classList.add('animate-fade-in-up'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleViewAllServices = () => {
    navigate('/services');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleServiceClick = (service: any) => {
    navigate(`/services/${service.slug || service.id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const servicesToDisplay = dynamicServices.length > 0 ? dynamicServices : servicesData;

  return (
    <section ref={sectionRef} id="services" className="py-14 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

        {/* ── Section header ── */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-6 bg-[#bfa06f]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                What We Do
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
              Our Legal Services
            </h2>
          </div>

          <button
            onClick={handleViewAllServices}
            className="hidden sm:flex items-center gap-2 self-end text-sm font-semibold text-[#bfa06f] hover:text-[#a08a5f] transition-colors duration-200 group pb-1 border-b border-[#bfa06f]/40 hover:border-[#a08a5f] whitespace-nowrap"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className="hidden sm:block text-base text-[#4a4a4a] max-w-2xl mb-8 leading-relaxed">
          Comprehensive legal solutions across a broad range of practice areas—expert
          representation tailored to your needs.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-xs">
              Note: Displaying default services. {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl bg-[#f9f7f1] animate-pulse"
                style={{ height: 'clamp(160px, 25vw, 480px)' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {servicesToDisplay.slice(0, 4).map((service, i) => (
              <div
                key={service.id || i}
                onClick={() => handleServiceClick(service)}
                className="service-card opacity-0 relative group overflow-hidden cursor-pointer transition-all duration-300 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl"
                style={{ height: 'clamp(160px, 25vw, 480px)' }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.header_image || (service as any).headerImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 group-hover:from-black/95 transition-all duration-300" />

                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10">
                  <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#bfa06f] flex items-center justify-center shadow-md group-hover:bg-[#a08a5f] transition-colors duration-200">
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 z-10 p-3 sm:p-5 lg:p-6">
                  <div className="w-4 sm:w-5 h-0.5 bg-[#bfa06f] mb-1.5 sm:mb-2.5 transition-all duration-300 group-hover:w-7 sm:group-hover:w-9" />
                  <h3 className="service-title text-xs sm:text-base lg:text-xl font-bold leading-snug line-clamp-2">
                    {service.title}
                  </h3>
                  <div className="learn-more hidden sm:flex items-center gap-1.5 mt-2.5 text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                    <span>Learn more</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-transparent group-hover:border-[#bfa06f]/30 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 sm:mt-10 flex justify-center sm:hidden">
          <button
            onClick={handleViewAllServices}
            className="flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-md transition-all duration-200 group w-full max-w-xs"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .service-card .service-title {
          color: #ffffff !important;
          text-shadow: 0 2px 12px rgba(0,0,0,0.9);
        }
        .service-card .learn-more {
          color: #bfa06f !important;
        }
      `}</style>
    </section>
  );
};

export default Services;
