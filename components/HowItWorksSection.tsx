import { useEffect, useRef, useState, useCallback } from "react";
// OLD: import avatarDG from "@/assets/avatars/dg.jpg";
const avatarDG = "/avatars/dg.jpg";
// OLD: import avatarDM from "@/assets/avatars/dm.jpg";
const avatarDM = "/avatars/dm.jpg";
// OLD: import avatarRS from "@/assets/avatars/rs.jpg";
const avatarRS = "/avatars/rs.jpg";
// OLD: import dataxxLogo from "@/assets/logo.png";
const dataxxLogo = "/logo.png";
import { useLanguage } from "@/hooks/useLanguage";
import useEmblaCarousel from "embla-carousel-react";

// Section "Comment ça marche" style MeetSponsors (3 + 2 blocs)
function ScoreGauge({ target = 86, durationMs = 1200 }: { target?: number; durationMs?: number }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const startAnim = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setValue(0);
    const animate = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - (startRef.current || t);
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.max(1, Math.round(eased * target));
      setValue(next);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startAnim();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, durationMs]);

  // Rejoue à chaque entrée dans le viewport
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnim();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 300 200" className="w-[85%]" onMouseEnter={startAnim}>
      <defs>
        <linearGradient id="grad-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(268 83% 60%)" />
          <stop offset="100%" stopColor="hsl(292 76% 60%)" />
        </linearGradient>
      </defs>
      {/* arc de fond */}
      <path d="M20 160 A130 130 0 0 1 280 160" fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round" />
      {/* arc animé proportionnel au pourcentage */}
      {/* fallback solide sous le gradient pour desktop */}
      <path d="M20 160 A130 130 0 0 1 280 160" fill="none" stroke="#7c3aed" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 - value} />
      <path d="M20 160 A130 130 0 0 1 280 160" fill="none" stroke="url(#grad-top)" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 - value} />
      <circle cx="150" cy="160" r="6" fill="#6d28d9" />
      <text x="150" y="110" textAnchor="middle" fill="#111827" fontSize="28" fontWeight="700">{value}%</text>
    </svg>
  );
}

