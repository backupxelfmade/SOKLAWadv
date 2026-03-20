import React, { useState } from 'react';
import {
  Briefcase, MapPin, Clock, GraduationCap, Heart,
  Users, TrendingUp, Award, X, ArrowRight, CheckCircle, Loader2,
} from 'lucide-react';
import Footer from '../components/Footer';
import { useCareers } from '../hooks/useSiteData';
import type { Career } from '../context/AppDataContext';

const benefits = [
  {
    icon: GraduationCap,
    title: 'Learn From the Best',
    description: 'Work alongside senior advocates with decades of Kenyan court experience — courtroom mentorship you can\'t get in a classroom.',
  },
  {
    icon: Heart,
    title: 'We Respect Your Life',
    description: 'Legal work is demanding — we know. Flexible hours, fair leave, and a team that actually checks in on you.',
  },
  {
    icon: Users,
    title: 'A Real Team',
    description: 'No silos, no politics. At SOK Law, juniors contribute from day one and every voice in the room counts.',
  },
  {
    icon: TrendingUp,
    title: 'A Path, Not Just a Role',
    description: 'From pupil to partner — we map out your progression and invest in getting you there.',
  },
  {
    icon: Award,
    title: 'Fairly Rewarded',
    description: 'Competitive salaries benchmarked to the Kenyan market, plus performance recognition that\'s transparent and consistent.',
  },
];

const values = [
  {
    title: 'Excellence',
    description: 'We don\'t settle for adequate. Every brief, every submission, every client interaction is held to a standard we\'re proud to put our name on.',
  },
  {
    title: 'Integrity',
    description: 'In a profession built on trust, our word is our bond — to clients, to courts, and to each other.',
  },
  {
    title: 'Innovation',
    description: 'We\'re modernising legal practice in Kenya — from how we research to how we communicate with clients. We welcome people who think differently.',
  },
  {
    title: 'Collaboration',
    description: 'The best legal outcomes come from minds working together. We share knowledge freely and celebrate wins as a firm, not as individuals.',
  },
];

const steps = [
  { label: 'Apply',      desc: 'Email your CV and a short cover letter to careers@soklaw.co.ke' },
  { label: 'We Review',  desc: 'A partner reads every application personally — no automated filters' },
  { label: 'Interview',  desc: 'A real conversation — we want to know you, not just your grades' },
  { label: 'Welcome',    desc: 'Offer letter, onboarding, and a desk waiting at Upperhill Gardens' },
];

// ── Shared Gmail opener helpers ──
const openGmailApply = (position: Career) => {
  const subject = encodeURIComponent(`Application for ${position.title}`);
  const body = encodeURIComponent(
    `Dear Hiring Team,\n\nI am writing to express my interest in the ${position.title} position in the ${position.department ?? ''} department at SOK Law.\n\nPlease find my CV and cover letter attached.\n\nBest regards`
  );
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=careers@soklaw.co.ke&su=${subject}&body=${body}`,
    '_blank'
  );
};

const openGmailCV = () => {
  const subject = encodeURIComponent('Open Application — [Your Name]');
  const body = encodeURIComponent(
    'Dear Hiring Team,\n\nI am writing to express my interest in joining SOK Law.\n\nPlease find my CV attached.\n\nBest regards'
  );
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=careers@soklaw.co.ke&su=${subject}&body=${body}`,
    '_blank'
  );
};

