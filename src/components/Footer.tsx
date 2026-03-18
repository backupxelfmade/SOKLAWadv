import React from 'react';
import { MapPin, Phone, Mail, Newspaper, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const quickLinks = [
    { label: 'Home',           href: '/',         isRoute: true  },
    { label: 'About Us',       href: '#about',    isRoute: false },
    { label: 'Our Team',       href: '/team',     isRoute: true  },
    { label: 'Legal Services', href: '/services', isRoute: true  },
    { label: 'Careers',        href: '/careers',  isRoute: true  },
    { label: 'Contact Us',     href: '/contact',  isRoute: true  },
    { label: 'Insights',           href: '#news',     isRoute: false },
  ];

  const legalServices = [
    'Corporate Law',
    'Litigation & Dispute Resolution',
    'Real Estate & Conveyancing',
    'Employment & Labour Law',
    'Family & Succession Law',
    'Criminal Law',
  ];

  const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );

  const socialLinks = [
    { Icon: XIcon,         href: 'https://twitter.com/SOK_Law',             label: 'X (Twitter)' },
    { Icon: LinkedinIcon,  href: 'https://www.linkedin.com/company/soklaw', label: 'LinkedIn'    },
    { Icon: InstagramIcon, href: 'https://www.instagram.com/soklaw',        label: 'Instagram'   },
  ];

  const handleNavigation = (href: string, isRoute: boolean) => {
    if (isRoute) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      const scrollTo = () => {
        const el = document.querySelector(href);
        if (el) {
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth',
          });
        }
      };
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(scrollTo, 100);
      } else {
        scrollTo();
      }
    }
  };

  return (
    <footer className="bg-[#f9f7f1] border-t border-[#e8e0d0]">

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-10 sm:pb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

          {/* ── Col 1 — Brand ── */}
          <div className="col-span-2 lg:col-span-1">
            <img
              src="https://soklaw.co.ke/images/logo.png"
              alt="SOKLAW Logo"
              className="h-9 sm:h-10 w-auto mb-3"
            />
            <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-[#bfa06f] mb-3 leading-relaxed">
              SOK Law
            </p>
            <p className="text-[0.7rem] sm:text-sm text-[#6a6a6a] leading-relaxed mb-5 max-w-xs">
              A full-service law firm in Nairobi offering strategic, dependable
              legal solutions with integrity and diligence.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e8e0d0] hover:bg-[#bfa06f] text-[#6a6a6a] hover:text-white transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2 — Quick Links ── */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="block h-px w-4 bg-[#bfa06f]" />
              <h4 className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavigation(link.href, link.isRoute)}
                    className="group flex items-center gap-1.5 text-[0.7rem] sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors duration-200 text-left"
                  >
                    <ArrowRight className="h-2.5 w-2.5 text-[#bfa06f] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 — Practice Areas ── */}
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="block h-px w-4 bg-[#bfa06f]" />
              <h4 className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Practice Areas
              </h4>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {legalServices.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => handleNavigation('/services', true)}
                    className="group flex items-center gap-1.5 text-[0.7rem] sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors duration-200 text-left"
                  >
                    <ArrowRight className="h-2.5 w-2.5 text-[#bfa06f] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4 — Contact ── */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="block h-px w-4 bg-[#bfa06f]" />
              <h4 className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-widest text-[#bfa06f]">
                Nairobi Office
              </h4>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-5">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#bfa06f] mt-0.5 flex-shrink-0" />
                <span className="text-[0.7rem] sm:text-sm text-[#4a4a4a] leading-relaxed">
                  Upperhill Gardens, Block D11, 3rd Ngong Avenue,
                  Milimani Area opp Kenya National Library Service
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-[#bfa06f] flex-shrink-0" />
                <a
                  href="tel:+254705263776"
                  className="text-[0.7rem] sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                >
                  +254 705 263 776
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-[#bfa06f] flex-shrink-0" />
                <a
                  href="mailto:info@soklaw.co.ke"
                  className="text-[0.7rem] sm:text-sm text-[#4a4a4a] hover:text-[#bfa06f] transition-colors"
                >
                  info@soklaw.co.ke
                </a>
              </li>
            </ul>

            {/* Blog CTA */}
            <button
              onClick={() => handleNavigation('#news', false)}
              className="group flex items-center gap-2 text-[0.7rem] sm:text-xs font-semibold text-[#bfa06f] hover:text-white border border-[#bfa06f]/50 hover:border-[#bfa06f] hover:bg-[#bfa06f] px-3.5 py-2 rounded-full transition-all duration-200"
            >
              <Newspaper className="h-3.5 w-3.5" />
              <span>Latest Insights</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[#e8e0d0]" />

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 pb-20 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Partner logos */}
          <div className="flex items-center gap-4 order-2 sm:order-1">
            {[
              { href: 'https://kenyalaw.org',  src: 'https://soklaw.co.ke/images/KLR-logo.jpg',             alt: 'Kenya Law Reports'    },
              { href: 'https://www.lsk.or.ke', src: 'https://soklaw.co.ke/images/law-society-of-kenya.jpg', alt: 'Law Society of Kenya' },
            ].map(({ href, src, alt }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${alt}`}
                className="group relative block"
              >
                <img
                  src={src}
                  alt={alt}
                  className="h-9 sm:h-10 w-auto rounded opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                />
                <span className="absolute inset-0 rounded border border-transparent group-hover:border-[#bfa06f]/50 transition-all duration-200 pointer-events-none" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[0.65rem] sm:text-xs text-[#6a6a6a] text-center order-1 sm:order-2">
            © {new Date().getFullYear()} SOKLAW Advocates. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
