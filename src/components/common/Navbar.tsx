import React, { useState } from "react";
import { Sparkles, Menu, X, Gift, PlusCircle, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { User as FirebaseUser } from "firebase/auth";
interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onStartCreate: () => void;
  currentUser?: FirebaseUser | null;
}
export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogin,
  onStartCreate,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "explore", label: "Explore Templates" },
    { id: "how-it-works", label: "How It Works" },
    { id: "pricing", label: "Pricing" },
    { id: "my-celebrations", label: "My Celebrations" },
  ];
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <header className="sticky top-0 z-40 bg-white/60/80 backdrop-blur-md border-b border-[#b0ba99] transition-colors">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="flex items-center justify-between h-20">
          {" "}
          {/* Logo */}{" "}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            {" "}
            <div className="w-10 h-10 rounded-2xl bg-[#b0ba99] p-0.5 shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              {" "}
              <div className="w-full h-full bg-white/60 rounded-[14px] flex items-center justify-center">
                {" "}
                <Gift className="w-5 h-5 text-[#9d6638] group-hover:rotate-12 transition-transform" />{" "}
              </div>{" "}
            </div>{" "}
            <div className="text-left">
              {" "}
              <span className="text-2xl font-black tracking-tighter text-[#9d6638]">
                {" "}
                WISHORA{" "}
              </span>{" "}
              <span className="block text-[10px] font-bold text-[#9d6638] uppercase tracking-widest -mt-1">
                {" "}
                Digital Wishes{" "}
              </span>{" "}
            </div>{" "}
          </button>{" "}
          {/* Desktop Navigation */}{" "}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {" "}
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${isActive ? "text-[#9d6638] font-bold bg-[#b0ba99] " : "text-[#4e220f] hover:text-[#4e220f] :text-white hover:bg-white/60/60 :bg-white/60/60"}`}
                >
                  {" "}
                  {link.label}{" "}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#9d6638] rounded-full"
                    />
                  )}{" "}
                </button>
              );
            })}{" "}
          </nav>{" "}
          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-[#b0ba99]/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#9d6638] flex items-center justify-center text-white text-xs font-black">
                  {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#4e220f] max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email?.split("@")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-[#4e220f] hover:bg-[#b0ba99]/30 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#4e220f]" />
                <span>Login</span>
              </button>
            )}
            <button
              onClick={onStartCreate}
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#9d6638] hover:bg-[#4e220f] text-[#f7f1de] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> <span>Get Started</span>
            </button>
          </div>
          {/* Mobile Hamburger Button */}{" "}
          <div className="md:hidden flex items-center gap-2">
            {" "}
            <button
              onClick={onStartCreate}
              className="p-2 bg-[#9d6638] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              {" "}
              <PlusCircle className="w-4 h-4" /> <span>Create</span>{" "}
            </button>{" "}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-[#4e220f] hover:bg-white/60/60 :bg-white/60/60 transition-colors"
              aria-label="Toggle Navigation"
            >
              {" "}
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Mobile Drawer */}{" "}
      <AnimatePresence>
        {" "}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/60/95 border-b border-[#b0ba99] overflow-hidden"
          >
            {" "}
            <div className="px-4 pt-3 pb-6 space-y-2">
              {" "}
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full text-left px-4 py-3 min-h-[44px] rounded-xl text-base font-semibold flex items-center justify-between transition-colors ${isActive ? "bg-[#9d6638] text-white font-bold shadow-sm" : "text-[#4e220f] hover:bg-white/60/60 :bg-white/60/60"}`}
                  >
                    {" "}
                    <span>{link.label}</span>{" "}
                    {isActive && <Heart className="w-4 h-4 fill-white" />}{" "}
                  </button>
                );
              })}{" "}
              <div className="pt-4 border-t border-[#b0ba99] flex flex-col gap-2.5">
                {" "}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-3 min-h-[44px] rounded-xl text-[#4e220f] font-semibold bg-white/60/60 text-center text-sm"
                >
                  {" "}
                  Login / Account{" "}
                </button>{" "}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStartCreate();
                  }}
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-center text-sm shadow-md"
                >
                  {" "}
                  Get Started Free 🎉{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>{" "}
    </header>
  );
};
