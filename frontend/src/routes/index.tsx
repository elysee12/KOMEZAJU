import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Users,
  Briefcase,
  HeartHandshake,
  ShieldCheck,
  Sprout,
  Megaphone,
  GraduationCap,
  HandHeart,
  Leaf,
  Network,
  Mail,
  MapPin,
  Phone,
  Menu,
  X,
  Star,
  Globe,
  Check,
  ChevronDown,
  MessageCircle,
  Heart,
  Lock,
  CreditCard,
  Navigation,
  Eye,
  EyeOff,
  Target,
  Gem,
} from "lucide-react";

import logo from "../assets/logo.png";
import hero from "../assets/hero-community.jpg";
import youthImg from "../assets/youth-training.jpg";
import womenImg from "../assets/women-cooperative.jpg";
import envImg from "../assets/environment.jpg";
import beneficiariesImg from "../assets/beneficiaries.jpg";
import leaderPresident from "../assets/leader-president.jpg";
import leaderDeputy from "../assets/leader-deputy.jpg";

// Import static images for programs
import progImg1 from "../assets/static_images/INFINITYSTUDIO.jpg";
import progImg2 from "../assets/static_images/INFINITYSTUDIO(1).jpg";
import progImg3 from "../assets/static_images/INFINITYSTUDIO(2).jpg";
import progImg4 from "../assets/static_images/INFINITYSTUDIO(3).jpg";
import progImg5 from "../assets/static_images/INFINITYSTUDIO(4).jpg";
import progImg6 from "../assets/static_images/INFINITYSTUDIO(5).jpg";
import progImg7 from "../assets/static_images/INFINITYSTUDIO(6).jpg";
import progImg8 from "../assets/static_images/INFINITYSTUDIO(7).jpg";
import progImg9 from "../assets/static_images/INFINITYSTUDIO(8).jpg";
import progImg10 from "../assets/static_images/INFINITYSTUDIO(9).jpg";

// Import static images for beneficiaries
import benefImg1 from "../assets/static_images/INFINITYSTUDIO(10).jpg";
import benefImg2 from "../assets/static_images/INFINITYSTUDIO(11).jpg";
import benefImg3 from "../assets/static_images/INFINITYSTUDIO(12).jpg";
import benefImg4 from "../assets/static_images/INFINITYSTUDIO(13).jpg";
import benefImg5 from "../assets/static_images/INFINITYSTUDIO(14).jpg";

import { LANGS, useT, type Lang } from "../lib/i18n";

const API = "http://localhost:3000";

/**
 * Fetches the first active image for a given category from the backend.
 * Falls back to the provided local asset if no backend image is found.
 */
