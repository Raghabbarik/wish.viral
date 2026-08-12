import React, { useState, useEffect } from "react";
import { Template } from "../../types";
import { Modal } from "../common/Modal";
import { musicSynth } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Gift,
  Heart,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onUseTemplate: (template: Template) => void;
}
export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [isOpenSurprise, setIsOpenSurprise] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [blownCandle, setBlownCandle] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setIsOpenSurprise(false);
      setBlownCandle(false);
      setIsPlayingMusic(false);
      musicSynth.stop();
    } else {
      musicSynth.stop();
    }
  }, [isOpen, template]);
  if (!template) return null;
  const handleOpenSurprise = () => {
    setIsOpenSurprise(true);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    if (template.musicTrack !== "silent") {
      musicSynth.playTrack(template.musicTrack);
      setIsPlayingMusic(true);
    }
  };
  const toggleMusic = () => {
    if (isPlayingMusic) {
      musicSynth.stop();
      setIsPlayingMusic(false);
    } else {
      musicSynth.playTrack(template.musicTrack);
      setIsPlayingMusic(true);
    }
  };
  const handleBlowCandle = () => {
    setBlownCandle(true);
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 } });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="full">
      {" "}
      <div className="flex flex-col space-y-4">
        {" "}
        {/* Modal Header Controls */}{" "}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#b0ba99] ">
          {" "}
          <div>
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-xl font-black text-[#4e220f] ">
                {" "}
                {template.title}{" "}
              </span>{" "}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#b0ba99] text-[#9d6638] ">
                {" "}
                Live Demo{" "}
              </span>{" "}
            </div>{" "}
            <p className="text-xs text-[#4e220f] mt-0.5">
              {" "}
              Experience how {template.sampleRecipient} will see this
              celebration page.{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {" "}
            {/* Device Frame Switcher */}{" "}
            <div className="flex items-center p-1 bg-white/60/60 rounded-xl text-xs font-bold">
              {" "}
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-2 rounded-lg flex items-center gap-1.5 transition-all ${deviceMode === "mobile" ? "bg-white/60 text-[#4e220f] shadow-sm" : "text-[#4e220f] hover:text-[#4e220f]"}`}
                title="Mobile View"
              >
                {" "}
                <Smartphone className="w-4 h-4" />{" "}
                <span className="hidden sm:inline">Mobile</span>{" "}
              </button>{" "}
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-2 rounded-lg flex items-center gap-1.5 transition-all ${deviceMode === "desktop" ? "bg-white/60 text-[#4e220f] shadow-sm" : "text-[#4e220f] hover:text-[#4e220f]"}`}
                title="Desktop View"
              >
                {" "}
                <Monitor className="w-4 h-4" />{" "}
                <span className="hidden sm:inline">Desktop</span>{" "}
              </button>{" "}
            </div>{" "}
            {/* Music Toggle */}{" "}
            {template.musicTrack !== "silent" && isOpenSurprise && (
              <button
                onClick={toggleMusic}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${isPlayingMusic ? "bg-[#b0ba99] text-white border-[#b0ba99] shadow-sm" : "bg-white/60/60 text-[#4e220f] border-[#b0ba99] "}`}
                title={isPlayingMusic ? "Mute Music" : "Play Music"}
              >
                {" "}
                {isPlayingMusic ? (
                  <Volume2 className="w-4 h-4 animate-bounce" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}{" "}
                <span className="hidden sm:inline">
                  {isPlayingMusic ? "Music On" : "Play Sound"}
                </span>{" "}
              </button>
            )}{" "}
            {/* Use Template CTA */}{" "}
            <button
              onClick={() => {
                musicSynth.stop();
                onUseTemplate(template);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              {" "}
              <Sparkles className="w-4 h-4" />{" "}
              <span>Use This Template</span>{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Demo Stage Sandbox Container */}{" "}
        <div className="w-full flex justify-center items-center py-4 bg-white/60/60 rounded-3xl min-h-[520px] max-h-[680px] overflow-y-auto relative">
          {" "}
          <div
            className={`transition-all duration-300 w-full ${deviceMode === "mobile" ? "max-w-[380px] rounded-[40px] border-[10px] border-[#b0ba99] shadow-2xl overflow-hidden my-4" : "max-w-4xl rounded-2xl border border-[#b0ba99] shadow-2xl p-2"}`}
          >
            {" "}
            {/* Embedded Live Stage View */}{" "}
            <div
              className={`relative min-h-[500px] w-full bg-gradient-to-br ${template.gradient} text-white flex flex-col justify-between p-6 sm:p-8 rounded-3xl overflow-hidden`}
            >
              {" "}
              {!isOpenSurprise ? (
                /* Unopened Surprise Envelope / Gift Box Stage */ <div className="my-auto flex flex-col items-center justify-center text-center space-y-6 py-12">
                  {" "}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="w-24 h-24 rounded-3xl bg-white/60/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl"
                  >
                    {" "}
                    <Gift className="w-12 h-12 text-white" />{" "}
                  </motion.div>{" "}
                  <div>
                    {" "}
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/60/20 backdrop-blur-md border border-white/30 uppercase tracking-widest text-[#9d6638]">
                      {" "}
                      Surprise Gift Box 🎁{" "}
                    </span>{" "}
                    <h2 className="text-2xl sm:text-3xl font-black mt-3">
                      {" "}
                      {template.sampleRecipient}, You Have A Special
                      Surprise!{" "}
                    </h2>{" "}
                    <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-xs mx-auto">
                      {" "}
                      Sent with endless love from{" "}
                      <span className="font-bold underline">
                        {template.sampleSender}
                      </span>{" "}
                    </p>{" "}
                  </div>{" "}
                  <button
                    onClick={handleOpenSurprise}
                    className="px-8 py-4 bg-white/60 text-[#9d6638] hover:bg-[#b0ba99] font-black rounded-2xl text-base shadow-2xl shadow-black/40 hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    {" "}
                    <span>Open Surprise Now</span>{" "}
                    <Sparkles className="w-5 h-5 text-[#9d6638] group-hover:rotate-45 transition-transform" />{" "}
                  </button>{" "}
                </div>
              ) : (
                /* Opened Surprise Celebration View */ <AnimatePresence>
                  {" "}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 py-4"
                  >
                    {" "}
                    {/* Header Banner */}{" "}
                    <div className="text-center space-y-2">
                      {" "}
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/60/20 backdrop-blur-md text-[#9d6638] border border-white/20">
                        {" "}
                        {template.categoryName} Celebration 🎉{" "}
                      </span>{" "}
                      <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                        {" "}
                        Happy {template.categoryName},{" "}
                        {template.sampleRecipient}!{" "}
                      </h2>{" "}
                      <p className="text-xs sm:text-sm text-white/80">
                        {" "}
                        From{" "}
                        <span className="font-semibold">
                          {template.sampleSender}
                        </span>{" "}
                      </p>{" "}
                    </div>{" "}
                    {/* Personal Letter Parchment */}{" "}
                    <div className="p-5 sm:p-6 bg-white/60/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl space-y-3">
                      {" "}
                      <p className="text-sm sm:text-base leading-relaxed italic text-white/95 font-serif">
                        {" "}
                        "{template.sampleMessage}"{" "}
                      </p>{" "}
                      <p className="text-right text-xs font-bold text-[#9d6638]">
                        {" "}
                        — With warm love, {template.sampleSender}{" "}
                      </p>{" "}
                    </div>{" "}
                    {/* Interactive Feature Widget (e.g. Candle blow or Heart shower) */}{" "}
                    {template.category === "birthday" && (
                      <div className="p-4 bg-black/20 rounded-2xl border border-white/10 text-center space-y-2">
                        {" "}
                        <p className="text-xs font-bold uppercase tracking-wider text-[#9d6638]">
                          {" "}
                          Interactive Birthday Wish 🎂{" "}
                        </p>{" "}
                        {!blownCandle ? (
                          <button
                            onClick={handleBlowCandle}
                            className="px-4 py-2 bg-[#b0ba99] text-[#4e220f] font-extrabold text-xs rounded-xl shadow-md hover:bg-[#b0ba99] transition-all flex items-center gap-1.5 mx-auto"
                          >
                            {" "}
                            <Flame className="w-4 h-4 text-red-600 animate-bounce" />{" "}
                            <span>Tap to Blow Candle & Make a Wish!</span>{" "}
                          </button>
                        ) : (
                          <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                            {" "}
                            <CheckCircle2 className="w-4 h-4" />{" "}
                            <span>
                              Wish granted! Candles blown out! ✨
                            </span>{" "}
                          </div>
                        )}{" "}
                      </div>
                    )}{" "}
                    {/* Photo Memories Stack */}{" "}
                    <div className="space-y-2">
                      {" "}
                      <p className="text-xs font-bold uppercase tracking-wider text-white/70 text-center">
                        {" "}
                        Captured Memories 📸{" "}
                      </p>{" "}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {" "}
                        {template.samplePhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-2xl overflow-hidden border-2 border-white/30 shadow-md group relative"
                          >
                            {" "}
                            <img
                              src={photo}
                              alt="Memory"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />{" "}
                          </div>
                        ))}{" "}
                      </div>{" "}
                    </div>{" "}
                    {/* Footer Branding */}{" "}
                    <div className="text-center pt-4 border-t border-white/10 text-[11px] text-white/60">
                      {" "}
                      Created with Wishora • Share magical digital wishes{" "}
                    </div>{" "}
                  </motion.div>{" "}
                </AnimatePresence>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </Modal>
  );
};
