import React, { useState } from "react";
import { Template, CategoryId } from "../types";
import { CATEGORIES, TESTIMONIALS } from "../data/mockData";
import { TemplateGrid } from "../components/templates/TemplateGrid";
import { CelebrationCharacter } from "../components/character/CelebrationCharacter";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Gift,
  Heart,
  Share2,
  ArrowRight,
  Zap,
  Smartphone,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Smile,
  Music,
  Cake,
  Flame,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
interface HomeViewProps {
  templates: Template[];
  onViewDemo: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
  onExplore: () => void;
  onSelectCategory: (cat: CategoryId) => void;
  onStartCreate: () => void;
}
export const HomeView: React.FC<HomeViewProps> = ({
  templates,
  onViewDemo,
  onUseTemplate,
  onExplore,
  onSelectCategory,
  onStartCreate,
}) => {
  const [isOpenSurpriseWidget, setIsOpenSurpriseWidget] = useState(false);
  const popularTemplates = templates.slice(0, 6);
  const handleOpenInteractiveSurprise = () => {
    setIsOpenSurpriseWidget(true);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };
  return (
    <div className="space-y-20 pb-16 min-h-screen">
      {" "}
      {/* 1. HERO SECTION */}{" "}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 overflow-hidden">
        {" "}
        {/* Ambient Gradient Background Glow */}{" "}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-100/60 to-pink-100/60 blur-3xl rounded-full -z-10 pointer-events-none" />{" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {" "}
          {/* Top Pill */}{" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b0ba99] border border-[#b0ba99] text-[#9d6638] text-xs font-bold shadow-sm">
            {" "}
            <span className="flex h-2 w-2 rounded-full bg-[#b0ba99] animate-pulse"></span>{" "}
            <span className="text-[11px] font-bold uppercase tracking-wider">
              New: Anniversary Magic Template
            </span>{" "}
          </div>{" "}
          {/* Headline */}{" "}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#4e220f] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            {" "}
            Make Every{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              {" "}
              Celebration{" "}
            </span>{" "}
            Special{" "}
          </h1>{" "}
          {/* Subheadline */}{" "}
          <p className="text-base sm:text-lg text-[#4e220f] max-w-xl mx-auto leading-relaxed">
            {" "}
            Choose a beautiful template, add your personal message, and create a
            shareable surprise in seconds. No design skills required.{" "}
          </p>{" "}
          {/* CTAs */}{" "}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.6 }}
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 bg-[#9d6638] hover:bg-[#4e220f] text-[#f7f1de] font-bold rounded-[2rem] text-sm shadow-xl transition-all flex items-center justify-center gap-2.5"
            >
              {" "}
              <Sparkles className="w-4 h-4 text-[#f7f1de]" />{" "}
              <span>Explore Templates</span>{" "}
            </motion.button>{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.6 }}
              onClick={onStartCreate}
              className="w-full sm:w-auto px-8 py-4 bg-[#b0ba99] hover:bg-[#9d6638] hover:text-[#f7f1de] text-[#4e220f] font-bold rounded-[2rem] text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {" "}
              <Gift className="w-4 h-4" /> <span>Create a Wish</span>{" "}
            </motion.button>{" "}
          </div>{" "}
          {/* HERO VISUAL MOCKUP WITH FLOATING ELEMENTS */}{" "}
          <div className="pt-8 max-w-4xl mx-auto relative">
            {" "}
            {/* Floating Element 1: Confetti Badge */}{" "}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="hidden sm:flex absolute -top-4 -left-6 z-20 items-center gap-2 px-4 py-2.5 bg-white/60 rounded-2xl shadow-xl border border-[#b0ba99] text-xs font-bold text-[#4e220f] "
            >
              {" "}
              <span className="text-xl">🎉</span>{" "}
              <div>
                {" "}
                <p className="leading-tight">Instant Confetti</p>{" "}
                <p className="text-[10px] text-[#4e220f]">
                  Interactive Animations
                </p>{" "}
              </div>{" "}
            </motion.div>{" "}
            {/* Floating Element 2: Heart Rain */}{" "}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5 }}
              className="hidden sm:flex absolute top-1/3 -right-6 z-20 items-center gap-2 px-4 py-2.5 bg-white/60 rounded-2xl shadow-xl border border-[#b0ba99] text-xs font-bold text-[#4e220f] "
            >
              {" "}
              <Heart className="w-5 h-5 text-[#9d6638] fill-pink-500" />{" "}
              <div>
                {" "}
                <p className="leading-tight">Romantic Memories</p>{" "}
                <p className="text-[10px] text-[#4e220f]">
                  Custom Audio & Photos
                </p>{" "}
              </div>{" "}
            </motion.div>{" "}
            {/* Floating Element 3: Share Link */}{" "}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5 }}
              className="hidden sm:flex absolute -bottom-6 left-12 z-20 items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white rounded-full shadow-xl text-xs font-bold"
            >
              {" "}
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </div>{" "}
              <span className="text-[#4e220f]">
                Link Copied: wishora.com/s/sarah-bday
              </span>{" "}
            </motion.div>{" "}
            {/* Main Browser Mockup Frame */}{" "}
            <div className="bg-white/60 p-2 sm:p-3 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-[#b0ba99] text-left overflow-hidden">
              {" "}
              {/* Browser Header Bar */}{" "}
              <div className="bg-white/60/60 h-9 flex items-center px-4 gap-1.5 border-b border-[#b0ba99] rounded-t-[24px]">
                {" "}
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />{" "}
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />{" "}
                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />{" "}
                <div className="ml-2 text-[10px] text-[#4e220f] font-mono">
                  {" "}
                  wishora.com/s/sarah-bday{" "}
                </div>{" "}
              </div>{" "}
              {/* Live Preview Inside Frame */}{" "}
              <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white overflow-hidden min-h-[300px] flex flex-col sm:flex-row items-center justify-between gap-6">
                {" "}
                <div className="max-w-lg space-y-3">
                  {" "}
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9d6638]">
                    {" "}
                    <Sparkles className="w-4 h-4 text-[#9d6638]" />{" "}
                    <span>Birthday Surprise Box</span>{" "}
                    <span className="bg-white/60/20 px-2.5 py-0.5 rounded-full text-[10px]">
                      Interactive Assistant
                    </span>{" "}
                  </div>{" "}
                  <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                    {" "}
                    Happy Birthday, Sarah! 🎉{" "}
                  </h3>{" "}
                  <p className="text-xs sm:text-sm text-white/90 italic font-serif">
                    {" "}
                    "Wishing you a day filled with happiness and a year filled
                    with joy. You deserve the best!"{" "}
                  </p>{" "}
                  {/* Photo Row */}{" "}
                  <div className="flex items-center gap-3 pt-2">
                    {" "}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Sarah"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />{" "}
                    <img
                      src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=300&q=80"
                      alt="Memory"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white/60 shadow-md"
                    />{" "}
                    <div className="text-xs font-bold text-[#9d6638]">
                      {" "}
                      +3 More Memories Captured 📸{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Wishy Hero Companion */}{" "}
                <div className="shrink-0 flex flex-col items-center justify-center bg-white/60/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
                  {" "}
                  <CelebrationCharacter
                    state="birthday"
                    speechText="Click me! I bring wishes to life! ✨"
                    size="md"
                    interactive={true}
                    onClick={handleOpenInteractiveSurprise}
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 2. TEMPLATE CATEGORIES */}{" "}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {" "}
        <div className="text-center space-y-2">
          {" "}
          <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
            Occasions
          </span>{" "}
          <h2 className="text-3xl sm:text-4xl font-black text-[#4e220f] tracking-tight">
            {" "}
            Celebrate Every Special Moment{" "}
          </h2>{" "}
          <p className="text-sm text-[#4e220f] max-w-xl mx-auto">
            {" "}
            Choose an occasion and create a memorable digital experience in
            seconds.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {" "}
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => onSelectCategory(cat.id)}
              className="p-5 rounded-2xl bg-white/60 border border-[#b0ba99] shadow-sm hover:shadow-xl hover:shadow-purple-100 :shadow-purple-950/20 hover:border-[#b0ba99] transition-all text-center flex flex-col items-center space-y-3 group"
            >
              {" "}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-2xl shadow-sm text-white`}
              >
                {" "}
                {cat.emoji}{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="text-sm font-bold text-[#4e220f] group-hover:text-[#9d6638] transition-colors">
                  {" "}
                  {cat.name}{" "}
                </h3>{" "}
                <p className="text-[11px] text-[#4e220f] mt-0.5">
                  {cat.count} Templates
                </p>{" "}
              </div>{" "}
            </motion.button>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 3. POPULAR TEMPLATES */}{" "}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {" "}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
          {" "}
          <div>
            {" "}
            <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
              Popular Picks
            </span>{" "}
            <h2 className="text-3xl sm:text-4xl font-black text-[#4e220f] tracking-tight">
              {" "}
              Popular Celebration Templates{" "}
            </h2>{" "}
          </div>{" "}
          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-full border border-[#b0ba99] hover:border-[#b0ba99] bg-white/60 text-[#4e220f] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {" "}
            <span>View All Templates</span>{" "}
            <ArrowRight className="w-4 h-4 text-[#9d6638]" />{" "}
          </button>{" "}
        </div>{" "}
        <TemplateGrid
          templates={popularTemplates}
          onViewDemo={onViewDemo}
          onUseTemplate={onUseTemplate}
          showFilters={false}
          defaultLayout="carousel"
        />{" "}
      </section>{" "}
      {/* 4. HOW IT WORKS */}{" "}
      <section className="bg-[#1A1A1A] text-white py-16 sm:py-24 rounded-[32px] max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden shadow-2xl">
        {" "}
        <div className="text-center space-y-3 mb-16">
          {" "}
          <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
            Simple Process
          </span>{" "}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How Wishora Works
          </h2>{" "}
          <p className="text-sm text-[#4e220f] max-w-lg mx-auto">
            {" "}
            Create and send a personalized digital surprise in 4 easy
            steps.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {" "}
          {[
            {
              step: "01",
              title: "Choose a Template",
              desc: "Browse beautiful ready-made celebration templates for every milestone.",
            },
            {
              step: "02",
              title: "Add Your Details",
              desc: "Enter the person's name, personal message, photo memories, and music.",
            },
            {
              step: "03",
              title: "Generate",
              desc: "Your personalized celebration page is automatically created.",
            },
            {
              step: "04",
              title: "Share",
              desc: "Copy the link or share it directly via WhatsApp, SMS, or QR code.",
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/60/5 rounded-2xl border border-white/10 space-y-3 backdrop-blur-sm"
            >
              {" "}
              <span className="text-3xl font-black text-[#9d6638]">
                {s.step}
              </span>{" "}
              <h3 className="text-lg font-bold text-white">{s.title}</h3>{" "}
              <p className="text-xs text-[#4e220f] leading-relaxed">
                {s.desc}
              </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 5. WHY WISHORA FEATURES */}{" "}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {" "}
        <div className="text-center space-y-2">
          {" "}
          <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
            Platform Features
          </span>{" "}
          <h2 className="text-3xl sm:text-4xl font-black text-[#4e220f] tracking-tight">
            {" "}
            Why People Love Wishora{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          {[
            {
              icon: Gift,
              title: "Ready-Made Templates",
              desc: "Professionally crafted designs for birthdays, anniversaries, weddings, and more.",
            },
            {
              icon: Zap,
              title: "Create in Seconds",
              desc: "No coding or design skills needed. Just enter details and launch instantly.",
            },
            {
              icon: Heart,
              title: "Personalized Messages",
              desc: "Heartfelt personal letters, custom audio tunes, and candle blowing effects.",
            },
            {
              icon: Smartphone,
              title: "Photo Memories",
              desc: "Showcase cherished moments in beautiful interactive photo gallery reels.",
            },
            {
              icon: Sparkles,
              title: "Interactive Animations",
              desc: "Confetti bursts, heart rain, and virtual gift boxes when recipients open.",
            },
            {
              icon: Share2,
              title: "Share Anywhere",
              desc: "One-click sharing via WhatsApp, Instagram, Facebook, and Email.",
            },
            {
              icon: QrCode,
              title: "QR Code Sharing",
              desc: "Download high-res QR codes for physical party cards & invitation prints.",
            },
            {
              icon: ShieldCheck,
              title: "Mobile Friendly",
              desc: "Optimized for mobile web view so recipients open surprises seamlessly.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/60 border border-[#b0ba99] shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              {" "}
              <div className="w-10 h-10 rounded-xl bg-[#b0ba99] text-[#9d6638] flex items-center justify-center">
                {" "}
                <f.icon className="w-5 h-5" />{" "}
              </div>{" "}
              <h3 className="text-base font-bold text-[#4e220f] ">{f.title}</h3>{" "}
              <p className="text-xs text-[#4e220f] leading-relaxed">
                {f.desc}
              </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 6. PREVIEW EXPERIENCE SECTION */}{" "}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        {" "}
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 text-white shadow-2xl text-center space-y-6">
          {" "}
          <div>
            {" "}
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-white/60/20 backdrop-blur-md uppercase tracking-wider text-[#9d6638]">
              {" "}
              Interactive Experience{" "}
            </span>{" "}
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              {" "}
              "Someone has a surprise for you..."{" "}
            </h2>{" "}
            <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto mt-2">
              {" "}
              See what your recipient feels when opening their custom Wishora
              celebration link.{" "}
            </p>{" "}
          </div>{" "}
          {!isOpenSurpriseWidget ? (
            <button
              onClick={handleOpenInteractiveSurprise}
              className="px-8 py-4 bg-white/60 text-[#9d6638] font-bold text-base rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              {" "}
              <Gift className="w-5 h-5 text-[#9d6638]" />{" "}
              <span>Open Surprise 🎁</span>{" "}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-white/60/10 backdrop-blur-md rounded-2xl border border-white/20 text-left max-w-lg mx-auto space-y-4"
            >
              {" "}
              <div className="flex items-center justify-between text-xs font-bold text-[#9d6638]">
                {" "}
                <span>🎂 Birthday Surprise Unwrapped!</span>{" "}
                <span>✨ Confetti Fired</span>{" "}
              </div>{" "}
              <p className="text-sm italic font-serif">
                {" "}
                "Happy Birthday Alex! Thank you for being such an extraordinary
                friend. Here is to a fantastic year filled with laughter!"{" "}
              </p>{" "}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#9d6638]">
                {" "}
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />{" "}
                <span>Audio Music Playing • Photo Gallery Loaded</span>{" "}
              </div>{" "}
            </motion.div>
          )}{" "}
        </div>{" "}
      </section>{" "}
      {/* 7. FINAL CALL TO ACTION */}{" "}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        {" "}
        <div className="p-10 sm:p-16 bg-white/60 rounded-[32px] border border-[#b0ba99] shadow-xl space-y-6">
          {" "}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#4e220f] tracking-tight">
            {" "}
            Turn Your Message Into a Memory ❤️{" "}
          </h2>{" "}
          <p className="text-sm sm:text-base text-[#4e220f] max-w-md mx-auto">
            {" "}
            Create a beautiful celebration page and share it with someone
            special today.{" "}
          </p>{" "}
          <button
            onClick={onStartCreate}
            className="px-10 py-4 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-base rounded-full shadow-xl shadow-purple-200 hover:scale-105 transition-all"
          >
            {" "}
            Create Your Celebration 🎉{" "}
          </button>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
};
