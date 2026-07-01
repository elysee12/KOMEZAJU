import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineLightBulb,
  HiOutlineGlobe,
  HiOutlineSpeakerphone,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChat,
  HiOutlineLockClosed,
  HiOutlineCreditCard,
  HiOutlineEye,
  HiOutlineTarget,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import hero from "../assets/hero-community.jpg";
import youthImg from "../assets/youth-training.jpg";
import womenImg from "../assets/women-cooperative.jpg";
import envImg from "../assets/environment.jpg";
import beneficiariesImg from "../assets/beneficiaries.jpg";
import leaderPresident from "../assets/leader-president.jpg";
import leaderDeputy from "../assets/leader-deputy.jpg";
import { LANGS, useT, type Lang } from "../lib/i18n";

const NAV = [
  { href: "#mission", key: "nav.mission" },
  { href: "#programs", key: "nav.programs" },
  { href: "#beneficiaries", key: "nav.beneficiaries" },
  { href: "#impact", key: "nav.impact" },
  { href: "#leadership", key: "nav.leadership" },
  { href: "#contact", key: "nav.contact" },
];

const BENEFICIARIES = [
  { icon: HiOutlineAcademicCap, k: "youth" },
  { icon: HiOutlineHeart, k: "women" },
  { icon: HiOutlineShieldCheck, k: "disability" },
  { icon: HiOutlineSparkles, k: "teen" },
  { icon: HiOutlineUsers, k: "vulnerable" },
];

const ACTIVITIES = [
  { icon: HiOutlineUsers, k: "youth" },
  { icon: HiOutlineBriefcase, k: "jobs" },
  { icon: HiOutlineHeart, k: "coops" },
  { icon: HiOutlineShieldCheck, k: "rights" },
  { icon: HiOutlineLightBulb, k: "drug" },
  { icon: HiOutlineGlobe, k: "env" },
  { icon: HiOutlineSpeakerphone, k: "debates" },
  { icon: HiOutlineSparkles, k: "voice" },
  { icon: HiOutlineAcademicCap, k: "mediation" },
  { icon: HiOutlineLightningBolt, k: "partners" },
];

const WHATSAPP_NUMBER = "250788000000";
const WHATSAPP_MSG = "Hello KOMEZAJU, I'd like to learn more about your work.";
const ORG_LAT = -2.1486;
const ORG_LNG = 30.0931;

function HomePage() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onDonate={() => setDonateOpen(true)} />
      <main>
        <Hero onDonate={() => setDonateOpen(true)} />
        <TrustStrip />