const HowItWorksSection = () => {
  const { t } = useLanguage();
  const refs = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showSecond, setShowSecond] = useState(false);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const [scan2, setScan2] = useState(false);
  const [reveal2, setReveal2] = useState(false);
  const [reveal2Step, setReveal2Step] = useState(0); // 0 -> rien, 1..4 lignes visibles
  const scan2Timers = useRef<number[]>([]);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let revealTimer: number | undefined;
    let stopScanTimer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // reset
            if (revealTimer) clearTimeout(revealTimer);
            if (stopScanTimer) clearTimeout(stopScanTimer);
            scan2Timers.current.forEach((id) => clearTimeout(id));
            scan2Timers.current = [];

            setReveal2(false);
            setReveal2Step(0);
            setScan2(true);

            // Première info à 2s (après la fin du scan), puis les suivantes toutes les 250ms
            revealTimer = window.setTimeout(() => {
              setReveal2(true);
              [1, 2, 3, 4].forEach((step, idx) => {
                const id = window.setTimeout(() => setReveal2Step(step), idx * 250) as unknown as number;
                scan2Timers.current.push(id);
              });
            }, 2000);

            // Arrête le scan à 2s (il ne chevauche pas le texte)
            stopScanTimer = window.setTimeout(() => setScan2(false), 2000);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (revealTimer) clearTimeout(revealTimer);
      if (stopScanTimer) clearTimeout(stopScanTimer);
      scan2Timers.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // no-op (we removed previous scroll logic)

  // removed pinned scroll logic

  // removed all scroll interception

  const renderBlock = (i: number) => {
    // Returns one of the six blocks exactly as in the grid version
    if (i === 0) {
      const sid = (name: string) => `${name}-${i}`;
      return (
        <div className="opacity-100 translate-y-0">
          <div className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
            <div className="absolute inset-0 p-3 sm:p-6 flex">
              <div className="mx-auto w-full max-w-[520px] h-full rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white shadow-sm overflow-hidden">
                <div className="h-10 border-b border-gray-100 flex items-center justify-between px-3">
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
                  <div className="flex-1 max-w-xs mx-3 h-7 rounded-full bg-gray-100 border border-gray-200" />
                  <div className="flex items-center gap-2"><span className="h-6 w-16 rounded-full bg-gray-100 border border-gray-200" /><span className="h-6 w-16 rounded-full bg-gray-100 border border-gray-200" /></div>
                </div>
                <div className="relative h-[200px] sm:h-[230px]">
                  <svg viewBox="0 0 520 230" className="absolute inset-0 w-full h-full origin-top scale-90 translate-y-6 sm:scale-100 sm:translate-y-0">
                    <defs>
                      <clipPath id={sid('hex-fr')}>
                        <polygon points="380,115 320,219 200,219 140,115 200,11 320,11" />
                      </clipPath>
                      <linearGradient id={sid('hex-fill')} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f7f5ff" />
                      </linearGradient>
                      <pattern id={sid('grid-fr')} width="28" height="28" patternUnits="userSpaceOnUse">
                        <path d="M28 0H0V28" fill="none" stroke="#eef2ff" />
                      </pattern>
                      <radialGradient id={sid('halo-fr')} cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="hsl(268 83% 60% / .18)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                      <linearGradient id={sid('link-fr')} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(268 83% 60%)" />
                        <stop offset="100%" stopColor="hsl(292 76% 60%)" />
                      </linearGradient>
                      <filter id={sid('dot-shadow')} x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.18" />
                      </filter>
                    </defs>
                    <defs>
                      <radialGradient id={sid('radar-sweep')} cx="260" cy="115" r="110" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="hsl(268 83% 60% / .15)" />
                        <stop offset="65%" stopColor="hsl(292 76% 60% / .08)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                    <g>
                      <circle cx="260" cy="115" r="110" fill={`url(#${sid('grid-fr')})`} stroke="#e7e7f3" strokeWidth="2" />
                      <circle cx="260" cy="115" r="80" fill="none" stroke="#eef2ff" />
                      <circle cx="260" cy="115" r="50" fill="none" stroke="#f1f5ff" />
                      <circle cx="260" cy="115" r="20" fill="none" stroke="#f6f8ff" />
                      <circle cx="260" cy="115" r="112" fill={`url(#${sid('halo-fr')})`} />
                      <g>
                        <g>
                          <path d="M260 115 L260 5 A110 110 0 0 1 360 60 Z" fill={`url(#${sid('radar-sweep')})`} opacity="0.6">
                            <animateTransform attributeName="transform" type="rotate" from="0 260 115" to="360 260 115" dur="6s" repeatCount="indefinite" />
                          </path>
                          {/* Fallback solid fill in case gradient fails (desktop) */}
                          <path d="M260 115 L260 5 A110 110 0 0 1 360 60 Z" fill="hsl(268 83% 60% / 0.18)" opacity="0.45">
                            <animateTransform attributeName="transform" type="rotate" from="0 260 115" to="360 260 115" dur="6s" repeatCount="indefinite" />
                          </path>
                          {/* Overlay scanning line to ensure visibility */}
                          <line x1="260" y1="115" x2="360" y2="60" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" opacity="0.7">
                            <animateTransform attributeName="transform" type="rotate" from="0 260 115" to="360 260 115" dur="6s" repeatCount="indefinite" />
                          </line>
                          <line x1="260" y1="115" x2="360" y2="60" stroke={`url(#${sid('link-fr')})`} strokeWidth="3" strokeLinecap="round" opacity="0.6">
                            <animateTransform attributeName="transform" type="rotate" from="0 260 115" to="360 260 115" dur="6s" repeatCount="indefinite" />
                          </line>
                        </g>
                      </g>
                    </g>
                    <g fill="#10b981" stroke="#ffffff" strokeWidth="1.5">
                      <circle cx="280" cy="85" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" repeatCount="indefinite" /></circle>
                      <circle cx="325" cy="135" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="0.3s" repeatCount="indefinite" /></circle>
                      <circle cx="350" cy="170" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="0.6s" repeatCount="indefinite" /></circle>
                      <circle cx="205" cy="150" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="0.9s" repeatCount="indefinite" /></circle>
                      <circle cx="215" cy="120" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="1.2s" repeatCount="indefinite" /></circle>
                      <circle cx="295" cy="45" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="1.5s" repeatCount="indefinite" /></circle>
                      <circle cx="210" cy="95" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="1.8s" repeatCount="indefinite" /></circle>
                      <circle cx="265" cy="170" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="2.1s" repeatCount="indefinite" /></circle>
                      <circle cx="350" cy="150" r="7"><animate attributeName="r" values="7;8;7" dur="2.4s" begin="2.4s" repeatCount="indefinite" /></circle>
                    </g>
                  </svg>
                  <div className="absolute left-3 right-3 top-1.5 sm:top-3 flex items-center gap-1.5 whitespace-nowrap pr-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-secondary text-[10px] border border-primary/20">{t('features.mapping.filters.region')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-secondary text-[10px] border border-primary/20">{t('features.mapping.filters.sector')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-secondary text-[10px] border border-primary/20">{t('features.mapping.filters.potential')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-secondary text-[10px] border border-primary/20">CA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-center px-2">
            <div className="mx-auto mb-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow text-sm sm:text-base">1</div>
            <h3 className="text-secondary text-lg sm:text-xl font-bold mb-1">{t('features.mapping.title')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('features.mapping.description')}
            </p>
          </div>
        </div>
      );
    }
    if (i === 1) {
      return (
        <div className="opacity-100 translate-y-0">
          <div className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
            <div className="absolute inset-0 p-3 sm:p-6">
              <div ref={card2Ref} className="h-full w-full rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white overflow-hidden relative">
                <div className="px-3 py-2.5 flex items-center gap-2.5 border-b border-gray-100 relative z-10">
                  <img src={dataxxLogo} alt="Dataxx" className="h-7 w-7 rounded-md ring-1 ring-gray-200" />
                  <div className="min-w-0">
                    <div className="text-secondary font-semibold leading-tight text-[13px]">{t('features.profiling.company.name')}</div>
                    <div className="text-[10px] text-gray-500">{t('features.profiling.card.title')}</div>
                  </div>
                </div>
                {scan2 && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
                    <div className="absolute left-0 right-0 -top-full h-full bg-gradient-to-b from-violet-700/0 via-violet-700/65 to-violet-900/0" style={{ animation: 'scan-vert 2s linear 1' }} />
                  </div>
                )}
                <div className={`px-3 py-2.5 space-y-2 text-[12px] relative z-10 transition-opacity duration-500 ${reveal2 ? 'opacity-100' : 'opacity-0'}`}>
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${reveal2Step >= 1 ? 'opacity-100' : 'opacity-0'}`}><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M9 7h6a1 1 0 110 2H9a1 1 0 100 2h5a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6a1 1 0 110-2h1a3 3 0 010-2H6a1 1 0 110-2h1V7a1 1 0 112 0v1Zm4 6H9a1 1 0 100 2h4a1 1 0 110 2H9a3 3 0 01-3-3v-4a3 3 0 013-3h4a1 1 0 110 2Z"/></svg></span><div className="flex-1 flex items-center justify-between gap-2"><span className="text-gray-700 font-semibold">{t('features.profiling.card.revenue')}</span><span className="font-medium text-secondary text-[12px]">{t('features.profiling.company.revenue.value')}</span></div></div>
                  <div className={`flex items-start gap-2 transition-opacity duration-300 ${reveal2Step >= 2 ? 'opacity-100' : 'opacity-0'}`}><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">{t('features.profiling.card.activity')}</div><p className="text-secondary/90 leading-snug">{t('features.profiling.card.activity.desc')}</p></div></div>
                  <div className={`flex items-start gap-2 transition-opacity duration-300 ${reveal2Step >= 3 ? 'opacity-100' : 'opacity-0'}`}><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M5 4h14v2H5V4Zm2 4h10v2H7V8Zm-2 4h14v2H5v-2Zm2 4h7v2H7v-2Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">{t('features.profiling.card.history')}</div><p className="text-secondary/90 leading-snug">{t('features.profiling.card.history.desc')}</p></div></div>
                  <div className={`flex items-start gap-2 transition-opacity duration-300 ${reveal2Step >= 4 ? 'opacity-100' : 'opacity-0'}`}><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 4l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 16.9 6.22 18.7l.91-5.32L3.27 9.62l5.34-.78L12 4Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">{t('features.profiling.card.brand')}</div><p className="text-secondary/90 leading-snug">{t('features.profiling.card.brand.desc')}</p></div></div>
                </div>
                <div className="px-3 pb-3 flex items-center gap-2"><span className="meetsponsors-gradient text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full">{t('features.profiling.action.view')}</span><span className="text-primary border border-primary/20 text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-white">{t('features.profiling.action.export')}</span></div>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-center px-2">
            <div className="mx-auto mb-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow text-sm sm:text-base">2</div>
            <h3 className="text-secondary text-lg sm:text-xl font-bold mb-1">{t('features.profiling.title')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('features.profiling.description')}
            </p>
          </div>
        </div>
      );
    }
    if (i === 2) {
      return (
        <div className="opacity-100 translate-y-0">
          <div className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
            <div className="absolute inset-0 flex items-center justify-center">
              <ScoreGauge target={86} durationMs={1200} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-center px-2">
            <div className="mx-auto mb-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow text-sm sm:text-base">3</div>
            <h3 className="text-secondary text-lg sm:text-xl font-bold mb-1">{t('features.scoring.title')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('features.scoring.description')}
            </p>
          </div>
        </div>
      );
    }
    if (i === 3) {
      return (
        <div className="opacity-100 translate-y-0">
          <div className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 sm:px-6">
              <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                <img src={avatarDG} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                <div className="flex-1 text-left">
                  <div className="text-secondary text-sm font-medium">{t('how.step1.role1')}</div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white hover:bg-primary/5 transition-colors">{t('how.step1.action.phone')}</button>
                    <button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white transition-colors">{t('how.step1.action.email')}</button>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                <img src={avatarDM} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                <div className="flex-1 text-left">
                  <div className="text-secondary text-sm font-medium">{t('how.step1.role2')}</div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white hover:bg-primary/5 transition-colors">{t('how.step1.action.phone')}</button>
                    <button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white transition-colors">{t('how.step1.action.email')}</button>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                <img src={avatarRS} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                <div className="flex-1 text-left">
                  <div className="text-secondary text-sm font-medium">{t('how.step1.role3')}</div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white hover:bg-primary/5 transition-colors">{t('how.step1.action.phone')}</button>
                    <button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white transition-colors">{t('how.step1.action.email')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-center px-2">
            <div className="mx-auto mb-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow text-sm sm:text-base">4</div>
            <h3 className="text-secondary text-lg sm:text-xl font-bold mb-1">{t('how.step1.title')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
               {t('how.step1.description')}
            </p>
          </div>
        </div>
      );
    }
    if (i === 4) {
      return (
        <div className="opacity-100 translate-y-0">
          <div className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
            <div className="absolute inset-0 p-3 sm:p-6">
              <div className="w-full h-full rounded-2xl border border-primary/10 bg-white overflow-hidden">
                <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200 flex items-center gap-1 px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                </div>
                <div className="px-5 py-3 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-12">{t('how.step2.email.to')}</span>
                    <div className="flex gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20">
                        <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-primary to-accent" /> prenom.nom@entreprise.fr
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-12">{t('how.step2.email.subject.label')}</span>
                    <div className="flex-1">
                      <span className="inline-flex max-w-full items-center px-2 py-1 rounded-md bg-gray-100 text-secondary border border-gray-200">
                        {t('how.step2.email.subject.value')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-2">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-[10px] text-secondary leading-relaxed whitespace-pre-line">{`${t('how.step2.email.greeting')}

${t('how.step2.email.body.line1')}

${t('how.step2.email.body.line2')} serait intéressant d'échanger afin d'explorer les opportunités d'un partenariat mutuellement bénéfique.

Bien à vous,`}</div>
                </div>
                <div className="px-5 pb-4 flex items-center gap-2">
                  <div className="meetsponsors-gradient text-white text-xs font-semibold px-3 py-2 rounded-full">Envoyer</div>
                  <div className="text-primary border border-primary/30 text-xs font-medium px-3 py-2 rounded-full bg-white">Personnaliser</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-center px-2">
            <div className="mx-auto mb-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow text-sm sm:text-base">5</div>
            <h3 className="text-secondary text-lg sm:text-xl font-bold mb-1">{t('how.step4.title')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{t('how.step4.description')}</p>
          </div>
        </div>
      );
    }
    // i === 5
    return (
      <div className="opacity-100 translate-y-0">
        <div className="relative min-h-[280px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
          <div className="absolute inset-0 p-3 sm:p-6">
            <div className="w-full h-full rounded-2xl bg-white/90 ring-1 ring-primary/10 overflow-hidden flex flex-col">
              <div className="px-5 py-3 border-b border-gray-100">
                <div className="text-secondary font-semibold">{t('how.step3.crm.title')}</div>
              </div>
              <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] flex-1">
                {[
                  { title: t('how.step3.crm.status1'), tone: "ring-gray-200", items: ["Novalytics", "ThermaTech", "DataSphere", "PulseAI"], badge: "bg-gradient-to-br from-primary to-accent text-white" },
                  { title: t('how.step3.crm.status2'), tone: "ring-primary/20", items: ["BlueWave", "GreenPulse", "AeroLink"], badge: "bg-gradient-to-br from-primary to-accent text-white" },
                  { title: t('how.step3.crm.status3'), tone: "ring-emerald-200", items: ["HexaTech"], badge: "bg-emerald-100 text-emerald-700" },
                ].map((col) => (
                  <div key={col.title} className={`rounded-2xl bg-white/80 ring-1 ${col.tone} p-2.5 pt-3 flex flex-col`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-secondary font-medium text-[11px] whitespace-nowrap leading-none">{col.title}</div>
                      <span className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[8px] font-semibold ${col.badge}`}>{col.items.length}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-1.5">
                      {col.items.map((name) => (
                        <span key={name} className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-white/95 ring-1 ring-gray-200 shadow-sm shadow-inner max-w-full">
                          <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                          <span className="text-secondary/90 truncate max-w-[150px] md:max-w-[160px] lg:max-w-[180px]">{name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 text-center px-2">
          <div className="mx-auto mb-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow text-sm sm:text-base">6</div>
          <h3 className="text-secondary text-lg sm:text-xl font-bold mb-1">{t('how.step5.title')}</h3>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{t('how.step5.description')}</p>
        </div>
      </div>
    );
  };

  const totalSlides = 6;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selected, setSelected] = useState(0);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
    <section ref={sectionRef as any} id="comment" className="relative pt-16 pb-0 px-4 sm:px-6 scroll-mt-28">
      <div className="max-w-7xl mx-auto relative">
        {/* En-tête */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="text-primary tracking-widest text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 uppercase">{t('how.title')}</div>
          <h2 className="text-secondary text-xl sm:text-2xl md:text-3xl font-bold tracking-tight px-4">
            {t('how.subtitle')}
          </h2>
        </div>

        {/* Mobile: 1/6 carousel */}
        <div className="sm:hidden relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex -ml-2">
              {[0,1,2,3,4,5].map((i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 basis-full pl-2">
                  {renderBlock(i)}
                </div>
              ))}
            </div>
          </div>
          {/* Arrows */}
          <button
            aria-label="Précédent"
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            className="absolute left-2 top-40 -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 hover:bg-white text-secondary border border-gray-200 shadow z-10 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            aria-label="Suivant"
            onClick={() => emblaApi && emblaApi.scrollNext()}
            className="absolute right-2 top-40 -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 hover:bg-white text-secondary border border-gray-200 shadow z-10 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
          {/* Pagination */}
          <div className="mt-3 flex justify-center">
            <span className="text-xs font-medium text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              {selected + 1}/{totalSlides}
            </span>
          </div>
        </div>

        {/* Desktop/tablet: Carrousel 3 + 3 avec flèches (version existante) */}
        <div className="hidden sm:block relative">
          {/* Flèches centrées verticalement, look accentué (même couleur que badges) */}
          <button
            aria-label="Précédent"
            onClick={() => setShowSecond(false)}
            disabled={!showSecond}
            className={`hidden md:flex items-center justify-center absolute left-0 top-[160px] h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg z-10 ${showSecond ? '' : 'opacity-50 cursor-not-allowed'}`}
            style={{ animation: showSecond ? 'pulse-soft 2s ease-out infinite' : undefined }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            aria-label="Suivant"
            onClick={() => setShowSecond(true)}
            disabled={showSecond}
            className={`hidden md:flex items-center justify-center absolute right-0 top-[160px] h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg z-10 ${!showSecond ? '' : 'opacity-50 cursor-not-allowed'}`}
            style={{ animation: !showSecond ? 'pulse-soft 2s ease-out infinite' : undefined }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 transition-opacity">
            {(showSecond ? [3,4,5] : [0,1,2]).map((i) => (
              <div key={i}>{renderBlock(i)}</div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 flex justify-center">
            <span className="text-xs sm:text-sm font-medium text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              {showSecond ? '2/2' : '1/2'}
            </span>
          </div>
        </div>
        {/* Frise retirée à la demande */}
      </div>
    </section>
  </>
  );
};

export default HowItWorksSection;