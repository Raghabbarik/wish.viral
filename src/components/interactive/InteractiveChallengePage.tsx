import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Lock, Unlock, ChevronRight, Lightbulb, RefreshCw, Home, Share2 } from "lucide-react";
import type { InteractiveTemplate, InteractiveQuestion, InteractiveOption } from "../../types";
import { getInteractiveTemplateById, saveInteractiveResponse } from "../../admin/services/adminService";

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f97316"];
  const pieces = Array.from({ length: 60 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.8;
        const dur = 1.5 + Math.random() * 1.5;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 8;
        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{ left: `${x}%`, top: "-20px", width: size, height: size, backgroundColor: color }}
            animate={{ y: "110vh", rotate: 720, opacity: [1, 1, 0] }}
            transition={{ duration: dur, delay, ease: "easeIn" }}
          />
        );
      })}
    </div>
  );
}

// ── Option Button ─────────────────────────────────────────────────────────────
const OptionBtn: React.FC<{
  option: InteractiveOption;
  selected: boolean;
  answered: boolean;
  isCorrect: boolean;
  onClick: () => void;
}> = ({ option, selected, answered, isCorrect, onClick }) => {
  const base = "w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 text-sm font-medium";
  let style = `${base} border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/50 text-white cursor-pointer`;
  if (answered && selected && isCorrect)
    style = `${base} border-emerald-500 bg-emerald-500/20 text-emerald-300 cursor-default`;
  if (answered && selected && !isCorrect)
    style = `${base} border-red-500 bg-red-500/20 text-red-300 cursor-default`;
  if (answered && !selected && isCorrect)
    style = `${base} border-emerald-500/50 bg-emerald-500/10 text-emerald-400 cursor-default`;
  if (answered && !selected && !isCorrect)
    style = `${base} border-white/5 bg-white/[0.02] text-white/30 cursor-default`;

  return (
    <motion.button
      className={style}
      onClick={!answered ? onClick : undefined}
      whileHover={!answered ? { scale: 1.02 } : {}}
      whileTap={!answered ? { scale: 0.98 } : {}}
    >
      <div className="flex items-center gap-3">
        {answered && selected && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
        {answered && selected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
        {answered && !selected && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0" />}
        <span>{option.label}</span>
      </div>
    </motion.button>
  );
}

// ── Surprise Reveal ───────────────────────────────────────────────────────────
function SurpriseReveal({ template, instanceId }: { template: InteractiveTemplate; instanceId: string }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const surprise = template.finalSurprise;

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] flex flex-col items-center justify-center p-6 text-center">
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Lock unlock animation */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/40"
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Unlock className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🎉 Surprise Unlocked!
        </motion.h1>
        <motion.p
          className="text-white/50 text-sm mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          You answered all questions correctly!
        </motion.p>

        {/* Surprise Content */}
        <motion.div
          className="bg-[#1a1a24] border border-white/10 rounded-3xl p-6 text-left shadow-2xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {surprise.title && (
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">{surprise.title}</p>
          )}

          {surprise.type === "text" && (
            <p className="text-white text-lg leading-relaxed font-medium">{surprise.content}</p>
          )}

          {surprise.type === "photo" && (
            <img
              src={surprise.content}
              alt="Surprise"
              className="w-full rounded-2xl object-cover max-h-80"
            />
          )}

          {surprise.type === "video" && (
            <video
              src={surprise.content}
              controls
              className="w-full rounded-2xl"
            />
          )}

          {surprise.type === "music" && (
            <div>
              <p className="text-white/60 text-sm mb-3">🎵 Your special song</p>
              <audio src={surprise.content} controls className="w-full" />
            </div>
          )}

          {surprise.type === "gallery" && Array.isArray(surprise.content) && (
            <div className="grid grid-cols-2 gap-2">
              {(surprise.content as string[]).map((url, i) => (
                <img key={i} src={url} alt={`Photo ${i + 1}`} className="rounded-xl object-cover w-full h-36" />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="flex gap-3 mt-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 transition-all"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm text-white transition-all"
          >
            <Home className="w-4 h-4" /> Create Yours
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Main Challenge Player ─────────────────────────────────────────────────────
interface Props {
  instanceId: string;
}

export default function InteractiveChallengePage({ instanceId }: Props) {
  const [template, setTemplate] = useState<InteractiveTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    getInteractiveTemplateById(instanceId)
      .then((t) => {
        if (!t) setError("Challenge not found. The link may be invalid or expired.");
        else {
          // Sort by order
          t.questions = [...t.questions].sort((a, b) => a.order - b.order);
          setTemplate(t);
        }
      })
      .catch(() => setError("Failed to load challenge. Please try again."))
      .finally(() => setLoading(false));
  }, [instanceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-white/40 text-sm">Loading your surprise...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center text-center p-6">
        <div>
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h1>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (completed) return <SurpriseReveal template={template} instanceId={instanceId} />;

  const questions = template.questions;
  const question = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const handleSelectOption = (optId: string) => {
    if (answered) return;
    setSelectedOptionId(optId);
    const correct = optId === question.correctOptionId;
    setIsCorrect(correct);
    setAnswered(true);

    // Save response to Firestore (best-effort)
    saveInteractiveResponse(instanceId, {
      questionId: question.id,
      selectedOptionId: optId,
      correct,
    }).catch(console.error);

    if (!correct) setWrongCount((n) => n + 1);
  };

  const handleNext = () => {
    if (!isCorrect) {
      // Wrong — reset for retry
      setSelectedOptionId(null);
      setAnswered(false);
      setShowHint(false);
      return;
    }
    // Correct — advance
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentIdx(nextIdx);
      setSelectedOptionId(null);
      setAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-white/40">Unlock the Surprise</p>
          <p className="text-sm font-semibold text-white truncate">{template.title}</p>
        </div>
        <div className="text-xs text-white/40">
          {currentIdx + 1} / {questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-5"
          >
            {/* Question number badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-full text-xs font-bold">
                Question {currentIdx + 1}
              </span>
              {template.settings.allowHints && question.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs hover:bg-amber-500/20 transition-all"
                >
                  <Lightbulb className="w-3 h-3" /> Hint
                </button>
              )}
            </div>

            {/* Prompt */}
            <h2 className="text-xl font-bold text-white leading-snug">{question.prompt}</h2>

            {/* Hint */}
            <AnimatePresence>
              {showHint && question.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-300 text-sm"
                >
                  💡 {question.hint}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt) => (
                <OptionBtn
                  key={opt.id}
                  option={opt}
                  selected={selectedOptionId === opt.id}
                  answered={answered}
                  isCorrect={opt.id === question.correctOptionId}
                  onClick={() => handleSelectOption(opt.id)}
                />
              ))}
            </div>

            {/* Feedback + Next */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-2xl p-4 flex items-center justify-between ${
                    isCorrect
                      ? "bg-emerald-500/15 border border-emerald-500/30"
                      : "bg-red-500/15 border border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <p className={`text-sm font-semibold ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                      {isCorrect ? "Correct! 🎉" : "Not quite! Try again 😅"}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isCorrect
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-red-500/30 hover:bg-red-500/50 text-red-200"
                    }`}
                  >
                    {isCorrect ? (
                      currentIdx + 1 >= questions.length ? (
                        <>Reveal Surprise <Unlock className="w-4 h-4" /></>
                      ) : (
                        <>Next <ChevronRight className="w-4 h-4" /></>
                      )
                    ) : (
                      <><RefreshCw className="w-3.5 h-3.5" /> Retry</>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Lock icon at bottom */}
        <div className="mt-8 flex items-center gap-2 text-white/20 text-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>
            {questions.length - currentIdx - 1 > 0
              ? `${questions.length - currentIdx - 1} question${questions.length - currentIdx - 1 > 1 ? "s" : ""} left to unlock`
              : answered && isCorrect
              ? "Surprise ready to unlock!"
              : "Last question — almost there!"}
          </span>
        </div>
      </div>
    </div>
  );
}
