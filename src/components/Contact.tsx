import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Navigation } from 'lucide-react';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'Info@soklaw.co.ke';

const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{6,14}$/,
  required: ['firstName', 'lastName', 'email', 'legalService', 'message'],
};

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', legalService: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'validation_error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('animate-fade-in-up'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
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

  // ✅ FIX: Strip letters and disallowed characters from phone input in real-time
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only: digits, +, spaces, hyphens, parentheses
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
    if (formData.firstName.length > 50) errors.firstName = 'Must be 50 characters or fewer';
    if (formData.lastName.length > 50)  errors.lastName  = 'Must be 50 characters or fewer';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      setSubmitStatus('success');
      return;
    }

    if (!validateForm()) { setSubmitStatus('validation_error'); return; }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // ✅ FIX (High): PII now sent to your Netlify function over HTTPS POST body —
      //    never appears in a URL, browser history, or proxy logs.
      const response = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:    formData.firstName,
          lastName:     formData.lastName,
          email:        formData.email,
          phone:        formData.phone || 'Not provided',
          legalService: formData.legalService,
          message:      formData.message,
          submittedAt:  new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        // Surface server validation errors (e.g. 400) vs server faults (500)
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', legalService: '', message: '' });
      setValidationErrors({});
      setHoneypot('');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base text-[#1a1a1a] placeholder-[#aaa] bg-white transition-colors duration-200 outline-none focus:ring-0 ${
      validationErrors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[#e8e0d0] focus:border-[#bfa06f]'
    }`;

  const labelClass = 'block text-[0.7rem] sm:text-xs font-semibold uppercase tracking-widest text-[#4a4a4a] mb-1.5';

  return (
    <section ref={sectionRef} id="contact" className="py-10 sm:py-20 lg:py-28 bg-[#f9f7f1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

        {/* ── Section header ── */}
        <div className="mb-8 sm:mb-14">
          <div className="animate-on-scroll opacity-0 flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className="block h-px w-5 sm:w-6 bg-[#bfa06f]" />
            <span className="text-[0.6rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
              Contact Us
            </span>
          </div>
          <h2 className="animate-on-scroll opacity-0 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
            Get In Touch
          </h2>
          <p className="animate-on-scroll opacity-0 hidden sm:block text-base text-[#4a4a4a] max-w-xl mt-3 leading-relaxed">
            Ready to discuss your legal needs? Contact us today for a consultation
            with our experienced legal team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-start">

          {/* ── Left col — info ── */}
          <div className="space-y-4 sm:space-y-5">

            {/* Office card */}
            <div className="animate-on-scroll opacity-0 bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <span className="block h-px w-4 bg-[#bfa06f]" />
                Nairobi Office
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#bfa06f]/10 flex-shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#bfa06f]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#4a4a4a] leading-relaxed whitespace-pre-line">
                    {'Upperhill Gardens, Block D11, 3rd Ngong Avenue\nMilimani Area opp Kenya Bankers Sacco'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#bfa06f]/10 flex-shrink-0">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#bfa06f]" />
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
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#bfa06f]" />
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-xs sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div className="animate-on-scroll opacity-0 bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <span className="block h-px w-4 bg-[#bfa06f]" />
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
                      <Clock className="h-3 w-3 text-[#bfa06f] flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#4a4a4a]">{day}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ REDESIGNED: Map consent placeholder styled to match the site's aesthetic */}
            <div className="animate-on-scroll opacity-0 rounded-xl sm:rounded-2xl overflow-hidden border border-[#e8e0d0] shadow-sm">
              {mapLoaded ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d490.3!2d36.8088322!3d-1.2940974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzguOCJTIDM2wrA0OCczMS44IkU!5e0!3m2!1sen!2ske!4v1710000000000!5m2!1sen!2ske"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SOK Law Office Location"
                />
              ) : (
                /* Consent placeholder — dot-grid map texture + address preview */
                <div className="relative w-full h-[220px] bg-[#f0ebe0] overflow-hidden">

                  {/* Decorative dot-grid background — evokes a map without loading one */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="#bfa06f" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                  </svg>

                  {/* Fake road lines for map feel */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="80"  x2="100%" y2="80"  stroke="#bfa06f" strokeWidth="6" />
                    <line x1="0" y1="150" x2="100%" y2="150" stroke="#bfa06f" strokeWidth="3" />
                    <line x1="90"  y1="0" x2="90"  y2="100%" stroke="#bfa06f" strokeWidth="4" />
                    <line x1="200" y1="0" x2="200" y2="100%" stroke="#bfa06f" strokeWidth="2" />
                    <line x1="310" y1="0" x2="310" y2="100%" stroke="#bfa06f" strokeWidth="3" />
                  </svg>

                  {/* Gradient overlay — fades from bottom for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f0ebe0]/90 via-[#f0ebe0]/40 to-transparent" />

                  {/* Address preview pill — top left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-[#e8e0d0] rounded-full px-3 py-1 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#bfa06f] flex-shrink-0" />
                    <span className="text-[0.6rem] font-semibold text-[#1a1a1a] truncate max-w-[180px]">
                      Upperhill Gardens, 3rd Ngong Ave
                    </span>
                  </div>

                  {/* Centre CTA */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {/* Pin icon with pulse ring */}
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-12 h-12 rounded-full bg-[#bfa06f]/20 animate-ping" />
                      <div className="relative z-10 w-10 h-10 rounded-full bg-white shadow-md border border-[#e8e0d0] flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-[#bfa06f]" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMapLoaded(true)}
                      className="flex items-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <Navigation className="h-3 w-3" />
                      View on Google Maps
                    </button>

                    <p className="text-[0.58rem] text-[#6a6a6a]">
                      Loads Google Maps · Third-party content
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right col — form ── */}
          <div className="animate-on-scroll opacity-0 bg-white border border-[#e8e0d0] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="block h-px w-4 bg-[#bfa06f]" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Consultation Request
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-[#1a1a1a] mb-5 sm:mb-7">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Honeypot */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="website">Website</label>
                <input
                  type="text" id="website" name="website"
                  value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1} autoComplete="off"
                />
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    type="text" name="firstName" value={formData.firstName}
                    onChange={handleInputChange} placeholder="First name"
                    autoComplete="given-name" maxLength={50}
                    className={inputClass('firstName')}
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-[0.65rem] mt-1">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    type="text" name="lastName" value={formData.lastName}
                    onChange={handleInputChange} placeholder="Last name"
                    autoComplete="family-name" maxLength={50}
                    className={inputClass('lastName')}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-[0.65rem] mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email + Phone row */}
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
                    <p className="text-red-500 text-[0.65rem] mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  {/* ✅ FIX: Uses dedicated handlePhoneChange that strips letters on every keystroke */}
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+254700000000"
                    autoComplete="tel" maxLength={16}
                    inputMode="tel"
                    className={inputClass('phone')}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-[0.65rem] mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Service */}
              <div>
                <label className={labelClass}>Legal Service *</label>
                <div className="relative">
                  <select
                    name="legalService" value={formData.legalService}
                    onChange={handleInputChange}
                    className={`${inputClass('legalService')} appearance-none pr-9`}
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
                    <svg className="h-4 w-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {validationErrors.legalService && (
                  <p className="text-red-500 text-[0.65rem] mt-1">{validationErrors.legalService}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  name="message" value={formData.message}
                  onChange={handleInputChange} rows={4} maxLength={1000}
                  placeholder="Please describe your legal matter…"
                  className={`${inputClass('message')} resize-none`}
                />
                <div className="flex items-center justify-between mt-1">
                  {validationErrors.message
                    ? <p className="text-red-500 text-[0.65rem]">{validationErrors.message}</p>
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
                className="w-full flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                {isSubmitting
                  ? <><span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" /><span>Sending…</span></>
                  : <><Send className="h-4 w-4" /><span>Send Message</span></>
                }
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
                  <p className="text-xs font-semibold text-[#1a1a1a]">Message sent successfully</p>
                  <p className="text-[0.65rem] text-[#4a4a4a] mt-0.5">
                    Thank you! We'll be in touch within one business day.
                  </p>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Message could not be sent</p>
                  <p className="text-[0.65rem] text-red-700 mt-0.5">
                    Please try again or email us directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-on-scroll {
          transform: translateY(16px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        select option { color: #1a1a1a; }
      `}</style>
    </section>
  );
};

export default Contact;
