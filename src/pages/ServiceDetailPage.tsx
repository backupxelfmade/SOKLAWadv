import React, { useState, useMemo } from 'react';          // ← removed useEffect
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { servicesData } from '../data/servicesData';
import { useServices } from '../hooks/useSiteData';          // ← CHANGED
import { ArrowLeft, ArrowRight, CheckCircle, Phone, Mail, Loader2, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';

const Section = ({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e8e0d0] last:border-0 w-full overflow-hidden">
      <button
        className="sm:hidden w-full flex items-center justify-between py-2.5 text-left"
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex items-center gap-2">
          <span className="block h-px w-3 bg-[#bfa06f] flex-shrink-0" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
            {label}
          </span>
        </div>
        <ChevronDown
          className={`h-3 w-3 text-[#bfa06f] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`sm:hidden w-full overflow-hidden transition-all duration-200 ${open ? 'max-h-[800px] pb-3' : 'max-h-0'}`}>
        {children}
      </div>

      <div className="hidden sm:block w-full pb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="block h-px w-5 bg-[#bfa06f] flex-shrink-0" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
            {label}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // ← CHANGED: reads from context — zero API calls
  const { services, loading } = useServices();

  // Find current service from cached array, fallback to static data
  const service = useMemo(() => {
    if (!serviceId) return null;
    const fromContext = services.find((s) => s.slug === serviceId || s.id === serviceId);
    if (fromContext) return fromContext;
    // Fallback to static servicesData if not found in DB
    return servicesData.find((s: any) => s.slug === serviceId || s.id === serviceId) ?? null;
  }, [services, serviceId]);

  // Related services derived from same cached array — no extra call
  const relatedServices = useMemo(
    () => services.filter((s) => s.id !== serviceId && s.slug !== serviceId),
    [services, serviceId]
  );

  const handleBack  = () => navigate(-1);
  const goToContact = () => { navigate('/contact'); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const goToService = (s: any) => { navigate(`/services/${s.slug || s.id}`); window.scrollTo({ top: 0, behavior: 'instant' }); };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#bfa06f]/10">
              <Loader2 className="h-4 w-4 text-[#bfa06f] animate-spin" />
            </div>
            <p className="text-xs text-[#6a6a6a]">Loading…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center pt-20 px-4">
          <div className="text-center max-w-xs">
            <div className="w-4 h-0.5 bg-[#bfa06f] mx-auto mb-3" />
            <h1 className="text-lg font-bold text-[#1a1a1a] mb-2">Service Not Found</h1>
            <p className="text-xs text-[#6a6a6a] mb-5">
              This service doesn't exist or has been removed.
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 bg-[#bfa06f] text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const IconComponent = (Icons as any)[service.icon] || Icons.Scale;

  // Normalise snake_case DB fields → support both DB and static data field names
  const headerImage  = (service as any).header_image   || (service as any).headerImage;
  const keyServices  = (service as any).key_services   || (service as any).keyServices   || [];
  const whyChooseUs  = (service as any).why_choose_us  || (service as any).whyChooseUs   || [];
  const process      = (service as any).process        || [];
  const overview     = (service as any).overview       || '';

  return (
    <>
      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* ── Hero ── */}
        <div
          className="relative flex items-end pt-16 sm:pt-20 w-full overflow-hidden"
          style={{ height: 'clamp(200px, 45vw, 560px)' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${headerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 pb-3.5 sm:pb-10">
            <button
              onClick={handleBack}
              className="group inline-flex items-center gap-1 text-white/50 hover:text-white text-[0.6rem] sm:text-sm font-semibold transition-colors mb-2.5 sm:mb-7"
            >
              <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-0.5 transition-transform flex-shrink-0" />
              Back
            </button>

            <div className="flex items-center gap-1.5 mb-1 sm:mb-2.5">
              <span className="block h-px w-3 sm:w-5 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.5rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Practice Area
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-3 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-[#bfa06f]/20 flex-shrink-0">
                <IconComponent className="h-3 w-3 sm:h-5 sm:w-5 text-[#d4b483]" />
              </div>
              <h1
                className="text-sm sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight min-w-0 truncate sm:whitespace-normal"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
              >
                {service.title}
              </h1>
            </div>

            <p className="text-white/60 leading-relaxed pl-8 sm:pl-0 sm:max-w-2xl text-[0.6rem] line-clamp-1 sm:text-base sm:line-clamp-none">
              {service.description}
            </p>
          </div>
        </div>

        {/* ── Mobile CTA strip ── */}
        <div className="sm:hidden bg-[#f9f7f1] border-b border-[#e8e0d0] px-3 py-2 flex items-center gap-1.5 w-full">
          <a
            href="tel:+254205285048"
            className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-white border border-[#e8e0d0] rounded-lg py-2 text-[0.6rem] font-semibold text-[#4a4a4a]"
          >
            <Phone className="h-2.5 w-2.5 text-[#bfa06f] flex-shrink-0" />
            Call
          </a>
          <a
            href="mailto:info@soklaw.co.ke"
            className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-white border border-[#e8e0d0] rounded-lg py-2 text-[0.6rem] font-semibold text-[#4a4a4a]"
          >
            <Mail className="h-2.5 w-2.5 text-[#bfa06f] flex-shrink-0" />
            Email
          </a>
          <button
            onClick={goToContact}
            className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-[#bfa06f] rounded-lg py-2 text-[0.6rem] font-semibold text-white"
          >
            Consult
            <ArrowRight className="h-2 w-2 flex-shrink-0" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-3 sm:py-14 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-14 items-start w-full">

            {/* ── Main content ── */}
            <div className="lg:col-span-2 w-full min-w-0">
              <div className="w-full">

                {overview && (
                  <Section label="Overview" defaultOpen={true}>
                    <p className="text-[0.7rem] sm:text-base text-[#4a4a4a] leading-relaxed w-full">
                      {overview}
                    </p>
                  </Section>
                )}

                {keyServices.length > 0 && (
                  <Section label="Key Services">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 w-full">
                      {keyServices.map((item: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 bg-[#f9f7f1] border border-[#e8e0d0] rounded-lg px-2.5 py-2 sm:px-4 sm:py-3 w-full min-w-0"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f] mt-0.5 flex-shrink-0" />
                          <span className="text-[0.65rem] sm:text-sm text-[#1a1a1a] leading-snug min-w-0">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {whyChooseUs.length > 0 && (
                  <Section label="Why SOK Law">
                    <div className="space-y-1.5 sm:space-y-3 w-full">
                      {whyChooseUs.map((reason: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 sm:gap-3 bg-white border border-[#e8e0d0] rounded-lg sm:rounded-2xl p-2.5 sm:p-5 w-full min-w-0"
                        >
                          <div className="flex items-center justify-center w-4 h-4 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-[#bfa06f]/10 flex-shrink-0 mt-0.5">
                            <span className="text-[0.5rem] sm:text-[0.65rem] font-black text-[#bfa06f]">
                              {i + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[0.65rem] sm:text-sm font-bold text-[#1a1a1a] mb-0.5">
                              {reason.title}
                            </h3>
                            <p className="text-[0.6rem] sm:text-sm text-[#6a6a6a] leading-relaxed">
                              {reason.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {process.length > 0 && (
                  <Section label="Our Process">
                    <div className="w-full">
                      {process.map((step: any, i: number) => (
                        <div key={i} className="flex items-start gap-2.5 sm:gap-4 relative w-full">
                          {i < process.length - 1 && (
                            <div className="absolute left-[9px] sm:left-[15px] top-5 sm:top-7 bottom-0 w-px bg-[#e8e0d0]" />
                          )}
                          <div className="flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#bfa06f] text-white text-[0.5rem] sm:text-xs font-black flex-shrink-0 z-10">
                            {i + 1}
                          </div>
                          <div className="pb-3.5 sm:pb-6 flex-1 min-w-0">
                            <h3 className="text-[0.65rem] sm:text-sm font-bold text-[#1a1a1a] mb-0.5">
                              {step.title}
                            </h3>
                            <p className="text-[0.6rem] sm:text-sm text-[#6a6a6a] leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {relatedServices.length > 0 && (
                  <div className="sm:hidden pt-2 pb-3 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="block h-px w-3 bg-[#bfa06f] flex-shrink-0" />
                      <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                        Related
                      </span>
                    </div>
                    <div
                      className="flex gap-1.5 pb-1"
                      style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
                    >
                      {relatedServices.slice(0, 7).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => goToService(s)}
                          className="flex-shrink-0 text-[0.6rem] font-medium text-[#4a4a4a] border border-[#e8e0d0] bg-[#f9f7f1] hover:border-[#bfa06f]/50 hover:text-[#bfa06f] rounded-full px-2.5 py-1 whitespace-nowrap"
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sidebar — desktop only ── */}
            <div className="hidden sm:flex flex-col gap-5 lg:sticky lg:top-24 min-w-0">
              <div className="bg-[#f9f7f1] border border-[#e8e0d0] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="block h-px w-4 bg-[#bfa06f] flex-shrink-0" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                    Get Help
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a] mb-2">
                  Need Legal Assistance?
                </h3>
                <p className="text-sm text-[#6a6a6a] leading-relaxed mb-4">
                  Contact our {service.title.toLowerCase()} specialists for a consultation.
                </p>
                <div className="space-y-2 mb-4">
                  <a
                    href="tel:+254205285048"
                    className="flex items-center gap-2.5 bg-white border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-xl px-3 py-2.5 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#bfa06f]/10 flex-shrink-0">
                      <Phone className="h-3 w-3 text-[#bfa06f]" />
                    </div>
                    <span className="text-sm text-[#4a4a4a] group-hover:text-[#bfa06f] transition-colors min-w-0 truncate">
                      +254 (0) 20 5285048
                    </span>
                  </a>
                  <a
                    href="mailto:info@soklaw.co.ke"
                    className="flex items-center gap-2.5 bg-white border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-xl px-3 py-2.5 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#bfa06f]/10 flex-shrink-0">
                      <Mail className="h-3 w-3 text-[#bfa06f]" />
                    </div>
                    <span className="text-sm text-[#4a4a4a] group-hover:text-[#bfa06f] transition-colors min-w-0 truncate">
                      info@soklaw.co.ke
                    </span>
                  </a>
                </div>
                <button
                  onClick={goToContact}
                  className="w-full flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-sm font-semibold py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Schedule Consultation
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                </button>
              </div>

              {relatedServices.length > 0 && (
                <div className="bg-white border border-[#e8e0d0] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="block h-px w-4 bg-[#bfa06f] flex-shrink-0" />
                    <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                      Related Services
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {relatedServices.slice(0, 5).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => goToService(s)}
                        className="group w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[#f9f7f1] transition-colors text-left"
                      >
                        <span className="text-sm text-[#4a4a4a] group-hover:text-[#bfa06f] transition-colors truncate min-w-0">
                          {s.title}
                        </span>
                        <ArrowRight className="h-3 w-3 text-[#bfa06f] opacity-0 group-hover:opacity-100 flex-shrink-0 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServiceDetailPage;
