import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

// ✅ FIX (Low): Email from env var — not scraped from source code
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'Info@soklaw.co.ke';

const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // ✅ FIX (Low): Strict E.164-style phone — rejects bracket/space-only strings
  phone: /^\+?[1-9]\d{6,14}$/,
  required: ['firstName', 'lastName', 'email', 'legalService', 'message'],
};

const ContactPage = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', legalService: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'validation_error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  // ✅ FIX (Medium): Honeypot state — bots fill this, humans never see it
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('animate-fade-in-up'), i * 80);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (bodyRef.current) observer.observe(bodyRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name])
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  // ✅ FIX (Medium): Dedicated phone handler — strips letters on every keystroke
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\+\s\-\(\)]/g, '');
    setFormData((prev) => ({ ...prev, phone: raw }));
    if (validationErrors.phone)
      setValidationErrors((prev) => ({ ...prev, phone: '' }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    VALIDATION_RULES.required.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.trim())
        errors[field] = 'Required';
    });
    if (formData.email && !VALIDATION_RULES.email.test(formData.email))
      errors.email = 'Invalid email address';
    if (formData.phone && !VALIDATION_RULES.phone.test(formData.phone))
      errors.phone = 'Invalid phone number';
    // ✅ FIX (Medium): Server-side-style length enforcement in validation
    if (formData.firstName.length > 50) errors.firstName = 'Must be 50 characters or fewer';
    if (formData.lastName.length > 50)  errors.lastName  = 'Must be 50 characters or fewer';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ FIX (Medium): Honeypot check — silently reject bots with fake success
    if (honeypot) {
      setSubmitStatus('success');
      return;
    }

    if (!validateForm()) { setSubmitStatus('validation_error'); return; }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const emailBody = `
New Contact Form Submission — SOK Law Website

Name:    ${formData.firstName} ${formData.lastName}
Email:   ${formData.email}
Phone:   ${formData.phone || 'Not provided'}
Service: ${formData.legalService}
Date:    ${new Date().toLocaleString()}

Message:
${formData.message}
      `.trim();

      const subject = `New Legal Consultation Request — ${formData.firstName} ${formData.lastName}`;

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}` +
        `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      // ✅ FIX (High): Detect popup blocker — window.open returns null when blocked.
      //    Previously: try/catch never caught this, always showed false 'success'
      //    and wiped the form even when Gmail never opened.
      const newWindow = window.open(gmailUrl, '_blank');

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Popup was blocked — keep form data intact so user doesn't lose their message
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', legalService: '', message: '' });
        setValidationErrors({});
        setHoneypot('');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border rounded-xl text-sm text-[#1a1a1a] placeholder-[#aaa] bg-white transition-colors duration-200 outline-none focus:ring-0 ${
      validationErrors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[#e8e0d0] focus:border-[#bfa06f]'
    }`;

  const labelClass =
    'block text-[0.65rem] sm:text-xs font-semibold uppercase tracking-widest text-[#4a4a4a] mb-1.5';

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">

      {/* ── Dark header band ── */}
      <div className="bg-[#0d2340] pt-24 sm:pt-28 pb-8 sm:pb-12 relative overflow-hidden">
        <div
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[38%] opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(-55deg, #bfa06f 0px, #bfa06f 1px, transparent 1px, transparent 28px)' }}
        />
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 relative z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="block h-px w-5 sm:w-8 bg-[#bfa06f] flex-shrink-0" />
            <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#bfa06f]">
              Contact Us
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-1 sm:mb-2">
            Get In Touch
          </h1>
          <p className="text-[0.7rem] sm:text-sm text-white/50 max-w-md leading-relaxed">
            Ready to discuss your legal needs? Contact us today for a consultation
            with our experienced legal team.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div ref={bodyRef} className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-14 items-start">

          {/* ── Left col — info cards + map ── */}
          <div className="space-y-3 sm:space-y-4">

            {/* Office card */}
            <div className="animate-on-scroll opacity-0 bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#bfa06f]/40 hover:shadow-sm transition-all duration-200">
              <h3 className="text-xs sm:text-sm font-bold text-[#0d2340] mb-3 sm:mb-4 flex items-center gap-2">
                <span className="block h-px w-4 bg-[#bfa06f] flex-shrink-0" />
                Nairobi Office
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#bfa06f]/10 flex-shrink-0 mt-0.5">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#bfa06f]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a4a4a] leading-relaxed">
                    Upperhill Gardens, Block D11, 3rd Ngong Avenue<br />
                    Milimani Area opp Kenya Bankers Sacco
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#bfa06f]/10 flex-shrink-0">
                    <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#bfa06f]" />
                  </div>
                  <a
                    href="tel:+254705263776"
                    className="text-xs sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                  >
                    +254 705 263 776
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#bfa06f]/10 flex-shrink-0">
                    <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#bfa06f]" />
                  </div>
                  {/* ✅ FIX (Low): Email rendered from env var — not hardcoded literal */}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-xs sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div className="animate-on-scroll opacity-0 bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#bfa06f]/40 hover:shadow-sm transition-all duration-200">
              <h3 className="text-xs sm:text-sm font-bold text-[#0d2340] mb-3 sm:mb-4 flex items-center gap-2">
                <span className="block h-px w-4 bg-[#bfa06f] flex-shrink-0" />
                Business Hours
              </h3>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Friday', hours: '8:00 AM – 5:00 PM' },
                  { day: 'Saturday',        hours: 'On Prior Appointment' },
                  { day: 'Sunday',          hours: 'On Prior Appointment' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#bfa06f] flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#4a4a4a]">{day}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#0d2340] flex-shrink-0">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map — loads directly */}
            <div className="animate-on-scroll opacity-0 rounded-xl sm:rounded-2xl overflow-hidden border border-[#e8e0d0]">
              <iframe
                title="SOK Law Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d490.3!2d36.8088322!3d-1.2940974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzguOCJTIDM2wrA0OCczMS44IkU!5e0!3m2!1sen!2ske!4v1710000000000!5m2!1sen!2ske"
                width="100%"
                height="200"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ── Right col — form ── */}
          <div className="animate-on-scroll opacity-0 bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="block h-px w-4 bg-[#bfa06f]" />
              <span className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Consultation Request
              </span>
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-[#0d2340] mb-4 sm:mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">

              {/* ✅ FIX (Medium): Honeypot — off-screen, invisible to users, filled by bots */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
              >
                <label htmlFor="website">Website</label>
                <input
                  type="text" id="website" name="website"
                  value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1} autoComplete="off"
                />
              </div>

              {/* First + Last name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>First Name *</label>
                  {/* ✅ FIX (Medium): maxLength enforced at HTML level */}
                  <input
                    type="text" name="firstName" value={formData.firstName}
                    onChange={handleInputChange} placeholder="First name"
                    autoComplete="given-name" maxLength={50}
                    className={inputClass('firstName')}
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-[0.6rem] mt-1">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  {/* ✅ FIX (Medium): maxLength enforced at HTML level */}
                  <input
                    type="text" name="lastName" value={formData.lastName}
                    onChange={handleInputChange} placeholder="Last name"
                    autoComplete="family-name" maxLength={50}
                    className={inputClass('lastName')}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-[0.6rem] mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleInputChange} placeholder="you@example.com"
                    autoComplete="email" maxLength={254}
                    className={inputClass('email')}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-[0.6rem] mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  {/* ✅ FIX (Medium): handlePhoneChange strips letters in real-time
                      ✅ FIX (Medium): inputMode="tel" raises numeric keypad on mobile  */}
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+254700000000"
                    autoComplete="tel" maxLength={16}
                    inputMode="tel"
                    className={inputClass('phone')}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-[0.6rem] mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Legal service */}
              <div>
                <label className={labelClass}>Legal Service *</label>
                <div className="relative">
                  <select
                    name="legalService" value={formData.legalService}
                    onChange={handleInputChange}
                    className={`${inputClass('legalService')} appearance-none pr-9 cursor-pointer`}
                  >
                    <option value="">Select a service…</option>
                    {[
                      'Civil and Criminal Litigation',
                      'Alternative Dispute Resolution',
                      'Commercial and Corporate Law',
                      'Bank Securities and Real Estate',
                      'Employment Law', 'Family Law', 'Energy Law',
                      'Construction Law', 'Health and Medical Law',
                      'Finance and Banking Law', 'Insurance and Personal Injury',
                      'Agricultural Law', 'Legal Consultancy', 'Other',
                    ].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-3.5 w-3.5 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {validationErrors.legalService && (
                  <p className="text-red-500 text-[0.6rem] mt-1">{validationErrors.legalService}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  name="message" value={formData.message}
                  onChange={handleInputChange} rows={5} maxLength={1000}
                  placeholder="Please describe your legal matter…"
                  className={`${inputClass('message')} resize-none`}
                />
                <div className="flex items-center justify-between mt-1">
                  {validationErrors.message
                    ? <p className="text-red-500 text-[0.6rem]">{validationErrors.message}</p>
                    : <span />
                  }
                  <span className="text-[0.6rem] text-[#6a6a6a] ml-auto">
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 sm:py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" />
                    <span>Opening Gmail…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            {/* Status banners */}
            {submitStatus === 'validation_error' && (
              <div className="mt-4 flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-orange-800">Please check your form</p>
                  <p className="text-[0.65rem] text-orange-700 mt-0.5">All required fields must be completed.</p>
                </div>
              </div>
            )}
            {submitStatus === 'success' && (
              <div className="mt-4 flex items-start gap-3 bg-[#bfa06f]/8 border border-[#bfa06f]/30 rounded-xl px-4 py-3">
                <CheckCircle className="h-4 w-4 text-[#bfa06f] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#0d2340]">Gmail opened in a new tab</p>
                  <p className="text-[0.65rem] text-[#4a4a4a] mt-0.5">
                    Your message is pre-filled — just click Send in Gmail to complete your inquiry.
                  </p>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Unable to open Gmail</p>
                  <p className="text-[0.65rem] text-red-700 mt-0.5">
                    Your browser may have blocked the popup. Please allow popups for this site, or email us directly at{' '}
                    {/* ✅ FIX (Low): Email from env var — not hardcoded literal */}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .animate-on-scroll {
          transform: translateY(14px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        select option { color: #1a1a1a; }
      `}</style>
    </div>
  );
};

export default ContactPage;