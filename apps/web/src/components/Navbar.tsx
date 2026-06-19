import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/jewellery-collections" },
    { name: "Today's Rate", href: "/gold-rate-today-tirupur" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#1a0b2e]/95 border-b border-[#D4AF37]/30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/logo.jpg"
                alt="Sri Velmayil Jewellery"
                className="w-12 h-12 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] tracking-wider uppercase leading-none">
                  Sri Velmayil
                </span>
                <span className="font-sans text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-widest leading-none mt-1">
                  Jewellery • Tirupur
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 uppercase tracking-wider ${
                  isActive(link.href)
                    ? "text-[#1a0b2e] bg-[#D4AF37] font-semibold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                    : "text-[#F3E5AB]/85 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919443476183"
              className="inline-flex items-center px-4 py-2 border border-[#D4AF37] text-sm font-semibold rounded-full text-[#D4AF37] bg-transparent hover:bg-[#D4AF37] hover:text-[#1a0b2e] shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Call Store
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F3E5AB] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1a0b2e] border-b border-[#D4AF37]/20 transition-all duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-[#1a0b2e] bg-[#D4AF37]"
                    : "text-[#F3E5AB]/90 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-3">
              <a
                href="tel:+919443476183"
                className="w-full flex justify-center items-center py-3 border border-[#D4AF37] text-base font-bold rounded-md text-[#D4AF37] bg-transparent"
              >
                Call: +91 9443476183
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
