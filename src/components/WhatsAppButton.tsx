import React, { useState, useRef, useEffect, useCallback } from 'react';

const PROFILE_IMAGE = '/images/support-avatar.jpg';

// ── Message pool per route ──
// Multiple messages per route so repeat check-ins feel fresh
const ROUTE_MESSAGES: Record<string, { heading: string; body: string }[]> = {
  '/': [
    { heading: "Welcome to SOK Law 👋",          body: "Feel free to ask us anything — we're here to help." },
    { heading: "Still exploring?",                body: "Our team is online if you have any questions." },
    { heading: "Need legal guidance?",            body: "We're just a message away whenever you're ready." },
  ],
  '#about': [
    { heading: "Getting to know us?",             body: "We'd love to tell you more about our firm directly." },
    { heading: "Have any questions about us?",    body: "Our team is happy to chat." },
  ],
  '/services': [
    { heading: "Looking for the right service?",  body: "We can help figure out what fits your situation." },
    { heading: "Not sure where to start?",        body: "Just send us a message — no commitment needed." },
    { heading: "Seen something relevant?",        body: "Our advocates can walk you through any of our services." },
  ],
  '/team': [
    { heading: "Want to speak to someone?",       body: "We'll connect you with the right advocate." },
    { heading: "Have a question for our team?",   body: "Reach out — we're happy to help." },
  ],
  '/gallery': [
    { heading: "Curious about our work?",         body: "We're available if you'd like to know more." },
    { heading: "Got questions about what you see?", body: "Just ask — we're right here." },
  ],
  '/careers': [
    { heading: "Interested in joining us?",       body: "Chat with us about opportunities at SOK Law." },
    { heading: "Want to know more about a role?", body: "We're happy to answer any questions." },
  ],
  '/blog': [
    { heading: "Have a related legal question?",  body: "We're happy to help with anything you're reading about." },
    { heading: "Found this useful?",              body: "If you need legal advice, our team is here." },
  ],
  '/contact': [
    { heading: "Prefer a faster reply?",          body: "WhatsApp us directly — we typically respond right away." },
  ],
};

// Milestone-based scroll messages — shown at specific scroll depths
const SCROLL_MILESTONES: { pct: number; heading: string; body: string }[] = [
  { pct: 0.30, heading: "Reading through?",        body: "Let us know if anything catches your eye." },
  { pct: 0.60, heading: "Still with us? 😊",        body: "We're here if you'd like to talk through anything." },
  { pct: 0.90, heading: "Reached the bottom!",      body: "Didn't find what you needed? Just ask us directly." },
];