function useRemoteImage(category: string, fallback: string): string {
  const [src, setSrc] = useState(fallback);
  useEffect(() => {
    fetch(`${API}/images?category=${encodeURIComponent(category)}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data: { url: string }[]) => {
        if (data.length > 0) setSrc(data[0].url);
      })
      .catch(() => {/* silently keep fallback */});
  }, [category, fallback]);
  return src;
}

const NAV = [
  { 
    href: "#about", 
    key: "nav.about",
    dropdown: [
      { href: "#mission", key: "nav.mission" },
      { href: "#vmv", key: "nav.vmv" },
    ]
  },
  { 
    href: "#programs", 
    key: "nav.programs",
    dropdown: [
      { href: "#programs", key: "nav.ourPrograms" },
      { href: "#beneficiaries", key: "nav.beneficiaries" },
    ]
  },
  { 
    href: "#impact", 
    key: "nav.impact",
    dropdown: [
      { href: "#impact", key: "nav.ourImpact" },
      { href: "#leadership", key: "nav.leadership" },
    ]
  },
  { href: "#contact", key: "nav.contact" },
];

const BENEFICIARIES = [
  { icon: GraduationCap, k: "youth", img: benefImg1, category: "beneficiary-youth" },
  { icon: HeartHandshake, k: "women", img: benefImg2, category: "beneficiary-women" },
  { icon: ShieldCheck, k: "disability", img: benefImg3, category: "beneficiary-disability" },
  { icon: HandHeart, k: "teen", img: benefImg4, category: "beneficiary-teen" },
  { icon: Users, k: "vulnerable", img: benefImg5, category: "beneficiary-vulnerable" },
];

const ACTIVITIES = [
  { icon: Users, k: "youth", img: progImg1, category: "program-youth" },
  { icon: Briefcase, k: "jobs", img: progImg2, category: "program-jobs" },
  { icon: HeartHandshake, k: "coops", img: progImg3, category: "program-coops" },
  { icon: ShieldCheck, k: "rights", img: progImg4, category: "program-rights" },
  { icon: Sprout, k: "drug", img: progImg5, category: "program-drug" },
  { icon: Leaf, k: "env", img: progImg6, category: "program-env" },
  { icon: Megaphone, k: "debates", img: progImg7, category: "program-debates" },
  { icon: HandHeart, k: "voice", img: progImg8, category: "program-voice" },
  { icon: GraduationCap, k: "mediation", img: progImg9, category: "program-mediation" },
  { icon: Network, k: "partners", img: progImg10, category: "program-partners" },
];

// Shared constants for contact widgets
const WHATSAPP_NUMBER = "250788911933"; // international format, no +
const WHATSAPP_MSG = "Hello KOMEZAJU, I'd like to learn more about your work.";
const ORG_LAT = -2.1486;
const ORG_LNG = 30.0931;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KOMEZAJU Organization — Community Development" },
      {
        name: "description",
        content: "KOMEZAJU is a community-based organization committed to sustainable development and community empowerment.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header 
        onDonate={() => setDonateOpen(true)} 
        onLogin={() => setLoginOpen(true)}
      />
      <main>
        <Hero onDonate={() => setDonateOpen(true)} />
        <TrustStrip />
        <Mission />
        <VisionMissionValues />
        <Programs />
        <Beneficiaries />
        <Impact />
        <Leadership />
        <Contact />
        <LocationMap />
      </main>
      <Footer />
      <FloatingActions onDonate={() => setDonateOpen(true)} />
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}

function LanguageSwitcher({ variant = "header" }: { variant?: "header" | "mobile" }) {
  const { lang, setLang, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang)!;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const btnBase =
    variant === "header"
      ? "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80 backdrop-blur transition hover:text-primary"
      : "inline-flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("lang.label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={btnBase}
      >
        <Globe className="h-4 w-4" />
        <span>{current.short}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-elevated ${
            variant === "header" ? "right-0" : "left-0"
          }`}
        >
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(l.code as Lang);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-muted ${
                    active ? "font-semibold text-primary" : "text-foreground/80"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {l.short}
                    </span>
                    <span>{l.label}</span>
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Header({ onDonate, onLogin }: { onDonate: () => void; onLogin: () => void }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logo} alt="KOMEZAJU logo" className="h-9 w-9 md:h-10 md:w-10" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight md:text-lg">
              KOMEZAJU
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">
              Organization
            </span>
          </div>
        </a>

        <nav ref={dropdownRef} className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => {
            const hasDropdown = "dropdown" in n && Array.isArray(n.dropdown);
            const isActive = activeDropdown === n.href;
            
            return (
              <div key={n.href} className="relative">
                {hasDropdown ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isActive ? null : n.href)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
                    >
                      {t(n.key)}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isActive ? "rotate-180" : ""}`} />
                    </button>
                    {isActive && (
                      <div className="absolute left-0 top-full mt-2 w-56 animate-fade-up">
                        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-elevated backdrop-blur-xl">
                          {n.dropdown.map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block border-b border-border/40 px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-primary last:border-b-0"
                            >
                              {t(item.key)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={n.href}
                    className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
                  >
                    {t(n.key)}
                  </a>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80 backdrop-blur transition hover:text-primary"
          >
            <Lock className="h-3.5 w-3.5" /> {t("nav.login")}
          </button>
          <button
            type="button"
            onClick={onDonate}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:brightness-110"
          >
            <Heart className="h-4 w-4" /> {t("cta.donate")}
          </button>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:bg-foreground/90"
          >
            {t("cta.getInvolved")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-background/70"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="container-x flex flex-col py-4">
            {NAV.map((n) => {
              const hasDropdown = "dropdown" in n && Array.isArray(n.dropdown);
              
              return hasDropdown ? (
                <div key={n.href} className="border-b border-border/40">
                  <div className="py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {t(n.key)}
                    </p>
                    <div className="mt-2 space-y-2">
                      {n.dropdown.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block pl-3 text-sm font-medium text-foreground/80"
                        >
                          {t(item.key)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/40 py-3 text-sm font-medium text-foreground/80"
                >
                  {t(n.key)}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDonate();
              }}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Heart className="h-4 w-4" /> {t("cta.donate")}
            </button>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
            >
              {t("cta.getInvolved")} <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogin();
              }}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground/80"
            >
              <Lock className="h-4 w-4" /> {t("nav.login")}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero({ onDonate }: { onDonate: () => void }) {
  const { t } = useT();
  const heroImage = useRemoteImage("hero", hero);
  return (
    <section id="top" className="relative overflow-hidden pt-16 md:pt-20">
      <div className="relative">
        <img
          src={heroImage}
          alt="Members of the Bugesera community gathered at sunset"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero-overlay)" }}
        />
        <div className="relative container-x grid min-h-[640px] grid-cols-1 items-center gap-12 py-20 md:min-h-[760px] md:py-28 lg:grid-cols-12">
          <div className="text-white lg:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {t("hero.badge")}
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero.title1")} <span className="text-accent">{t("hero.title2")}</span>
              <br /> {t("hero.title3")}
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">{t("hero.lede")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#programs"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
              >
                {t("cta.explore")} <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={onDonate}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-foreground shadow-soft transition hover:bg-white/90"
              >
                <Heart className="h-4 w-4 text-primary" /> {t("cta.donate")}
              </button>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {t("cta.partner")}
              </a>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="ml-auto max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-elevated backdrop-blur-xl animate-float-soft">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                {t("hero.missionLabel")}
              </p>
              <p className="mt-3 font-display text-2xl leading-snug">{t("hero.missionQuote")}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/20 pt-4">
                <img src={logo} alt="" className="h-9 w-9 rounded-full bg-white p-1" />
                <div className="text-sm">
                  <p className="font-semibold">KOMEZAJU Organization</p>
                  <p className="text-white/70">{t("hero.missionSource")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const { t } = useT();
  const stats = [
    { k: "10", v: t("stats.programs") },
    { k: "1", v: t("stats.province") },
    { k: "3", v: t("stats.languages") },
    { k: "∞", v: t("stats.impact") },
  ];
  return (
    <section className="relative border-y border-border/60 bg-cream overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container-x py-10 md:py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5 items-center">
          {/* First two stats */}
          {stats.slice(0, 2).map((s) => (
            <div key={s.v} className="text-center md:text-left">
              <div className="font-display text-4xl font-semibold text-primary md:text-5xl">
                {s.k}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}

          {/* Legacy Badge - Center Column */}
          <div className="col-span-2 md:col-span-1 flex items-center justify-center py-4 md:py-0">
            <div className="relative group">
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-secondary opacity-20 blur-xl animate-pulse" />
              
              {/* Main circle */}
              <div className="relative flex h-40 w-40 md:h-44 md:w-44 items-center justify-center rounded-full border-[6px] border-foreground bg-gradient-to-br from-primary via-accent to-secondary shadow-elevated transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-md" />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="font-display text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                    3Y
                  </div>
                  <div className="mt-1 text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white/95 drop-shadow">
                    {t("stats.legacy").split(' ')[0]}
                  </div>
                </div>

                {/* Decorative sparkles */}
                <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-accent animate-ping" />
                <div className="absolute -left-2 -bottom-2 h-3 w-3 rounded-full bg-secondary animate-pulse" />
              </div>

              {/* Subtitle below badge */}
              <p className="mt-3 text-center text-xs font-medium text-muted-foreground max-w-[180px] mx-auto">
                {t("stats.legacyLabel")}
              </p>
            </div>
          </div>

          {/* Last two stats */}
          {stats.slice(2).map((s) => (
            <div key={s.v} className="text-center md:text-left">
              <div className="font-display text-4xl font-semibold text-primary md:text-5xl">
                {s.k}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mission() {
  const { t } = useT();
  const womenSrc = useRemoteImage("mission-women", womenImg);
  const envSrc   = useRemoteImage("mission-environment", envImg);
  const youthSrc = useRemoteImage("mission-youth", youthImg);
  return (
    <section id="mission" className="py-16 md:py-20">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {t("mission.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {t("mission.title1")} <span className="gradient-text">{t("mission.title2")}</span>
          </h2>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">{t("mission.body")}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <InfoTile label={t("mission.tile.office")} value={t("mission.tile.officeV")} />
            <InfoTile label={t("mission.tile.district")} value={t("mission.tile.districtV")} />
            <InfoTile label={t("mission.tile.province")} value={t("mission.tile.provinceV")} />
            <InfoTile label={t("mission.tile.reach")} value={t("mission.tile.reachV")} />
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={womenSrc}
                alt="Women cooperative members in Bugesera"
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-[3/4] w-full rounded-3xl object-cover shadow-soft"
              />
              <img
                src={envSrc}
                alt="Hands planting a tree"
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full rounded-3xl object-cover shadow-soft"
              />
            </div>
            <div className="mt-12 space-y-4">
              <img
                src={youthSrc}
                alt="Youth in vocational training"
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full rounded-3xl object-cover shadow-soft"
              />
              <div className="rounded-3xl bg-foreground p-6 text-background shadow-elevated">
                <p className="font-display text-xl leading-snug md:text-2xl">
                  {t("mission.quote")}
                </p>
                <p className="mt-3 text-sm text-background/70">{t("mission.quoteSub")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionMissionValues() {
  const { t } = useT();
  const pillars = [
    { key: "vision", icon: Eye, accent: "from-primary/15 to-primary/0", ring: "ring-primary/30", iconBg: "bg-primary text-primary-foreground" },
    { key: "mission", icon: Target, accent: "from-secondary/15 to-secondary/0", ring: "ring-secondary/30", iconBg: "bg-secondary text-secondary-foreground", featured: true },
    { key: "values", icon: Gem, accent: "from-accent/25 to-accent/0", ring: "ring-accent/40", iconBg: "bg-accent text-accent-foreground" },
  ] as const;

  return (
    <section id="vmv" className="relative overflow-hidden py-16 md:py-20">
      {/* ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "var(--gradient-warm)" }} />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
            <Star className="h-3 w-3" /> {t("vmv.eyebrow")}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {t("vmv.title1")} <span className="gradient-text">{t("vmv.title2")}</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">{t("vmv.body")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            const featured = "featured" in p && p.featured;
            return (
              <article
                key={p.key}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated md:p-8 ${
                  featured ? "md:-mt-4 md:mb-4 ring-1 ring-primary/20" : ""
                }`}
              >
                {/* gradient wash */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b ${p.accent} opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                />
                {/* corner index */}
                <span className="absolute right-6 top-6 font-display text-sm font-semibold tracking-[0.3em] text-muted-foreground/60">
                  0{i + 1}
                </span>

                {/* icon medallion */}
                <div className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl ring-4 ${p.ring} ${p.iconBg} shadow-soft transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>

                <h3 className="mt-6 font-display text-2xl font-semibold md:text-3xl">
                  {t(`vmv.${p.key}.t`)}
                </h3>
                <div className="mt-3 h-px w-12 bg-gradient-to-r from-primary to-transparent" />
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {t(`vmv.${p.key}.b`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

function Programs() {
  const { t } = useT();
  
  return (
    <section
      id="programs"
      className="relative py-16 md:py-20"
      style={{ background: "var(--gradient-warm)" }}
    >
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {t("programs.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {t("programs.title")}
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">{t("programs.body")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ACTIVITIES.map((a, i) => (
            <ProgramCard key={a.k} activity={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramCard({ activity: a, index: i }: { activity: typeof ACTIVITIES[0]; index: number }) {
  const { t } = useT();
  const imageSrc = useRemoteImage(a.category, a.img);
  
  return (
    <article 
      className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-3 hover:shadow-elevated hover:border-primary/50"
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageSrc} 
          alt={t(`act.${a.k}.t`)}
          className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
        
        {/* Icon Badge - Floating on Image */}
        <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm text-primary shadow-elevated transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary group-hover:text-white">
          <a.icon className="h-6 w-6" />
        </div>
        
        {/* Number Badge - Top Right */}
        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/90 backdrop-blur text-white text-xs font-bold transition-all duration-500 group-hover:scale-110">
          {String(i + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold leading-tight transition-colors duration-300 group-hover:text-primary">
          {t(`act.${a.k}.t`)}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {t(`act.${a.k}.b`)}
        </p>
        
        {/* Learn More Arrow - Appears on Hover */}
        <a 
          href="#contact"
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
        >
          <span>{t("cta.learnMore")}</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Shimmer Effect on Hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-full" />
      </div>
    </article>
  );
}

function Impact() {
  const { t } = useT();
  const impactSrc = useRemoteImage("impact", beneficiariesImg);
  return (
    <section id="impact" className="py-16 md:py-20">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 blur-2xl" />
          <img
            src={impactSrc}
            alt="Community gathering"
            loading="lazy"
            width={1600}
            height={1100}
            className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-elevated"
          />
          <div className="absolute -bottom-6 -right-4 max-w-[260px] rounded-2xl border border-border bg-card p-5 shadow-elevated md:-right-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {t("impact.testimonial")}
            </p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              {t("impact.testimonialBy")}
            </p>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {t("impact.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {t("impact.title1")} <span className="gradient-text">{t("impact.title2")}</span>
          </h2>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">{t("impact.body")}</p>

          <div className="mt-8 space-y-4">
            {[
              { label: t("impact.row1"), pct: 92 },
              { label: t("impact.row2"), pct: 84 },
              { label: t("impact.row3"), pct: 76 },
              { label: t("impact.row4"), pct: 88 },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{row.label}</span>
                  <span className="text-muted-foreground">{row.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${row.pct}%`,
                      background: "var(--gradient-primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Beneficiaries() {
  const { t } = useT();
  
  return (
    <section id="beneficiaries" className="bg-cream py-16 md:py-20">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {t("ben.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {t("ben.title1")} <span className="gradient-text">{t("ben.title2")}</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">{t("ben.body")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIARIES.map((b, i) => (
            <BeneficiaryCard key={b.k} beneficiary={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeneficiaryCard({ beneficiary: b, index: i }: { beneficiary: typeof BENEFICIARIES[0]; index: number }) {
  const { t } = useT();
  const imageSrc = useRemoteImage(b.category, b.img);
  
  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-3 hover:shadow-elevated hover:border-primary/50"
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={imageSrc} 
          alt={t(`ben.${b.k}.t`)}
          className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay - Stronger at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 opacity-85 transition-opacity duration-500 group-hover:opacity-95" />
        
        {/* Icon Badge - Floating on Image */}
        <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm text-primary shadow-elevated transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary group-hover:text-white">
          <b.icon className="h-7 w-7" />
        </div>

        {/* Number Badge - Top Right */}
        <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 backdrop-blur text-white font-bold transition-all duration-500 group-hover:scale-110">
          {String(i + 1).padStart(2, "0")}
        </div>

        {/* Content Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 className="font-display text-2xl font-semibold leading-tight transition-transform duration-500 group-hover:translate-y-[-4px]">
            {t(`ben.${b.k}.t`)}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/90 line-clamp-3 transition-all duration-500">
            {t(`ben.${b.k}.b`)}
          </p>
          
          {/* Learn More Link - Appears on Hover */}
          <a 
            href="#contact"
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
          >
            <span>{t("cta.learnMore")}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Shimmer Effect on Hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 group-hover:left-full" />
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute bottom-0 right-0 h-24 w-24 opacity-0 transition-opacity duration-500 group-hover:opacity-20">
        <div className="absolute bottom-0 right-0 h-full w-full rounded-tl-full bg-primary blur-2xl" />
      </div>
    </article>
  );
}

function Leadership() {
  const { t } = useT();
  const presidentSrc = useRemoteImage("leadership-president", leaderPresident);
  const deputySrc    = useRemoteImage("leadership-deputy", leaderDeputy);
  const team = [
    {
      name: "Mukayiranga Epiphanie",
      role: t("lead.president"),
      bio: t("lead.presidentBio"),
      photo: presidentSrc,
    },
    {
      name: "Nkurunziza Ndengeyintwari Emmanuel",
      role: t("lead.deputy"),
      bio: t("lead.deputyBio"),
      photo: deputySrc,
    },
  ];
  return (
    <section id="leadership" className="bg-cream py-16 md:py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {t("lead.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {t("lead.title")}
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {team.map((p) => (
            <div key={p.name} className="surface-card surface-card-hover overflow-hidden p-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <img
                  src={p.photo}
                  alt={`${p.name} — ${p.role}`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover object-top transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                    {p.role}
                  </p>
                  <h3 className="mt-0.5 font-display text-lg font-semibold leading-tight">
                    {p.name}
                  </h3>
                </div>
              </div>
              <p className="p-7 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Contact() {
  const { t } = useT();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [msg, setMsg]         = useState("");
  const [status, setStatus]   = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: msg.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Submission failed. Please try again.");
      }
      setStatus("done");
      setName(""); setEmail(""); setMsg("");
    } catch (err: any) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="container-x">
        <div
          className="relative overflow-hidden rounded-[2rem] p-8 md:p-12"
          style={{ background: "var(--gradient-sunrise)" }}
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
            <div className="text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                {t("contact.eyebrow")}
              </span>
              <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                {t("contact.title")}
              </h2>
              <p className="mt-5 max-w-md text-base text-white/85 md:text-lg">{t("contact.body")}</p>

              <div className="mt-10 space-y-4">
                <ContactRow
                  icon={Mail}
                  label={t("contact.email")}
                  value="komezaju@gmail.com"
                  href="mailto:komezaju@gmail.com"
                />
                <ContactRow
                  icon={MapPin}
                  label={t("contact.office")}
                  value={t("contact.officeV")}
                />
                <ContactRow icon={Phone} label={t("contact.langs")} value={t("contact.langsV")} />
              </div>
            </div>

            {status === "done" ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center shadow-elevated">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">Message sent!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for reaching out. We'll get back to you within a few days.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl bg-card p-6 shadow-elevated md:p-8"
              >
                <h3 className="font-display text-2xl font-semibold">{t("contact.form.title")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("contact.form.sub")}</p>

                {status === "error" && (
                  <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {errMsg}
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="c-name" className="text-sm font-medium">
                      {t("contact.form.name")}
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("contact.form.namePh")}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="text-sm font-medium">
                      {t("contact.form.email")}
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("contact.form.emailPh")}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-msg" className="text-sm font-medium">
                      {t("contact.form.msg")}
                    </label>
                    <textarea
                      id="c-msg"
                      rows={4}
                      required
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder={t("contact.form.msgPh")}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : <>{t("contact.form.send")} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">{label}</p>
        <p className="mt-0.5 break-words text-base font-medium text-white">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition hover:opacity-90">
      {Inner}
    </a>
  ) : (
    Inner
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </div>
  );
}

function Footer() {
  const { t } = useT();

  const socials = [
    {
      label: "Facebook",
      href: "https://facebook.com/komezaju",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://instagram.com/komezaju",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      href: "https://x.com/komezaju",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/komezaju",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@komezaju",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="" className="h-10 w-10" />
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold">KOMEZAJU</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Organization
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t("footer.tag")}</p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-muted/40 text-foreground/60 transition-all duration-200 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-glow hover:-translate-y-0.5"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t("footer.explore")}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-foreground/80 transition hover:text-primary">
                    {t(n.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t("footer.contact")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:komezaju@gmail.com" className="transition hover:text-primary">
                  komezaju@gmail.com
                </a>
              </li>
              <li>Nyabivumu, Nyamata</li>
              <li>Bugesera, Rwanda</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} KOMEZAJU Organization. {t("footer.rights")}</p>
          <p>{t("footer.built")}</p>
        </div>
      </div>
    </footer>
  );
}

function LocationMap() {
  const embedSrc = `https://www.google.com/maps?q=${ORG_LAT},${ORG_LNG}&hl=en&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${ORG_LAT},${ORG_LNG}`;
  return (
    <section id="location" className="bg-cream py-20 md:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Find Us
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            Visit our office in Nyamata.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Nyabivumu Village · Nyamata Sector · Bugesera District · Eastern Province, Rwanda.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="surface-card flex flex-col justify-between p-7">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">KOMEZAJU Head Office</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nyabivumu, Nyamata, Bugesera District, Eastern Province, Rwanda.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/80">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  komezajuorganization1@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  +250 788 000 000
                </li>
              </ul>
            </div>
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border shadow-soft lg:col-span-2">
            <iframe
              src={embedSrc}
              title="KOMEZAJU Organization location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full md:h-[520px]"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingActions({ onDonate }: { onDonate: () => void }) {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <button
        type="button"
        onClick={onDonate}
        className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
        aria-label="Donate"
      >
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Donate</span>
      </button>
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-elevated transition hover:brightness-110"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Chat with us</span>
      </a>
    </div>
  );
}

const DONATION_PRESETS_USD = [10, 25, 50, 100, 250];
const DONATION_PRESETS_RWF = [10000, 25000, 50000, 100000, 250000];

function DonateModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"amount" | "details" | "done">("amount");
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState<string>("");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "RWF">("USD");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const finalAmount = custom ? Number(custom) || 0 : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          amount: finalAmount,
          currency,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Submission failed. Please try again.");
      }
      setStep("done");
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-y-auto max-h-[92dvh] rounded-t-3xl bg-card shadow-elevated sm:rounded-3xl animate-fade-up"
      >
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 transition hover:bg-foreground hover:text-background">
          <X className="h-4 w-4" />
        </button>

        {step === "amount" && (
          <div className="p-7 md:p-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Heart className="h-3.5 w-3.5" /> Support our work
            </div>
            <h3 id="donate-title" className="mt-4 font-display text-3xl font-semibold leading-tight">
              Power community change.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your gift funds youth training, women cooperatives, and environment programs in Bugesera.
            </p>
            <div className="mt-6 inline-flex rounded-full bg-muted p-1 text-xs font-semibold">
              {(["one-time", "monthly"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFrequency(f)}
                  className={`rounded-full px-4 py-2 capitalize transition ${frequency === f ? "bg-foreground text-background" : "text-foreground/70"}`}>
                  {f === "one-time" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Choose an amount</label>
                <select value={currency} onChange={(e) => {
                    const next = e.target.value as typeof currency;
                    setCurrency(next);
                    setCustom("");
                    setAmount(next === "RWF" ? DONATION_PRESETS_RWF[1] : DONATION_PRESETS_USD[1]);
                  }}
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold outline-none">
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                  <option value="RWF">RWF</option>
                </select>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {(currency === "RWF" ? DONATION_PRESETS_RWF : DONATION_PRESETS_USD).map((v) => {
                  const active = !custom && v === amount;
                  return (
                    <button key={v} type="button" onClick={() => { setAmount(v); setCustom(""); }}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-background text-foreground hover:border-primary/50"}`}>
                      {v.toLocaleString()}
                    </button>
                  );
                })}
              </div>
              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {currency === "USD" ? "$" : currency === "EUR" ? "€" : "RWF "}
                </span>
                <input type="number" min={1} inputMode="numeric" placeholder="Other amount" value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background py-3 pl-14 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
              </div>
            </div>
            <button type="button" disabled={finalAmount <= 0}
              onClick={() => setStep("details")}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              <CreditCard className="h-4 w-4" />
              Continue — {currency === "USD" ? "$" : currency === "EUR" ? "€" : "RWF "}{finalAmount.toLocaleString()}
              {frequency === "monthly" ? " / month" : ""}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Secure checkout · You can cancel anytime.</p>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="p-7 md:p-9">
            <button type="button" onClick={() => setStep("amount")}
              className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              ← Back
            </button>
            <h3 className="font-display text-2xl font-semibold">Your details</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll keep your information secure and only contact you about your gift.
            </p>
            {submitError && (
              <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{submitError}</div>
            )}
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="donor-name" className="text-sm font-medium">Full name</label>
                <input id="donor-name" type="text" required value={donorName} onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background py-3 px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" />
              </div>
              <div>
                <label htmlFor="donor-email" className="text-sm font-medium">Email address</label>
                <input id="donor-email" type="email" required value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background py-3 px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" />
              </div>
              <div>
                <label htmlFor="donor-msg" className="text-sm font-medium">Message <span className="text-muted-foreground">(optional)</span></label>
                <textarea id="donor-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share why you're supporting KOMEZAJU…"
                  className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background py-3 px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-50">
              <Heart className="h-4 w-4" />
              {submitting ? "Recording…" : `Donate ${currency === "USD" ? "$" : currency === "EUR" ? "€" : "RWF "}${finalAmount.toLocaleString()}${frequency === "monthly" ? " / month" : ""}`}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Your donation intent is recorded securely. Our team will contact you with payment options.
            </p>
          </form>
        )}

        {step === "done" && (
          <div className="p-9 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold">Thank you, {donorName.split(" ")[0]}!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your donation of {currency === "USD" ? "$" : currency === "EUR" ? "€" : "RWF "}
              {finalAmount.toLocaleString()}{frequency === "monthly" ? " / month" : ""} has been recorded.
              We'll reach out to <strong>{donorEmail}</strong> with secure payment options shortly.
            </p>
            <button type="button" onClick={onClose}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Auto-focus the email input once the modal is open
    const t = setTimeout(() => emailRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      onClose();
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-y-auto max-h-[92dvh] rounded-t-3xl bg-card shadow-elevated sm:rounded-3xl animate-fade-up"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 transition hover:bg-foreground hover:text-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7 md:p-9">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="KOMEZAJU" className="h-10 w-10" />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold">KOMEZAJU</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Admin Portal
              </p>
            </div>
          </div>

          <h3 id="login-title" className="mt-8 font-display text-2xl font-semibold">Welcome back</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your administrator account.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="admin-email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={emailRef}
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@komezaju.org"
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-11 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              <span>Secure administrator area · Authorized access only</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