const openGmailInternship = (type: 'Internship' | 'Pupillage') => {
  const subject = encodeURIComponent(`${type} Application`);
  const body = encodeURIComponent(
    `Dear Hiring Team,\n\nI am writing to apply for the ${type} Program at SOK Law.\n\nI have attached my cover letter, CV, academic transcripts, two referees, and a copy of my ID.\n\nBest regards`
  );
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=careers@soklaw.co.ke&su=${subject}&body=${body}`,
    '_blank'
  );
};

const CareersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { careers, loading } = useCareers();
  const openPositions = careers.filter((c) => c.is_active !== false);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">

      {/* ── Hero ── */}
      <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-10 sm:pb-16 relative overflow-hidden">
        <div
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
        />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 relative z-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="block h-px w-5 sm:w-8 bg-[#bfa06f] flex-shrink-0 transition-all" />
            <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#bfa06f]">
              Careers at SOKLaw
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-2xl">
            Grow With Us.
          </h1>
          <div className="hidden sm:block w-12 h-0.5 bg-[#bfa06f]/40 mt-5 mb-5" />
          <p className="hidden sm:block text-sm sm:text-base text-white/55 max-w-lg leading-relaxed">
            SOKLaw is built on people sharp, committed advocates who take their work seriously
            and support each other genuinely. If that sounds like you, we'd like to talk.
          </p>
          <div className="hidden sm:flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
            {[
              { val: '12+',  label: 'Years in practice'  },
              { val: '10',   label: 'Practice areas'     },
              { val: '100%', label: 'Partner-led hiring' },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-white">{val}</p>
                <p className="text-[0.65rem] text-white/40 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-16 lg:py-24 space-y-12 sm:space-y-24">

        {/* ── Why Join Us ── */}
        <section>
          <div className="mb-6 sm:mb-12">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-4 sm:w-6 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                Why SOKLaw
              </span>
            </div>
            <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-[#0d2340] leading-tight">
              What You Actually Get Here
            </h2>
            <p className="hidden sm:block text-sm text-[#6a6a6a] max-w-md mt-2 leading-relaxed">
              Not perks on a brochure real things that matter to the people who work here.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {benefits.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="group bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:border-[#bfa06f]/60 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#bfa06f]/8 group-hover:bg-[#bfa06f]/15 mb-2 sm:mb-4 transition-colors duration-300">
                  <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#bfa06f]" />
                </div>
                <h3 className="text-[0.65rem] sm:text-sm font-bold text-[#0d2340] leading-snug mb-0.5 sm:mb-1.5">
                  {title}
                </h3>
                <p className="text-[0.6rem] sm:text-[0.8rem] text-[#6a6a6a] leading-relaxed hidden sm:block">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Core Values ── */}
        <section>
          <div className="mb-6 sm:mb-12">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-4 sm:w-6 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                How We Work
              </span>
            </div>
            <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-[#0d2340] leading-tight">
              What We Stand For
            </h2>
            <p className="hidden sm:block text-sm text-[#6a6a6a] max-w-md mt-2 leading-relaxed">
              These aren't words on a wall. They show up in how we take instructions, argue cases, and treat each other.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {values.map(({ title, description }, i) => (
              <div
                key={i}
                className="relative overflow-hidden bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:border-[#bfa06f]/40 transition-colors duration-200"
              >
                <span className="hidden sm:block absolute -right-2 -bottom-3 text-[5rem] font-black text-[#bfa06f]/[0.07] leading-none select-none pointer-events-none">
                  {i + 1}
                </span>
                <div className="flex items-start gap-2.5 sm:gap-0 relative z-10">
                  <div className="w-0.5 self-stretch bg-[#bfa06f] rounded-full flex-shrink-0 sm:hidden" />
                  <div className="min-w-0 sm:block">
                    <div className="hidden sm:flex items-center gap-2 mb-2">
                      <span className="text-xs font-black text-[#bfa06f]/50">0{i + 1}</span>
                      <span className="block h-px flex-1 bg-[#e8e0d0]" />
                    </div>
                    <h3 className="text-[0.7rem] sm:text-sm font-bold text-[#0d2340] mb-0.5 sm:mb-1.5">{title}</h3>
                    <p className="text-[0.6rem] sm:text-[0.8rem] text-[#6a6a6a] leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Open Positions ── */}
        <section>
          <div className="mb-6 sm:mb-12">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-4 sm:w-6 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                Open Roles
              </span>
            </div>
            <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-[#0d2340] leading-tight">
              Current Openings
            </h2>
            <p className="hidden sm:block text-sm text-[#6a6a6a] max-w-md mt-2 leading-relaxed">
              All roles are based at our Upperhill Gardens office in Nairobi unless otherwise stated.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#bfa06f]/10">
                <Loader2 className="h-4 w-4 text-[#bfa06f] animate-spin" />
              </div>
              <p className="text-xs text-[#6a6a6a]">Loading positions…</p>
            </div>
          ) : openPositions.length === 0 ? (
            <div className="bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-8 sm:p-14 text-center">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#bfa06f]/10 mx-auto mb-3">
                <Briefcase className="h-5 w-5 text-[#bfa06f]" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0d2340] mb-1">
                No advertised roles right now
              </p>
              <p className="text-[0.6rem] sm:text-xs text-[#6a6a6a]">
                We still want to hear from you — send an open application below.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-4">
              {openPositions.map((position) => (
                <div
                  key={position.id}
                  className="group bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-3.5 sm:p-7 hover:border-[#bfa06f]/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-xl font-bold text-[#0d2340] leading-snug truncate">
                        {position.title}
                      </h3>
                      <p className="text-[0.6rem] sm:text-sm font-semibold text-[#bfa06f] mt-0.5 uppercase tracking-wide">
                        {position.department}
                      </p>
                    </div>
                    {/* ── ✅ Gmail Compose ── */}
                    <button
                      onClick={() => openGmailApply(position)}
                      className="flex-shrink-0 flex items-center gap-1 sm:gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-[0.6rem] sm:text-sm font-semibold px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full transition-colors duration-200"
                    >
                      Apply
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <p className="text-[0.65rem] sm:text-sm text-[#4a4a4a] leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none">
                    {position.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {[
                      { icon: MapPin,    val: position.location   },
                      { icon: Clock,     val: position.type       },
                      { icon: Briefcase, val: position.experience },
                    ].filter(({ val }) => !!val).map(({ icon: Icon, val }) => (
                      <div
                        key={val}
                        className="flex items-center gap-1 sm:gap-1.5 bg-[#f9f7f1] border border-[#e8e0d0] rounded-full px-2 py-0.5 sm:px-3 sm:py-1"
                      >
                        <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f] flex-shrink-0" />
                        <span className="text-[0.55rem] sm:text-xs text-[#4a4a4a] whitespace-nowrap">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Internship CTA ── */}
        <section className="relative overflow-hidden bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-10">
          <div
            className="hidden sm:block absolute right-0 top-0 bottom-0 w-[30%] opacity-[0.06]"
            style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 20px)' }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
            <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-[#bfa06f]/12 border border-[#bfa06f]/20 flex-shrink-0">
              <GraduationCap className="h-5 w-5 sm:h-8 sm:w-8 text-[#bfa06f]" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f] mb-1">
                For Students & Graduates
              </p>
              <h2 className="text-sm sm:text-xl font-bold text-[#0d2340] mb-1 leading-snug">
                Still in Law School? We Have a Place for You.
              </h2>
              <p className="text-[0.65rem] sm:text-sm text-[#6a6a6a] leading-relaxed">
                Our internship and pupillage programs are intentionally small and intentionally serious.
                Real work, real courts, real mentors — not filing and coffee runs.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 border border-[#bfa06f] text-[#bfa06f] hover:bg-[#bfa06f] hover:text-white text-[0.65rem] sm:text-sm font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200"
            >
              See the Programs
              <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </section>

        {/* ── How We Hire ── */}
        <section>
          <div className="mb-6 sm:mb-12">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="block h-px w-4 sm:w-6 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                What to Expect
              </span>
            </div>
            <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-[#0d2340] leading-tight">
              How We Hire
            </h2>
            <p className="hidden sm:block text-sm text-[#6a6a6a] max-w-md mt-2 leading-relaxed">
              No lengthy forms or automated rejections. Our process is direct and human.
            </p>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="sm:hidden space-y-0">
            {steps.map(({ label, desc }, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-[#e8e0d0]" />
                )}
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#bfa06f] text-white text-[0.55rem] font-black flex-shrink-0 z-10">
                  {i + 1}
                </div>
                <div className="pb-5 min-w-0">
                  <h3 className="text-[0.7rem] font-bold text-[#0d2340]">{label}</h3>
                  <p className="text-[0.6rem] text-[#6a6a6a] leading-snug mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: connected cards */}
          <div className="hidden sm:grid grid-cols-4 gap-3 lg:gap-5">
            {steps.map(({ label, desc }, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute top-5 left-[calc(50%+22px)] right-[calc(-50%+22px)] h-px bg-[#e8e0d0] z-0" />
                )}
                <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5 hover:border-[#bfa06f]/40 transition-colors duration-200 relative z-10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#bfa06f] text-white text-sm font-black mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-bold text-[#0d2340] mb-1.5">{label}</h3>
                  <p className="text-xs text-[#6a6a6a] leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Open Application ── */}
        <section className="relative overflow-hidden bg-[#0d2340] rounded-xl sm:rounded-2xl p-4 sm:p-10 lg:p-14">
          <div
            className="hidden sm:block absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="block h-px w-4 sm:w-6 bg-[#bfa06f] flex-shrink-0" />
              <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
                Always Open
              </span>
            </div>
            <h2 className="text-sm sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight max-w-xl">
              Don't See Your Role Listed?
            </h2>
            <p className="text-[0.65rem] sm:text-sm text-white/55 leading-relaxed mb-4 sm:mb-7 max-w-lg">
              We grow through relationships, not just job boards. If you're a strong advocate,
              paralegal, or legal professional who believes in the kind of firm we're building —
              send us your CV. We read every one.
            </p>
            {/* ── ✅ Gmail Compose ── */}
            <button
              onClick={openGmailCV}
              className="inline-flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#d4b483] text-white text-[0.65rem] sm:text-sm font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors duration-200"
            >
              Send Your CV
              <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            </button>
            <p className="text-[0.55rem] sm:text-xs text-white/30 mt-2.5 sm:mt-3">
              <a href="mailto:careers@soklaw.co.ke" className="hover:text-white/60 transition-colors">
                careers@soklaw.co.ke
              </a>
              {' '}· Subject: "Open Application — [Your Name]"
            </p>
          </div>
        </section>
      </div>

      <Footer />

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 backdrop-blur-[2px]"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto">

            <div className="sticky top-0 bg-white border-b border-[#e8e0d0] px-4 sm:px-7 py-3.5 sm:py-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#bfa06f]/10">
                  <GraduationCap className="h-3.5 w-3.5 text-[#bfa06f]" />
                </div>
                <h2 className="text-xs sm:text-base font-bold text-[#0d2340]">
                  Internship & Pupillage at SOKLaw
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f9f7f1] hover:bg-[#e8e0d0] transition-colors"
              >
                <X className="h-3.5 w-3.5 text-[#4a4a4a]" />
              </button>
            </div>

            <div className="px-4 sm:px-7 py-4 sm:py-7 space-y-5 sm:space-y-8">

              <p className="text-[0.65rem] sm:text-sm text-[#4a4a4a] leading-relaxed border-l-2 border-[#bfa06f] pl-3 italic">
                "We've trained some of Kenya's finest young advocates. Our programs are intentionally
                small — we take fewer people so we can invest properly in each one."
              </p>

              {([
                {
                  title: 'Internship Program',
                  type: 'Internship' as const,
                  subtitle: 'For students and graduates not yet admitted to the bar',
                  eligibility: [
                    'Current law students (2nd year and above)',
                    'Recent law graduates awaiting admission',
                    'Strong academic record and genuine curiosity',
                  ],
                  features: [
                    'Duration: 3–6 months',
                    'Rotations across real practice areas — not just one desk',
                    'Legal research and drafting on live matters',
                    'Court attendance with supervising advocates',
                    'Weekly debrief sessions with a named mentor',
                    'Certificate of completion from SOK Law',
                  ],
                },
                {
                  title: 'Pupillage Program',
                  type: 'Pupillage' as const,
                  subtitle: 'For Kenya School of Law graduates awaiting admission',
                  eligibility: [
                    'Completed Kenya School of Law',
                    'Awaiting admission to the bar',
                    'Ready to commit fully for 6 months',
                  ],
                  features: [
                    'Duration: 6 months (LSK-compliant)',
                    'Hands-on work across all practice areas',
                    'Direct client interaction under partner supervision',
                    'Advocacy training and real court appearances',
                    'Structured professional development programme',
                    'Monthly stipend — we don\'t believe in free labour',
                    'High-performing pupils are considered for retention',
                  ],
                },
              ]).map(({ title, type, subtitle, eligibility, features }) => (
                <div key={title}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="block h-px w-3 bg-[#bfa06f]" />
                    <h3 className="text-[0.7rem] sm:text-sm font-bold text-[#0d2340] uppercase tracking-widest">
                      {title}
                    </h3>
                  </div>
                  <p className="text-[0.6rem] sm:text-xs text-[#bfa06f] mb-3 pl-5">{subtitle}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[{ label: 'Who Can Apply', items: eligibility }, { label: "What You'll Do", items: features }].map(({ label, items }) => (
                      <div key={label} className="bg-[#f9f7f1] border border-[#e8e0d0] rounded-xl p-3 sm:p-4">
                        <p className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest mb-2.5">
                          {label}
                        </p>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {items.map((item) => (
                            <li key={item} className="flex items-start gap-1.5">
                              <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f] mt-0.5 flex-shrink-0" />
                              <span className="text-[0.6rem] sm:text-xs text-[#4a4a4a] leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* ── ✅ Gmail Compose per program type ── */}
                  <div className="bg-[#bfa06f]/8 border border-[#bfa06f]/25 rounded-xl p-3.5 sm:p-5 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="block h-px w-3 bg-[#bfa06f]" />
                      <p className="text-[0.6rem] sm:text-xs font-bold text-[#bfa06f] uppercase tracking-widest">
                        How to Apply
                      </p>
                    </div>
                    <p className="text-[0.65rem] sm:text-sm text-[#4a4a4a] mb-2.5 leading-relaxed">
                      Send us: a cover letter telling us <em>why SOK Law specifically</em>, your CV, academic
                      transcripts, two referees, and a copy of your ID.
                    </p>
                    <button
                      onClick={() => openGmailInternship(type)}
                      className="inline-flex items-center gap-1 text-[0.65rem] sm:text-sm font-semibold text-[#bfa06f] hover:underline"
                    >
                      Apply via Gmail
                      <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                    <p className="text-[0.55rem] sm:text-xs text-[#aaa] mt-1">
                      Subject: "{type} Application"
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowModal(false)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
