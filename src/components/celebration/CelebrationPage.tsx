import React, { useState, useEffect } from "react";
import { CelebrationData } from "../../types";
import { TEMPLATES } from "../../data/mockData";
import { musicSynth } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  Gift,
  Sparkles,
  Heart,
  Flame,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  MessageCircle,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
} from "lucide-react";
import { useToast } from "../common/Toast";
import { QRCodeModal } from "../common/QRCodeModal";
import { motion, AnimatePresence } from "motion/react";
interface CelebrationPageProps {
  celebration: CelebrationData;
  onBackToHome: () => void;
  onCreateNew: () => void;
}
export const CelebrationPage: React.FC<CelebrationPageProps> = ({
  celebration,
  onBackToHome,
  onCreateNew,
}) => {
  const [isOpenSurprise, setIsOpenSurprise] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [blownCandle, setBlownCandle] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { showToast } = useToast();
  const template =
    TEMPLATES.find((t) => t.id === celebration.templateId) || TEMPLATES[0];
  useEffect(() => {
    return () => {
      musicSynth.stop();
    };
  }, []);
  const fullUrl = `${window.location.origin}/w/${celebration.slug}`;
  const handleOpenSurprise = () => {
    setIsOpenSurprise(true);
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
    if (celebration.musicTrack !== "silent") {
      musicSynth.playTrack(celebration.musicTrack);
      setIsPlayingMusic(true);
    }
  };
  const toggleMusic = () => {
    if (isPlayingMusic) {
      musicSynth.stop();
      setIsPlayingMusic(false);
    } else {
      musicSynth.playTrack(celebration.musicTrack);
      setIsPlayingMusic(true);
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    showToast("Link Copied! 📋", "Share this generated page link anywhere.");
  };
  const handleBlowCandle = () => {
    setBlownCandle(true);
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.4 } });
    showToast("Wish Granted! ✨", "Virtual candles blown out!");
  };
  const whatsappMessage = encodeURIComponent(
    `Hey ${celebration.recipientName}! I created a special celebration page for you on Wishora 🎉 Open your surprise here: ${fullUrl}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${template.gradient} text-white flex flex-col justify-between selection:bg-white/60 selection:text-[#4e220f]`}
    >
      {" "}
      {/* Top Floating Utility Bar */}{" "}
      <div className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10 px-4 py-3">
        {" "}
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {" "}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60/10 hover:bg-white/60/20 text-xs font-bold transition-colors"
          >
            {" "}
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Wishora Home</span>{" "}
          </button>{" "}
          {/* Music Toggle */}{" "}
          {isOpenSurprise && celebration.musicTrack !== "silent" && (
            <button
              onClick={toggleMusic}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[38px] ${isPlayingMusic ? "bg-[#9d6638] text-white shadow-md" : "bg-white/60/10 text-white/80"}`}
            >
              {" "}
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 animate-bounce" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}{" "}
              <span>{isPlayingMusic ? "Sound On" : "Play Music"}</span>{" "}
            </button>
          )}{" "}
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl bg-white/60 text-[#9d6638] font-bold text-xs shadow-md hover:bg-[#b0ba99] transition-all flex items-center gap-1 min-h-[38px]"
          >
            {" "}
            <Sparkles className="w-4 h-4 text-[#9d6638]" />{" "}
            <span>Create Wish Page</span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main Container */}{" "}
      <main className="max-w-3xl mx-auto w-full px-4 py-10 my-auto flex flex-col items-center justify-center">
        {" "}
        {!isOpenSurprise ? (
          /* UNOPENED STATE */ <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full text-center space-y-8 py-12"
          >
            {" "}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="w-28 h-28 rounded-3xl bg-white/60/20 backdrop-blur-xl flex items-center justify-center mx-auto border-2 border-white/40 shadow-2xl"
            >
              {" "}
              <Gift className="w-14 h-14 text-white" />{" "}
            </motion.div>{" "}
            <div className="space-y-3">
              {" "}
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-white/60/20 backdrop-blur-md border border-white/30 uppercase tracking-widest text-[#9d6638]">
                {" "}
                Special Surprise Delivery 🎁{" "}
              </span>{" "}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {" "}
                {celebration.recipientName}, You Have A Surprise!{" "}
              </h1>{" "}
              <p className="text-sm sm:text-base text-white/85 max-w-md mx-auto">
                {" "}
                Prepared with love by{" "}
                <span className="font-bold underline decoration-amber-300">
                  {celebration.senderName}
                </span>{" "}
              </p>{" "}
            </div>{" "}
            <button
              onClick={handleOpenSurprise}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-white/60 text-[#9d6638] hover:bg-[#b0ba99] font-black rounded-3xl text-base sm:text-lg shadow-2xl shadow-black/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto cursor-pointer"
            >
              {" "}
              <span>Tap To Open Surprise</span>{" "}
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#9d6638] animate-spin" />{" "}
            </button>{" "}
          </motion.div>
        ) : (
          /* OPENED CELEBRATION STAGE */ <AnimatePresence>
            {" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-8"
            >
              {" "}
              {/* Header Title */}{" "}
              <div className="text-center space-y-3">
                {" "}
                <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-white/60/20 backdrop-blur-md text-[#9d6638] border border-white/20">
                  {" "}
                  {celebration.templateTitle} 🎉{" "}
                </span>{" "}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  {" "}
                  Happy Celebration, {celebration.recipientName}!{" "}
                </h1>{" "}
                <p className="text-sm sm:text-base text-white/85">
                  {" "}
                  With warmest wishes from{" "}
                  <span className="font-bold underline">
                    {celebration.senderName}
                  </span>{" "}
                </p>{" "}
              </div>{" "}
              {/* Message Parchment Card */}{" "}
              <div className="p-6 sm:p-10 bg-white/60/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl space-y-4">
                <p className="text-lg sm:text-2xl leading-relaxed italic text-white font-serif text-center">
                  "{celebration.message}"
                </p>
                <div className="flex items-center justify-between text-xs text-[#9d6638] font-bold pt-2 border-t border-white/10">
                  <span>📅 {celebration.date}</span>
                  <span>— Forever Yours, {celebration.senderName}</span>
                </div>
              </div>

              {/* Custom Google Form Responses */}
              {celebration.customFields && celebration.customFields.length > 0 && (
                <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl space-y-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9d6638]">
                    <Sparkles className="w-4 h-4" />
                    <span>Custom Form Questions & Responses</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {celebration.customFields.map((field) => (
                      <div key={field.id} className="p-3.5 bg-black/20 rounded-2xl border border-white/10 space-y-1">
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                          {field.label}
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {field.value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Interactive Widget */}{" "}
              <div className="p-5 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 text-center space-y-3">
                {" "}
                <p className="text-xs font-bold uppercase tracking-wider text-[#9d6638]">
                  {" "}
                  Blow Candles & Make A Wish 🎂{" "}
                </p>{" "}
                {!blownCandle ? (
                  <button
                    onClick={handleBlowCandle}
                    className="px-6 py-3 bg-[#b0ba99] hover:bg-[#b0ba99] text-[#4e220f] font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    {" "}
                    <Flame className="w-5 h-5 text-red-600 animate-bounce" />{" "}
                    <span>Tap to Blow Candles!</span>{" "}
                  </button>
                ) : (
                  <div className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-2">
                    {" "}
                    <CheckCircle2 className="w-5 h-5" />{" "}
                    <span>Wish Granted! May your year be joyful! ✨</span>{" "}
                  </div>
                )}{" "}
              </div>{" "}
              {/* Memory Photos Gallery */}{" "}
              {celebration.photos && celebration.photos.length > 0 && (
                <div className="space-y-3">
                  {" "}
                  <h3 className="text-xs font-bold uppercase tracking-widest text-center text-white/80">
                    {" "}
                    Precious Photo Memories 📸{" "}
                  </h3>{" "}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {" "}
                    {celebration.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhoto(photo)}
                        className="aspect-square rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg hover:scale-105 transition-transform group relative focus:outline-none"
                      >
                        {" "}
                        <img
                          src={photo}
                          alt="Memory"
                          className="w-full h-full object-cover"
                        />{" "}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          {" "}
                          <Eye className="w-6 h-6 text-white" />{" "}
                        </div>{" "}
                      </button>
                    ))}{" "}
                  </div>{" "}
                </div>
              )}{" "}
              {/* Share & Actions Card */}{" "}
              <div className="p-6 bg-white/60/10 backdrop-blur-xl rounded-3xl border border-white/20 text-center space-y-4">
                {" "}
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#9d6638]">
                  {" "}
                  Share This Celebration Page{" "}
                </h4>{" "}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {" "}
                  <button
                    onClick={handleCopyLink}
                    className="py-3 px-4 bg-white/60/20 hover:bg-white/60/30 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    {" "}
                    <Copy className="w-4 h-4" /> <span>Copy Link</span>{" "}
                  </button>{" "}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    {" "}
                    <MessageCircle className="w-4 h-4" />{" "}
                    <span>WhatsApp</span>{" "}
                  </a>{" "}
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="py-3 px-4 bg-white/60 text-[#4e220f] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    {" "}
                    <QrCode className="w-4 h-4" />{" "}
                    <span>Show QR Code</span>{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </motion.div>{" "}
          </AnimatePresence>
        )}{" "}
      </main>{" "}
      {/* Footer Branding Banner */}{" "}
      <footer className="bg-black/40 backdrop-blur-md py-4 text-center text-xs text-white/60 border-t border-white/10">
        {" "}
        Wishora Digital Celebration • Make every moment unforgettable{" "}
      </footer>{" "}
      {/* QR Modal */}{" "}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={fullUrl}
        recipientName={celebration.recipientName}
      />{" "}
      {/* Image Lightbox */}{" "}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          {" "}
          <img
            src={selectedPhoto}
            alt="Full Memory"
            className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border-2 border-white/20"
          />{" "}
        </div>
      )}{" "}
    </div>
  );
};
