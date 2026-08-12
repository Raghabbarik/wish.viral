import React, { useState } from "react";
import {
  Gift,
  Heart,
  Send,
  Instagram,
  Facebook,
  Youtube,
  Sparkles,
} from "lucide-react";
import { useToast } from "./Toast";
interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
}
export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenLogin,
}) => {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast(
        "Subscribed! 💌",
        "You will receive new seasonal template alerts.",
      );
      setEmail("");
    }
  };
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="bg-white/60/60 text-[#4e220f] pt-16 pb-12 border-t border-[#b0ba99]">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#b0ba99]">
          {" "}
          {/* Column 1: Brand & Bio */}{" "}
          <div className="lg:col-span-2 space-y-4">
            {" "}
            <div className="flex items-center gap-2.5">
              {" "}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-500 p-0.5 shadow-md">
                {" "}
                <div className="w-full h-full bg-white/60/60 rounded-[14px] flex items-center justify-center">
                  {" "}
                  <Gift className="w-5 h-5 text-[#9d6638]" />{" "}
                </div>{" "}
              </div>{" "}
              <span className="text-2xl font-black tracking-tight text-white">
                Wishora
              </span>{" "}
            </div>{" "}
            <p className="text-[#4e220f] text-sm leading-relaxed max-w-sm">
              {" "}
              Make every special moment memorable with beautiful, interactive
              digital celebrations. Choose a template, personalize your message,
              and share a surprise link in seconds.{" "}
            </p>{" "}
            {/* Newsletter */}{" "}
            <form onSubmit={handleSubscribe} className="pt-2">
              {" "}
              <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                {" "}
                <Sparkles className="w-3.5 h-3.5 text-[#9d6638]" />{" "}
                <span>Get Seasonal Template Updates</span>{" "}
              </p>{" "}
              <div className="flex items-center gap-2 max-w-sm">
                {" "}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/60/60 border border-[#b0ba99] text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />{" "}
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#b0ba99] hover:bg-[#b0ba99] text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-1 shrink-0"
                >
                  {" "}
                  <Send className="w-4 h-4" />{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
          {/* Column 2: Product */}{" "}
          <div>
            {" "}
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Product
            </h4>{" "}
            <ul className="space-y-2.5 text-sm">
              {" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  Templates{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("how-it-works")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  How It Works{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("pricing")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  Pricing{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("my-celebrations")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  My Celebrations{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors text-[#9d6638] font-medium"
                >
                  {" "}
                  ★ Popular Templates{" "}
                </button>{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          {/* Column 3: Occasions */}{" "}
          <div>
            {" "}
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Occasions
            </h4>{" "}
            <ul className="space-y-2.5 text-sm">
              {" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  🎂 Birthday Wishes{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  ❤️ Anniversary Love{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  🎓 Graduation Memory{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  💍 Wedding Blessings{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <button
                  onClick={() => handleNav("explore")}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  🎉 Congratulations{" "}
                </button>{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          {/* Column 4: Company & Social */}{" "}
          <div>
            {" "}
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Company
            </h4>{" "}
            <ul className="space-y-2.5 text-sm mb-6">
              {" "}
              <li>
                {" "}
                <button
                  onClick={onOpenLogin}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  Sign In / Account{" "}
                </button>{" "}
              </li>{" "}
              <li>
                {" "}
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(
                      "Wishora Story",
                      "Created to bring joy and digital connection across the globe.",
                    );
                  }}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  About Us{" "}
                </a>{" "}
              </li>{" "}
              <li>
                {" "}
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(
                      "Privacy Guaranteed",
                      "Your photos & messages are stored securely.",
                    );
                  }}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  Privacy Policy{" "}
                </a>{" "}
              </li>{" "}
              <li>
                {" "}
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(
                      "Terms of Service",
                      "Free & Pro celebration guidelines.",
                    );
                  }}
                  className="hover:text-[#9d6638] transition-colors"
                >
                  {" "}
                  Terms of Use{" "}
                </a>{" "}
              </li>{" "}
            </ul>{" "}
            <h5 className="text-xs font-bold text-[#4e220f] uppercase tracking-widest mb-3">
              Connect With Us
            </h5>{" "}
            <div className="flex items-center gap-3">
              {" "}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/60/60 hover:bg-[#b0ba99] hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                {" "}
                <Instagram className="w-4 h-4" />{" "}
              </a>{" "}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/60/60 hover:bg-[#b0ba99] hover:text-white flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                {" "}
                <Facebook className="w-4 h-4" />{" "}
              </a>{" "}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/60/60 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                {" "}
                <Youtube className="w-4 h-4" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Bottom Bar */}{" "}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4e220f] gap-4">
          {" "}
          <p>
            © {new Date().getFullYear()} Wishora Digital Celebrations. All
            rights reserved.
          </p>{" "}
          <div className="flex items-center gap-1">
            {" "}
            <span>Crafted with</span>{" "}
            <Heart className="w-3.5 h-3.5 text-[#9d6638] fill-rose-500" />{" "}
            <span>for magical moments worldwide.</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
};
