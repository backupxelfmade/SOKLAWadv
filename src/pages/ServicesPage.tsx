import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { servicesData } from '../data/servicesData';
import { useServices } from '../hooks/useSiteData'; // ← CHANGED (was '../hooks/useServices')
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { services: dynamicServices, loading, error } = useServices();

  const handleBackToHome = () => navigate(-1);

  const handleServiceClick = (service: any) => {
    const slug = service.slug || service.id;
    navigate(`/services/${slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const services = dynamicServices.length > 0 ? dynamicServices : servicesData;

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* ── Dark header band ── */}
        <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-14">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

            <button
              onClick={handleBackToHome}
              className="group inline-flex items-center gap-2 text-[0.7rem] sm:text-sm font-semibold text-white/50 hover:text-white transition-colors duration-200 mb-6 sm:mb-10"
            >
              <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-6 bg-[#bfa06f]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                What We Do
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Our Legal Services
            </h1>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mt-3 leading-relaxed">
              Comprehensive legal solutions across a broad range of practice areas—expert
              representation tailored to your needs.
            </p>
          </div>
        </div>

        {/* ── Cards section ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-12 lg:py-16">

          {error && (
            <div className="flex items-start gap-3 bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl px-3 py-2.5 mb-4 sm:mb-8 max-w-lg">
              <AlertCircle className="h-3.5 w-3.5 text-[#bfa06f] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#4a4a4a]">Displaying default services. {error}</p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl sm:rounded-3xl bg-[#e8e0d0]"
                  style={{ height: 'clamp(140px, 30vw, 400px)' }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
              {services.map((service: any) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleServiceClick(service);
                    }
                  }}
                  aria-label={`Learn more about ${service.title}`}
                  className="relative overflow-hidden rounded-xl sm:rounded-3xl group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  style={{ height: 'clamp(140px, 30vw, 420px)' }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${service.header_image || service.headerImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent group-hover:from-black/65 transition-all duration-500" />

                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 lg:top-5 lg:right-5">
                    <div className="flex items-center justify-center rounded-full bg-[#bfa06f] group-hover:bg-white transition-colors duration-300 shadow-md
                      w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11">
                      <ArrowRight className="text-white group-hover:text-[#bfa06f] transition-colors duration-300
                        h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    </div>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-2.5 sm:p-5 lg:p-7">
                    <div className="h-0.5 bg-[#d4b483] mb-1.5 sm:mb-2.5 transition-all duration-300
                      w-3 sm:w-5 group-hover:w-5 sm:group-hover:w-8" />
                    <h3
                      className="font-bold leading-tight text-white
                        text-[0.65rem] sm:text-lg lg:text-2xl xl:text-3xl
                        line-clamp-2 sm:line-clamp-none"
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                    >
                      {service.title}
                    </h3>
                    {service.excerpt && (
                      <p
                        className="hidden sm:block text-white/0 group-hover:text-white
                          text-xs sm:text-sm leading-relaxed mt-1.5 max-w-sm
                          max-h-0 group-hover:max-h-12 overflow-hidden
                          transition-all duration-300"
                        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                      >
                        {service.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-xl sm:rounded-3xl border border-transparent group-hover:border-[#bfa06f]/40 transition-all duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServicesPage;
