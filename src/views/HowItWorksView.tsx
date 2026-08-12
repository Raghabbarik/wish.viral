import React from "react";
import {
  Sparkles,
  Search,
  Sliders,
  Share2,
  Gift,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
interface HowItWorksViewProps {
  onStartExplore: () => void;
}
export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onStartExplore,
}) => {
  const steps = [
    {
      step: "01",
      title: "Choose a Celebration Template",
      subtitle: "Pick from ready-made interactive themes",
      desc: "Browse through our library of curated templates tailored for birthdays, anniversaries, weddings, graduation, farewells, festivals, and personal milestones.",
      bulletPoints: [
        "Over 20+ ready-made templates",
        "Built-in audio music tunes",
        "Interactive confetti & candle blowing",
        "Categorized by occasion",
      ],
      previewImg:
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    },
    {
      step: "02",
      title: "Personalize With Message & Photos",
      subtitle: "Add your personal touch in seconds",
      desc: "Enter the receiver name, your name, a heartfelt letter or message, and upload your favorite photo memories or select from our photo galleries.",
      bulletPoints: [
        "Real-time character limit helper",
        "Inspire wish generator ideas",
        "HD photo memory uploader",
        "Background music selector",
      ],
      previewImg:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    },
    {
      step: "03",
      title: "Generate Celebration Page",
      subtitle: "Instant unique web page URL creation",
      desc: "Wishora compiles your details into an interactive, beautifully styled web page hosted on a secure short link.",
      bulletPoints: [
        "Zero design skill required",
        "Live preview before sending",
        "Mobile web responsive view",
        "Optimized fast loading",
      ],
      previewImg:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    },
    {
      step: "04",
      title: "Share & Delight Your Recipient",
      subtitle: "Surprise them on WhatsApp, Social or QR",
      desc: "Copy the celebration link or share directly via WhatsApp. When the recipient opens the link, confetti explodes, music plays, and your letter unfolds!",
      bulletPoints: [
        "Instant 1-click WhatsApp share",
        "Downloadable QR Code",
        "Unopened surprise envelope box",
        "Memorable lifetime link",
      ],
      previewImg:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {" "}
      {/* Header */}{" "}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        {" "}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#b0ba99] border border-[#b0ba99] text-[#9d6638] text-xs font-bold">
          {" "}
          <Sparkles className="w-3.5 h-3.5 text-[#9d6638]" />{" "}
          <span>Step-by-Step Guide</span>{" "}
        </div>{" "}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#4e220f] tracking-tight">
          {" "}
          How Wishora Magic Works{" "}
        </h1>{" "}
        <p className="text-sm sm:text-base text-[#4e220f] ">
          {" "}
          Learn how you can turn simple text messages into unforgettable digital
          celebration memories.{" "}
        </p>{" "}
      </div>{" "}
      {/* Detailed Steps Loop */}{" "}
      <div className="space-y-12">
        {" "}
        {steps.map((s, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-10 p-8 sm:p-12 rounded-[32px] bg-white/60 border border-[#b0ba99] shadow-sm ${!isEven ? "lg:flex-row-reverse" : ""}`}
            >
              {" "}
              {/* Text Side */}{" "}
              <div className="flex-1 space-y-4">
                {" "}
                <span className="text-4xl font-black text-[#9d6638]">
                  {s.step}
                </span>{" "}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4e220f] tracking-tight">
                  {" "}
                  {s.title}{" "}
                </h2>{" "}
                <p className="text-xs font-bold uppercase tracking-wider text-[#9d6638] ">
                  {" "}
                  {s.subtitle}{" "}
                </p>{" "}
                <p className="text-sm text-[#4e220f] leading-relaxed">
                  {" "}
                  {s.desc}{" "}
                </p>{" "}
                <ul className="space-y-2 pt-2 text-xs font-semibold text-[#4e220f] ">
                  {" "}
                  {s.bulletPoints.map((bp, bidx) => (
                    <li key={bidx} className="flex items-center gap-2">
                      {" "}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
                      <span>{bp}</span>{" "}
                    </li>
                  ))}{" "}
                </ul>{" "}
              </div>{" "}
              {/* Image Side */}{" "}
              <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#b0ba99] shadow-md">
                {" "}
                <img
                  src={s.previewImg}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />{" "}
              </div>{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
      {/* CTA */}{" "}
      <div className="p-10 bg-[#1A1A1A] text-white rounded-[32px] text-center space-y-4 shadow-xl">
        {" "}
        <h2 className="text-2xl sm:text-4xl font-extrabold">
          Ready To Create Your Surprise?
        </h2>{" "}
        <p className="text-xs sm:text-sm text-[#4e220f] max-w-md mx-auto">
          {" "}
          Choose a template and make someone smile today.{" "}
        </p>{" "}
        <button
          onClick={onStartExplore}
          className="px-8 py-3.5 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-full shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          {" "}
          <span>Start Creating Now</span>{" "}
          <ArrowRight className="w-4 h-4" />{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
};