const WhatsAppButton = () => {
  const [open, setOpen]               = useState(false);
  const [message, setMessage]         = useState('');
  const [showTeaser, setShowTeaser]   = useState(false);
  const [teaser, setTeaser]           = useState<{ heading: string; body: string } | null>(null);
  const [imgError, setImgError]       = useState(false);
  const textareaRef                   = useRef<HTMLTextAreaElement>(null);

  // Tracking refs
  const hideTimer                     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkInTimer                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageIndex                  = useRef(0);       // cycles through route messages
  const checkInCount                  = useRef(0);       // total check-ins shown this session
  const shownMilestones               = useRef<Set<number>>(new Set());
  const lastScrollY                   = useRef(0);
  const scrollActive                  = useRef(false);   // true when user is actively scrolling
  const scrollTimeout                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phoneNumber    = '+254720738641';
  const defaultMessage = 'Hello, I would like to inquire about your legal services.';
  const MAX_CHECKINS   = 3; // never show more than 3 popups per session

  const getRouteMessages = useCallback((): { heading: string; body: string }[] => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (hash === '#about') return ROUTE_MESSAGES['#about'];
    return ROUTE_MESSAGES[path] ?? ROUTE_MESSAGES['/'];
  }, []);

  // ── Display teaser ──
  const showMsg = useCallback((msg: { heading: string; body: string }, duration = 8000) => {
    if (open) return;
    if (checkInCount.current >= MAX_CHECKINS) return;

    // Clear any existing auto-hide
    if (hideTimer.current) clearTimeout(hideTimer.current);

    checkInCount.current += 1;
    setTeaser(msg);
    setShowTeaser(true);

    hideTimer.current = setTimeout(() => setShowTeaser(false), duration);
  }, [open]);

  // ── Trigger 1: First load — 2s warm welcome ──
  useEffect(() => {
    const t = setTimeout(() => {
      const msgs = getRouteMessages();
      showMsg(msgs[0], 7000);
      messageIndex.current = 1;
    }, 2000);
    return () => clearTimeout(t);
  }, [showMsg, getRouteMessages]);

  // ── Trigger 2: Scroll milestones ──
  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone.pct && !shownMilestones.current.has(milestone.pct)) {
          shownMilestones.current.add(milestone.pct);
          // Small delay so it doesn't fire mid-scroll
          setTimeout(() => showMsg({ heading: milestone.heading, body: milestone.body }, 8000), 800);
        }
      }

      // Track scroll activity
      lastScrollY.current = window.scrollY;
      scrollActive.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => { scrollActive.current = false; }, 1500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showMsg]);

  // ── Trigger 3: Periodic check-ins every 40s while user is on page ──
  // Only fires if user has scrolled at least a little (engaged, not AFK)
  useEffect(() => {
    checkInTimer.current = setInterval(() => {
      if (open) return;
      if (checkInCount.current >= MAX_CHECKINS) {
        if (checkInTimer.current) clearInterval(checkInTimer.current);
        return;
      }
      // Only check in if user has scrolled since last check-in
      if (lastScrollY.current > 100) {
        const msgs = getRouteMessages();
        const idx  = messageIndex.current % msgs.length;
        showMsg(msgs[idx], 8000);
        messageIndex.current += 1;
      }
    }, 40000);

    return () => { if (checkInTimer.current) clearInterval(checkInTimer.current); };
  }, [open, showMsg, getRouteMessages]);

  // Close teaser when chat opens
  useEffect(() => {
    if (open) {
      setShowTeaser(false);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    }
  }, [open]);

  useEffect(() => {
    if (open && textareaRef.current) textareaRef.current.focus();
  }, [open]);

  // Cleanup
  useEffect(() => () => {
    if (hideTimer.current)   clearTimeout(hideTimer.current);
    if (checkInTimer.current) clearInterval(checkInTimer.current);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
  }, []);

  const handleSend = () => {
    const text = message.trim() || defaultMessage;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setMessage('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  const Avatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const dims     = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-8 h-8' };
    const iconDims = { sm: 'w-3 h-3', md: 'w-5 h-5',   lg: 'w-4 h-4' };
    return !imgError ? (
      <img src={PROFILE_IMAGE} alt="SOK Law Support"
        onError={() => setImgError(true)}
        className={`${dims[size]} rounded-full object-cover`} />
    ) : (
      <div className={`${dims[size]} rounded-full bg-[#075e54] flex items-center justify-center text-white`}>
        <WhatsAppIcon className={iconDims[size]} />
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes teaserIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes teaserOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(6px); }
        }
        .wa-chatbox { animation: fadeInUp 0.25s ease-out; }
        .wa-teaser  { animation: teaserIn 0.3s ease-out forwards; }
      `}</style>

      {/* ── Teaser Popup ── */}
      {showTeaser && !open && teaser && (
        <div className="wa-teaser fixed bottom-[88px] right-4 sm:right-6 z-50 w-64">
          <div className="relative bg-white rounded-2xl rounded-br-sm overflow-hidden
            shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100">

            {/* Top green bar */}
            <div className="h-[3px] w-full bg-[#25d366]" />

            <div className="p-3.5">
              {/* Header row */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative flex-shrink-0">
                  <Avatar size="lg" />
                  {/* Online ring */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25d366] border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-bold text-gray-800 truncate">SOK Law</p>
                    {/* Typing indicator dots */}
                    <span className="flex items-center gap-[3px] ml-0.5">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1 h-1 rounded-full bg-[#25d366]"
                          style={{
                            animation: `bounce 1s ${delay}ms infinite`,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#25d366] font-medium">● Online now</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => setShowTeaser(false)}
                  className="text-gray-300 hover:text-gray-400 transition-colors flex-shrink-0 self-start"
                  aria-label="Dismiss"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Message bubble */}
              <div className="bg-[#f0fdf4] border border-[#25d366]/15 rounded-xl rounded-tl-sm px-3 py-2.5 mb-3">
                <p className="text-[11px] font-semibold text-gray-800 leading-snug mb-0.5">
                  {teaser.heading}
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {teaser.body}
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => { setOpen(true); setShowTeaser(false); }}
                className="w-full flex items-center justify-center gap-1.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white text-[11px] font-semibold py-2 rounded-xl transition-colors duration-200"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                Reply on WhatsApp
              </button>
            </div>

            {/* Bubble tail */}
            <div className="absolute -bottom-[9px] right-5 w-0 h-0
              border-l-[9px] border-l-transparent
              border-t-[9px] border-t-white" />
            <div className="absolute -bottom-[11px] right-[19px] w-0 h-0
              border-l-[10px] border-l-transparent
              border-t-[10px] border-t-gray-100"
              style={{ zIndex: -1 }} />
          </div>
        </div>
      )}

      {/* ── Chatbox ── */}
      {open && (
        <div className="wa-chatbox fixed bottom-[88px] right-4 sm:right-6 z-50 w-[300px] sm:w-[320px] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col">
          <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <Avatar size="md" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4ade80] border-2 border-[#075e54]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">SOK Law</p>
              <p className="text-white/50 text-[11px]">Simiyu, Opondo, Kiranga & Advocates</p>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className="px-4 py-4 flex flex-col gap-2"
            style={{
              background: '#e5ddd5',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="flex items-end gap-1.5 max-w-[88%]">
              <div className="flex-shrink-0 mb-0.5"><Avatar size="sm" /></div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
                <p className="text-[11px] font-bold text-[#075e54] mb-0.5">SOK Law</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  👋 Hello! Welcome to{' '}
                  <span className="font-semibold">Simiyu, Opondo, Kiranga & Advocates</span>.
                  How can we assist you today?
                </p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMessage(defaultMessage)}
              className="self-end bg-white/80 hover:bg-white border border-[#25d366]/30 hover:border-[#25d366] text-xs text-gray-600 hover:text-[#075e54] rounded-full px-3 py-1.5 transition-all duration-200 shadow-sm"
            >
              ⚖️ {defaultMessage.length > 36 ? defaultMessage.slice(0, 36) + '…' : defaultMessage}
            </button>
          </div>

          <div className="flex items-end gap-2 px-3 py-2.5 bg-[#f0f0f0] border-t border-gray-200">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none rounded-3xl border-0 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25d366]/30 transition-all leading-5 max-h-24 overflow-y-auto shadow-sm"
              style={{ scrollbarWidth: 'none' }}
            />
            <button onClick={handleSend} aria-label="Send message"
              className="flex-shrink-0 w-9 h-9 rounded-full bg-[#25d366] hover:bg-[#1ebe5d] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 active:scale-95">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 translate-x-0.5">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          <div className="bg-[#f0f0f0] pb-2.5 flex items-center justify-center gap-1.5">
            <WhatsAppIcon className="w-3 h-3 text-[#25d366]" />
            <span className="text-[10px] text-gray-400">Chat via WhatsApp · SOK Law</span>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Chat with SOK Law on WhatsApp"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-0 hover:gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] transition-all duration-300 overflow-hidden h-12 sm:h-13 px-3.5 sm:px-4 group"
      >
        <span className="flex items-center justify-center flex-shrink-0">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <WhatsAppIcon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          )}
        </span>
        <span className="hidden sm:block text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100 max-w-0 opacity-0">
          {open ? 'Close' : 'Chat with SOK Law'}
        </span>
      </button>
    </>
  );
};

export default WhatsAppButton;
