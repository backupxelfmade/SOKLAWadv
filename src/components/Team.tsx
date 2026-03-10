import React, { useEffect, useRef, useState, useMemo } from 'react'; // ← added useMemo
import { useNavigate } from 'react-router-dom';
import { Linkedin, Mail, Phone, Users, X, ArrowRight } from 'lucide-react';
import { partners } from '../data/teamData';
import { useTeam } from '../hooks/useSiteData';  // ← CHANGED (replaces both old hooks)

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  // ← CHANGED: single hook replaces useTeamMembers + useCategories
  const { team: dynamicMembers, loading, error } = useTeam();

  const membersToDisplay = dynamicMembers.length > 0 ? dynamicMembers : partners;

  // ← CHANGED: categories derived from members — no separate hook needed
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return membersToDisplay
      .map((m) => m.category)
      .filter((c): c is string => !!c && !seen.has(c) && seen.add(c) !== undefined);
  }, [membersToDisplay]);

  const teamByCategory = useMemo(() => {
    const result: { [key: string]: any[] } = {};
    if (categories.length > 0) {
      categories.forEach((cat) => {
        result[cat] = membersToDisplay.filter((m) => m.category === cat);
      });
    } else {
      result['Partners']              = membersToDisplay.filter((m) => m.category === 'Partners');
      result['Consulting Partners']   = membersToDisplay.filter((m) => m.category === 'Consulting Partners');
      result['Associates']            = membersToDisplay.filter((m) => m.category === 'Associates');
      result['Administrative staff']  = membersToDisplay.filter((m) => m.category === 'Administrative staff');
      result['Assistants']            = membersToDisplay.filter((m) => m.category === 'Assistants');
    }
    return result;
  }, [membersToDisplay, categories]);

  const displayPartners = (teamByCategory['Partners'] || []).slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.team-card').forEach((card, i) => {
              setTimeout(() => card.classList.add('animate-fade-in-up'), i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleViewAllTeam = () => {
    navigate('/team');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section ref={sectionRef} id="team" className="py-10 sm:py-20 lg:py-28 bg-[#f9f7f1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

        {/* ── Section header ── */}
        <div className="mb-8 sm:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-6 bg-[#bfa06f]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Who Leads Us
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
              Our Legal Team
            </h2>
          </div>

          <button
            onClick={handleViewAllTeam}
            className="hidden sm:flex items-center gap-2 self-end text-sm font-semibold text-[#bfa06f] hover:text-[#a08a5f] transition-colors duration-200 group pb-1 border-b border-[#bfa06f]/40 hover:border-[#a08a5f] whitespace-nowrap"
          >
            <span>View All Members</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className="hidden sm:block text-base text-[#4a4a4a] max-w-2xl mb-10 leading-relaxed">
          Meet our experienced partners dedicated to providing exceptional legal
          services and achieving the best outcomes for every client.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-xs">Note: Displaying default team members. {error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl bg-white animate-pulse h-[220px] sm:h-[460px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-6">
            {displayPartners.map((member, i) => (
              <div
                key={member.id || i}
                className="team-card opacity-0 group cursor-pointer"
                onClick={() => setSelectedPartner(member)}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">

                  <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#e8e0d0]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-2.5 sm:p-6 bg-white">
                    <div className="w-4 sm:w-5 h-0.5 bg-[#bfa06f] mb-1.5 sm:mb-3" />
                    <h3 className="font-bold text-[#1a1a1a] leading-tight line-clamp-1 text-[0.65rem] sm:text-lg md:text-xl mb-0.5 sm:mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#bfa06f] font-semibold leading-tight line-clamp-1 text-[0.6rem] sm:text-sm mb-1 sm:mb-2">
                      {member.role}
                    </p>
                    <p className="text-[#6a6a6a] leading-snug line-clamp-2 text-[0.55rem] sm:text-sm hidden sm:block">
                      {member.specialization}
                    </p>

                    <div className="hidden sm:flex items-center gap-2 mt-4">
                      <a
                        href={`mailto:${member.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] hover:text-white text-[#4a4a4a] transition-all duration-200"
                        title="Email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] hover:text-white text-[#4a4a4a] transition-all duration-200"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] hover:text-white text-[#4a4a4a] transition-all duration-200"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center sm:hidden">
          <button
            onClick={handleViewAllTeam}
            className="flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-md transition-all duration-200 group w-full max-w-xs"
          >
            <Users className="h-4 w-4" />
            <span>View All Team Members</span>
          </button>
        </div>
      </div>

      {/* ── Profile Modal ── */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-8"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedPartner.image}
                alt={selectedPartner.name}
                className="w-full h-48 sm:h-64 object-cover object-top rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="px-5 sm:px-8 pb-7 sm:pb-8 -mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="block h-px w-5 bg-[#bfa06f]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                  {selectedPartner.category || 'Partner'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-1">
                {selectedPartner.name}
              </h3>
              <p className="text-[#bfa06f] font-semibold text-sm sm:text-base mb-3">
                {selectedPartner.role}
              </p>
              <p className="text-[#4a4a4a] text-sm leading-relaxed mb-4">
                {selectedPartner.description}
              </p>

              {selectedPartner.experience && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1.5">
                    Experience
                  </h4>
                  <p className="text-[#4a4a4a] text-sm">{selectedPartner.experience}</p>
                </div>
              )}

              {selectedPartner.expertise?.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPartner.expertise.map((area: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#bfa06f]/10 text-[#8b7355] text-xs font-medium rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-[#e8e0d0]">
                <a
                  href={`mailto:${selectedPartner.email}`}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f9f7f1] hover:bg-[#bfa06f] hover:text-white text-[#4a4a4a] transition-all duration-200"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={`tel:${selectedPartner.phone}`}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f9f7f1] hover:bg-[#bfa06f] hover:text-white text-[#4a4a4a] transition-all duration-200"
                >
                  <Phone className="h-4 w-4" />
                </a>
                {selectedPartner.linkedin && (
                  <a
                    href={selectedPartner.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f9f7f1] hover:bg-[#bfa06f] hover:text-white text-[#4a4a4a] transition-all duration-200"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Team;
