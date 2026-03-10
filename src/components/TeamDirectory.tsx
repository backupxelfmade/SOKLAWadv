import React, { useState } from 'react';
import { X, Mail, Phone, Award, BookOpen, Scale, ArrowLeft } from 'lucide-react';
import { useTeam } from '../hooks/useSiteData';              // ← CHANGED
import type { TeamMember } from '../context/AppDataContext'; // ← CHANGED

interface TeamDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamDirectory: React.FC<TeamDirectoryProps> = ({ isOpen, onClose }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // ← CHANGED: reads from context — zero API calls
  const { team: teamMembers } = useTeam();

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedMember(null);
    onClose();
  };

  // ── Member detail view ──
  if (selectedMember) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
        onClick={() => setSelectedMember(null)}
      >
        <div className="min-h-screen px-3 sm:px-6 py-6 sm:py-10 flex items-start justify-center">
          <div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero strip */}
            <div className="relative">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="w-full h-40 sm:h-64 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute bottom-4 left-4 sm:left-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="block h-px w-5 bg-[#bfa06f]" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                    {selectedMember.category || 'Partner'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                  {selectedMember.name}
                </h2>
                <p className="text-[#bfa06f] font-semibold text-xs sm:text-base">
                  {selectedMember.role}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-7">

              {/* Contact row */}
              <div className="flex items-center gap-2 pb-5 border-b border-[#e8e0d0]">
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="flex items-center gap-2 text-xs sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f9f7f1] group-hover:bg-[#bfa06f] group-hover:text-white transition-all duration-200">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span className="hidden sm:inline">{selectedMember.email}</span>
                </a>
                <a
                  href={`tel:${selectedMember.phone}`}
                  className="flex items-center gap-2 text-xs sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f9f7f1] group-hover:bg-[#bfa06f] group-hover:text-white transition-all duration-200">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <span className="hidden sm:inline">{selectedMember.phone}</span>
                </a>
              </div>

              {/* Two-col on desktop */}
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">

                {/* Left col */}
                <div className="space-y-5">
                  {selectedMember.description && (
                    <InfoBlock title="About">
                      <p className="text-[#4a4a4a] text-sm leading-relaxed">{selectedMember.description}</p>
                    </InfoBlock>
                  )}

                  {selectedMember.experience && (
                    <InfoBlock title="Experience">
                      <p className="text-[#4a4a4a] text-sm">{selectedMember.experience}</p>
                    </InfoBlock>
                  )}

                  {selectedMember.languages && selectedMember.languages.length > 0 && (
                    <InfoBlock title="Languages">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.languages.map((lang, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[#bfa06f]/10 text-[#8b7355] text-xs font-medium rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </InfoBlock>
                  )}
                </div>

                {/* Right col */}
                <div className="space-y-5">
                  {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                    <InfoBlock title="Areas of Expertise">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.expertise.map((area, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[#bfa06f]/10 text-[#8b7355] text-xs font-medium rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </InfoBlock>
                  )}

                  {selectedMember.education && selectedMember.education.length > 0 && (
                    <InfoBlock title="Education">
                      <ul className="space-y-2">
                        {selectedMember.education.map((edu, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#4a4a4a] text-sm">
                            <BookOpen className="h-3.5 w-3.5 mt-0.5 text-[#bfa06f] flex-shrink-0" />
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </InfoBlock>
                  )}

                  {selectedMember.admissions && selectedMember.admissions.length > 0 && (
                    <InfoBlock title="Admissions">
                      <ul className="space-y-2">
                        {selectedMember.admissions.map((adm, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#4a4a4a] text-sm">
                            <Scale className="h-3.5 w-3.5 mt-0.5 text-[#bfa06f] flex-shrink-0" />
                            {adm}
                          </li>
                        ))}
                      </ul>
                    </InfoBlock>
                  )}

                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <InfoBlock title="Key Achievements">
                      <ul className="space-y-2">
                        {selectedMember.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#4a4a4a] text-sm">
                            <Award className="h-3.5 w-3.5 mt-0.5 text-[#bfa06f] flex-shrink-0" />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </InfoBlock>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Directory view ──
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <div className="min-h-screen px-3 sm:px-6 py-6 sm:py-10 flex items-start justify-center">
        <div
          className="w-full max-w-5xl bg-[#f9f7f1] rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-4 sm:px-8 py-5 sm:py-6 border-b border-[#e8e0d0] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="block h-px w-5 bg-[#bfa06f]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                  The Firm
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">Our Legal Team</h2>
              <p className="text-xs sm:text-sm text-[#6a6a6a] mt-0.5">
                Meet our experienced team of legal professionals
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f9f7f1] hover:bg-[#e8e0d0] text-[#4a4a4a] transition-all duration-200 flex-shrink-0 mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Grid */}
          <div className="p-3 sm:p-6 lg:p-8">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#e8e0d0]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-2 sm:p-4">
                    <div className="w-3 sm:w-4 h-0.5 bg-[#bfa06f] mb-1 sm:mb-2" />
                    <h3 className="font-bold text-[#1a1a1a] leading-tight line-clamp-1 text-[0.6rem] sm:text-sm md:text-base">
                      {member.name}
                    </h3>
                    <p className="text-[#bfa06f] font-semibold leading-tight line-clamp-1 text-[0.55rem] sm:text-xs mt-0.5">
                      {member.role}
                    </p>
                    {member.qualifications && member.qualifications.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1 mt-2">
                        {member.qualifications.slice(0, 2).map((qual, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#f9f7f1] text-[#6a6a6a] text-[10px] rounded font-medium">
                            {qual}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Reusable section block ──
const InfoBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-[0.7rem] font-bold uppercase tracking-widest text-[#1a1a1a] mb-2">
      {title}
    </h4>
    {children}
  </div>
);

export default TeamDirectory;
