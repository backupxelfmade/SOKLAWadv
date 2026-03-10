import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, Linkedin,
  Award, BookOpen, X, Loader2, AlertCircle,
  Scale, Globe, Trophy,
} from 'lucide-react';
import Footer from '../components/Footer';
import { partners } from '../data/teamData';
import { useTeam } from '../hooks/useSiteData';

const TeamPage = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { team: dynamicMembers, loading, error } = useTeam();

  const membersToDisplay = dynamicMembers.length > 0 ? dynamicMembers : partners;

  // ── Sort by display_order, then build category map ────────────────────────
  const sorted = [...membersToDisplay].sort(
    (a: any, b: any) => (a.display_order ?? 99) - (b.display_order ?? 99)
  );

  const teamByCategory: Record<string, any[]> = {};
  sorted.forEach((m: any) => {
    const key = m.category?.trim() || 'Team';
    if (!teamByCategory[key]) teamByCategory[key] = [];
    teamByCategory[key].push(m);
  });
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-14 relative overflow-hidden">
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
          />
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[0.65rem] sm:text-sm font-semibold transition-colors mb-5 sm:mb-8"
            >
              <ArrowLeft className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-5 sm:w-8 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                Our People
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              The Legal Team
            </h1>
            <p className="hidden sm:block text-sm sm:text-base text-white/55 max-w-lg mt-3 leading-relaxed">
              Experienced advocates, sharp minds, and dedicated professionals — committed to
              delivering the best outcomes for every client we represent.
            </p>
          </div>
        </div>

        {/* ── Members ──────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-14 lg:py-20">

          {error && (
            <div className="flex items-start gap-3 bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl px-3 py-2.5 mb-5 max-w-lg">
              <AlertCircle className="h-3.5 w-3.5 text-[#bfa06f] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#4a4a4a]">Displaying default team data. {error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#bfa06f]/10">
                <Loader2 className="h-4 w-4 text-[#bfa06f] animate-spin" />
              </div>
              <p className="text-xs text-[#6a6a6a]">Loading team members…</p>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-20">
              {Object.entries(teamByCategory).map(([category, members]) => (
                <section key={category}>

                  {/* Category header */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <div className="flex items-center gap-2">
                      <span className="block h-px w-4 sm:w-6 bg-[#bfa06f] flex-shrink-0" />
                      <h2 className="text-[0.65rem] sm:text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                        {category}
                      </h2>
                    </div>
                    <span className="flex-1 h-px bg-[#e8e0d0]" />
                    <span className="text-[0.55rem] sm:text-[0.65rem] text-[#aaa] font-medium">
                      {members.length} {members.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
                    {members.map((member: any) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className="group cursor-pointer bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#bfa06f]/50 hover:shadow-md transition-all duration-300"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[#f9f7f1]">
                          <img
                            src={member.image} alt={member.name} loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-2.5 sm:p-4">
                          <div className="w-3 sm:w-4 h-0.5 bg-[#bfa06f] mb-1.5 sm:mb-2 transition-all duration-300 group-hover:w-5 sm:group-hover:w-6" />
                          <h3 className="text-[0.65rem] sm:text-sm font-bold text-[#0d2340] leading-snug line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-[0.55rem] sm:text-xs text-[#bfa06f] font-semibold mt-0.5 line-clamp-1">
                            {member.role}
                          </p>
                          <p className="text-[0.55rem] sm:text-xs text-[#6a6a6a] mt-1 line-clamp-2 leading-snug hidden sm:block">
                            {member.specialization}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#bfa06f] hover:text-white transition-all"
                              >
                                <Mail className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#bfa06f] hover:text-white transition-all"
                              >
                                <Phone className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                              </a>
                            )}
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#bfa06f] hover:text-white transition-all"
                              >
                                <Linkedin className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Member Modal ──────────────────────────────────────────────────────── */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start gap-3 sm:gap-5 p-4 sm:p-6 border-b border-[#e8e0d0]">
              <img
                src={selectedMember.image} alt={selectedMember.name}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-xl font-bold text-[#0d2340]">{selectedMember.name}</h3>
                <p className="text-xs sm:text-sm text-[#bfa06f] font-semibold">{selectedMember.role}</p>
                <p className="text-[0.6rem] sm:text-xs text-[#6a6a6a] mt-0.5">{selectedMember.specialization}</p>
                <div className="flex items-center gap-2 mt-2">
                  {selectedMember.email && (
                    <a href={`mailto:${selectedMember.email}`}
                      className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#bfa06f] hover:text-white transition-all">
                      <Mail className="h-3 w-3" />
                    </a>
                  )}
                  {selectedMember.phone && (
                    <a href={`tel:${selectedMember.phone}`}
                      className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#bfa06f] hover:text-white transition-all">
                      <Phone className="h-3 w-3" />
                    </a>
                  )}
                  {selectedMember.linkedin && (
                    <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#bfa06f] hover:text-white transition-all">
                      <Linkedin className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#f9f7f1] hover:bg-[#e8e0d0] transition-colors"
              >
                <X className="h-3.5 w-3.5 text-[#4a4a4a]" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

              {selectedMember.description && (
                <p className="text-xs sm:text-sm text-[#4a4a4a] leading-relaxed">
                  {selectedMember.description}
                </p>
              )}

              {selectedMember.expertise?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
                    <h4 className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#0d2340]">
                      Areas of Expertise
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.expertise.map((e: string) => (
                      <span key={e} className="text-[0.55rem] sm:text-xs bg-[#f9f7f1] border border-[#e8e0d0] rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[#4a4a4a]">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.education?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
                    <h4 className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#0d2340]">
                      Education
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedMember.education.map((e: string) => (
                      <li key={e} className="flex items-start gap-1.5 text-[0.6rem] sm:text-xs text-[#4a4a4a]">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#bfa06f] flex-shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMember.admissions?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Scale className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
                    <h4 className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#0d2340]">
                      Admissions
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedMember.admissions.map((a: string) => (
                      <li key={a} className="flex items-start gap-1.5 text-[0.6rem] sm:text-xs text-[#4a4a4a]">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#bfa06f] flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMember.qualifications?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
                    <h4 className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#0d2340]">
                      Qualifications
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedMember.qualifications.map((q: string) => (
                      <li key={q} className="flex items-start gap-1.5 text-[0.6rem] sm:text-xs text-[#4a4a4a]">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#bfa06f] flex-shrink-0" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMember.languages?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
                    <h4 className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#0d2340]">
                      Languages
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.languages.map((l: string) => (
                      <span key={l} className="text-[0.55rem] sm:text-xs bg-[#f9f7f1] border border-[#e8e0d0] rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[#4a4a4a]">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.achievements?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-[#bfa06f]" />
                    <h4 className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#0d2340]">
                      Achievements
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedMember.achievements.map((a: string) => (
                      <li key={a} className="flex items-start gap-1.5 text-[0.6rem] sm:text-xs text-[#4a4a4a]">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#bfa06f] flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default TeamPage;
