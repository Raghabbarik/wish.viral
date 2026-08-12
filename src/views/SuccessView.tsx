import React, { useState } from "react";
import { CelebrationData } from "../types";
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  QrCode,
  ExternalLink,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { useToast } from "../components/common/Toast";
import { QRCodeModal } from "../components/common/QRCodeModal";
import { CelebrationCharacter } from "../components/character/CelebrationCharacter";
interface SuccessViewProps {
  celebration: CelebrationData;
  onOpenCelebration: (celebration: CelebrationData) => void;
  onCreateAnother: () => void;
  onViewMyCelebrations: () => void;
}
export const SuccessView: React.FC<SuccessViewProps> = ({
  celebration,
  onOpenCelebration,
  onCreateAnother,
  onViewMyCelebrations,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const { showToast } = useToast();
  const generatedUrl = `${window.location.origin}/w/${celebration.slug}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    showToast("Link Copied! 🎉", "Share it on WhatsApp or social media.");
  };
  const whatsappMessage = encodeURIComponent(
    `Hey ${celebration.recipientName}! I created a special surprise celebration page for you on Wishora 🎉 Open your link here: ${generatedUrl}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-center">
      {" "}
      {/* Animated Celebrating Mascot */}{" "}
      <div className="flex flex-col items-center justify-center">
        {" "}
        <CelebrationCharacter
          state="celebrating"
          speechText={`Yay! ${celebration.recipientName}'s surprise page is live! 🎉`}
          size="lg"
          interactive={true}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
          {" "}
          Celebration Live Online{" "}
        </span>{" "}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#4e220f] tracking-tight">
          {" "}
          Your Celebration Is Ready! 🎉{" "}
        </h1>{" "}
        <p className="text-sm text-[#4e220f] max-w-md mx-auto">
          {" "}
          We generated a personalized surprise link for{" "}
          <span className="font-bold text-[#4e220f] ">
            {celebration.recipientName}
          </span>
          .{" "}
        </p>{" "}
      </div>{" "}
      {/* Generated Link Card */}{" "}
      <div className="p-6 bg-white/60 rounded-3xl border border-[#b0ba99] shadow-xl space-y-4">
        {" "}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white/60/60 rounded-2xl border border-[#b0ba99] ">
          {" "}
          <div className="text-left truncate w-full sm:w-auto">
            {" "}
            <p className="text-[11px] font-bold text-[#4e220f] uppercase">
              Shareable Web Link
            </p>{" "}
            <p className="text-sm font-bold text-[#4e220f] truncate">
              {generatedUrl}
            </p>{" "}
          </div>{" "}
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            {" "}
            <Copy className="w-4 h-4" /> <span>Copy Link</span>{" "}
          </button>{" "}
        </div>{" "}
        {/* Action Buttons */}{" "}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {" "}
            <MessageCircle className="w-4 h-4" />{" "}
            <span>Share on WhatsApp</span>{" "}
          </a>{" "}
          <button
            onClick={() => setShowQrModal(true)}
            className="py-3 px-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {" "}
            <QrCode className="w-4 h-4" /> <span>Generate QR Code</span>{" "}
          </button>{" "}
          <button
            onClick={() => onOpenCelebration(celebration)}
            className="py-3 px-4 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {" "}
            <ExternalLink className="w-4 h-4" />{" "}
            <span>Open Celebration Page</span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Bottom Buttons */}{" "}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        {" "}
        <button
          onClick={onCreateAnother}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#b0ba99] bg-white/60 text-[#4e220f] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {" "}
          <PlusCircle className="w-4 h-4 text-[#9d6638]" />{" "}
          <span>Create Another Celebration</span>{" "}
        </button>{" "}
        <button
          onClick={onViewMyCelebrations}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/60/60 hover:bg-white/60/60 text-[#4e220f] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          {" "}
          <span>Go To My Celebrations</span>{" "}
          <ArrowRight className="w-4 h-4" />{" "}
        </button>{" "}
      </div>{" "}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={generatedUrl}
        recipientName={celebration.recipientName}
      />{" "}
    </div>
  );
};
