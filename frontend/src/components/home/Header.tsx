import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX, HiOutlineLockClosed, HiOutlineHeart, HiOutlineArrowRight } from "react-icons/hi";
import logo from "../../assets/logo.png";
import { useT } from "../../lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV = [
  { href: "#mission", key: "nav.mission" },
  { href: "#programs", key: "nav.programs" },
  { href: "#beneficiaries", key: "nav.beneficiaries" },
  { href: "#impact", key: "nav.impact" },
  { href: "#leadership", key: "nav.leadership" },
  { href: "#contact", key: "nav.contact" },
];

interface HeaderProps {
  onDonate: () => void;
}

export function Header({ onDonate }: HeaderProps) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/90 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative">
            <img src={logo} alt="KOMEZAJU logo" className="h-12 w-12 transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col leading-tight">
