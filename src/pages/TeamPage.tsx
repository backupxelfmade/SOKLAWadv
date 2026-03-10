import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Mail, Phone, Linkedin,
  Award, BookOpen, X, Loader2, AlertCircle,
} from 'lucide-react';
import Footer from '../components/Footer';
import { teamMembers, TeamMember } from '../data/teamData';
import { useTeam } from '../hooks/useSiteData'; // ← CHANGED (was useTeamMembers + useCategories)

// Predefined category order — no Supabase call needed
const CATEGORY_ORDER = [
  'Partners',
  'Consulting Partners',
  'Associates',
  'Administrative Staff',
  'Administrative staff', // handle case variation from DB
  'Assistants',
];

const TeamPage = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { team: dynamicMembers, loading, error } = useTeam(); // ← CHANGED

  const membersToDisplay = dynamicMembers.length > 0 ? dynamicMembers : teamMembers;

  // Derive categories from members — zero extra API calls
  const teamByCategory = CATEGORY_ORDER.reduce((acc: Record<string, any[]>, cat) => {
    const matched = membersToDisplay.filter((m: any) => m.category === cat);
    if (matched.length > 0) acc[cat] = matched;
    return acc;
  }, {});

  // Catch any members with categories not in CATEGORY_ORDER
  const knownCategories = new Set(Object.keys(teamByCategory));
  membersToDisplay.forEach((m: any) => {
    if (m.category && !knownCategories.has(m.category)) {
      if (!teamByCategory[m.category]) teamByCategory[m.category] = [];
      teamByCategory[m.category].push(m);
    }
  });

  return (
    <>
      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* ── Dark header band ── */}
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

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-14 lg:py-20">

          {error && (
            <div className="flex items-start gap-3 bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl px-3 py-2.5 mb-5 max-w-lg">
              <AlertCircle className="h-3.5 w-3.5 text-[#bfa06f] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#4a4a4a]">Displaying default team data. {error}</p>
            </div>
          )}

          {loading ? ( // ← REMOVED categoriesLoading (no longer needed)
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#bfa06f]/10">
                <Loader2 className="h-4 w-4 text-[#bfa06f] animate-spin" />
              </div>
              <p className="text-xs text-[#6a6a6a]">Loading team members…</p>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-20">
              {Object.entries(teamByCategory).map(([category, members]) =>
                members.length === 0 ? null : (
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
                              src={member.image}
                              alt={member.name}
                              loading="lazy"
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
                              <a
                                href={`mailto:${member.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#6a6a6a] hover:text-white transition-all duration-200"
                              >
                                <Mail className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                              </a>
                              <a
                                href={`tel:${member.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#6a6a6a] hover:text-white transition-all duration-200"
                              >
                                <Phone className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                              </a>
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] hover:bg-[#bfa06f] text-[#6a6a6a] hover:text-white transition-all duration-200"
                                >
                                  <Linkedin className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                                </a>
                              )}
                              <div className="ml-auto flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#f9f7f1] group-hover:bg-[#bfa06f] transition-colors duration-200">
                                <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-[#bfa06f] group-hover:text-white transition-colors group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* ── Member profile modal ── */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedMember(null); }}
        >
          <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">

            <div className="sticky top-0 bg-white border-b border-[#e8e0d0] px-4 sm:px-7 py-3.5 sm:py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="block h-px w-3 sm:w-4 bg-[#bfa06f] flex-shrink-0" />
                <span className="text-[0.6rem] sm:text-xs font-semibold uppercase tracking-widest text-[#bfa06f]">
                  Profile
                </span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f9f7f1] hover:bg-[#e8e0d0] transition-colors"
              >
                <X className="h-3.5 w-3.5 text-[#4a4a4a]" />
              </button>
            </div>

            <div className="px-4 sm:px-7 py-4 sm:py-7">

              <div className="flex items-start gap-3 sm:gap-6 mb-5 sm:mb-8">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover flex-shrink-0 border border-[#e8e0d0]"
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <h2 className="text-sm sm:text-xl font-bold text-[#0d2340] leading-tight">
                    {selectedMember.name}
                  </h2>
                  <p className="text-[0.65rem] sm:text-sm font-semibold text-[#bfa06f] mt-0.5 uppercase tracking-wide">
                    {selectedMember.role}
                  </p>
                  <p className="text-[0.6rem] sm:text-xs text-[#6a6a6a] mt-1 leading-snug line-clamp-2 sm:line-clamp-none">
                    {selectedMember.specialization}
                  </p>

                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-1 bg-[#f9f7f1] border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-full px-2 py-1 text-[0.55rem] sm:text-xs text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                    >
                      <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f]" />
                      <span className="hidden sm:inline">{selectedMember.email}</span>
                      <span className="sm:hidden">Email</span>
                    </a>
                    <a
                      href={`tel:${selectedMember.phone}`}
                      className="flex items-center gap-1 bg-[#f9f7f1] border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-full px-2 py-1 text-[0.55rem] sm:text-xs text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                    >
                      <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f]" />
                      <span className="hidden sm:inline">{selectedMember.phone}</span>
                      <span className="sm:hidden">Call</span>
                    </a>
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-[#f9f7f1] border border-[#e8e0d0] hover:border-[#bfa06f]/40 rounded-full px-2 py-1 text-[0.55rem] sm:text-xs text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                      >
                        <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f]" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#e8e0d0] mb-5 sm:mb-7" />

              <div className="space-y-4 sm:space-y-7">

                {selectedMember.description && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="block h-px w-3 sm:w-4 bg-[#bfa06f]" />
                      <h3 className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest">About</h3>
                    </div>
                    <p className="text-[0.65rem] sm:text-sm text-[#4a4a4a] leading-relaxed">
                      {selectedMember.description}
                    </p>
                  </div>
                )}

                {selectedMember.experience && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="block h-px w-3 sm:w-4 bg-[#bfa06f]" />
                      <h3 className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest">Experience</h3>
                    </div>
                    <p className="text-[0.65rem] sm:text-sm text-[#4a4a4a] leading-relaxed">
                      {selectedMember.experience}
                    </p>
                  </div>
                )}

                {selectedMember.expertise?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="block h-px w-3 sm:w-4 bg-[#bfa06f]" />
                      <h3 className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest">Areas of Expertise</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {selectedMember.expertise.map((area: string, i: number) => (
                        <span
                          key={i}
                          className="text-[0.55rem] sm:text-xs font-medium text-[#4a4a4a] bg-[#f9f7f1] border border-[#e8e0d0] rounded-full px-2 py-0.5 sm:px-3 sm:py-1"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMember.education?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="block h-px w-3 sm:w-4 bg-[#bfa06f]" />
                      <h3 className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest">Education</h3>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {selectedMember.education.map((edu: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <BookOpen className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-[#bfa06f] mt-0.5 flex-shrink-0" />
                          <span className="text-[0.6rem] sm:text-sm text-[#4a4a4a] leading-snug">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMember.achievements?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="block h-px w-3 sm:w-4 bg-[#bfa06f]" />
                      <h3 className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest">Key Achievements</h3>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {selectedMember.achievements.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Award className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-[#bfa06f] mt-0.5 flex-shrink-0" />
                          <span className="text-[0.6rem] sm:text-sm text-[#4a4a4a] leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="w-full mt-6 sm:mt-8 flex items-center justify-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-full transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamPage;
