import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Scale, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home', isRoute: true },
    { href: '#about', label: 'About', isRoute: false },
    { href: '/services', label: 'Legal Services', isRoute: true },
    { href: '/team', label: 'Team', isRoute: true },
    { href: '/gallery', label: 'Media Gallery', isRoute: true },
    { href: '/careers', label: 'Careers', isRoute: true },
    { href: '/blog', label: 'Insights', isRoute: true },
    { href: '/contact', label: 'Contact', isRoute: true },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavigation = useCallback(
    (link: { href: string; isRoute: boolean }) => {
      setIsOpen(false);
      if (link.isRoute) {
        navigate(link.href);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        const scrollToEl = () => {
          const el = document.querySelector(link.href);
          if (!el) return;
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth',
          });
        };
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(scrollToEl, 100);
        } else {
          scrollToEl();
        }
      }
    },
    [navigate, location.pathname]
  );

  const isActiveLink = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname === href;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#f9f7f1]/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">

            {/* ── Logo ── */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="flex flex-col gap-0.5 flex-shrink-0 group"
            >
              <div className="flex items-center gap-2">
                <Scale
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300 ${
                    isScrolled ? 'text-[#bfa06f]' : 'text-[#bfa06f]'
                  }`}
                />
                <img
                  src="https://soklaw.co.ke/images/logo.png"
                  alt="SOK Law"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p
                className={`text-[7px] sm:text-[8px] md:text-[9px] font-semibold tracking-[0.15em] uppercase leading-tight transition-colors duration-300 ${
                  isScrolled ? 'text-[#7a6245]' : 'text-white/70'
                }`}
              >
                {/* Simiyu, Opondo, Kiranga & Company Advocates */}
              </p>
            </Link>

            {/* ── Desktop Links ── */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link)}
                  className={`relative px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 group ${
                    isActiveLink(link.href)
                      ? isScrolled
                        ? 'text-[#bfa06f]'
                        : 'text-[#bfa06f]'
                      : isScrolled
                      ? 'text-gray-600 hover:text-[#bfa06f]'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-[#bfa06f] transition-all duration-300 ${
                      isActiveLink(link.href)
                        ? 'w-4/5'
                        : 'w-0 group-hover:w-4/5'
                    }`}
                  />
                </button>
              ))}

              {/* Desktop CTA */}
              <button
                onClick={() => handleNavigation({ href: '/contact', isRoute: true })}
                className="ml-3 lg:ml-4 flex items-center gap-1.5 bg-[#bfa06f] hover:bg-[#a08a5f] text-white text-xs lg:text-sm font-semibold px-4 lg:px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className={`md:hidden relative z-50 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
                isScrolled || isOpen
                  ? 'bg-white/90 text-gray-700 shadow-sm'
                  : 'bg-white/10 text-white backdrop-blur-sm'
              }`}
            >
              <span
                className={`absolute transition-all duration-200 ${
                  isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
                }`}
              >
                <X className="h-5 w-5" />
              </span>
              <span
                className={`absolute transition-all duration-200 ${
                  isOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
                }`}
              >
                <Menu className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[75vw] max-w-[320px] z-50 md:hidden
          bg-[#f9f7f1] shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e0d0]">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#bfa06f]" />
            <span className="text-[9px] font-semibold tracking-widest uppercase text-[#7a6245]">
              SOK Law
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e8e0d0] text-gray-600 hover:bg-[#bfa06f] hover:text-white transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavigation(link)}
              style={{ transitionDelay: isOpen ? `${i * 30}ms` : '0ms' }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActiveLink(link.href)
                  ? 'bg-[#bfa06f]/10 text-[#bfa06f]'
                  : 'text-gray-700 hover:bg-[#bfa06f]/10 hover:text-[#bfa06f]'
              }`}
            >
              <span>{link.label}</span>
              <ArrowRight
                className={`h-3.5 w-3.5 transition-all duration-200 ${
                  isActiveLink(link.href)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Panel footer CTA */}
        <div className="px-5 py-5 border-t border-[#e8e0d0]">
          <button
            onClick={() => handleNavigation({ href: '/contact', isRoute: true })}
            className="w-full flex items-center justify-center gap-2 bg-[#bfa06f] hover:bg-[#a08a5f] text-white font-semibold text-sm px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-3">
            Confidential, no-obligation consultation
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
