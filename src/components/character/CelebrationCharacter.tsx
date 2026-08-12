import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export type CharacterState =
  | "idle"
  | "entering"
  | "walking"
  | "greeting"
  | "looking"
  | "typing"
  | "coveringEyes"
  | "confused"
  | "happy"
  | "celebrating"
  | "waving"
  | "farewell"
  | "birthday"
  | "anniversary"
  | "graduation"
  | "congratulations"
  | "wedding"
  | "festival";

interface CelebrationCharacterProps {
  state?: CharacterState;
  category?: string;
  speechText?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSpeechBubble?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const CelebrationCharacter: React.FC<CelebrationCharacterProps> = ({
  state = "idle",
  category,
  speechText,
  className = "",
  size = "md",
  showSpeechBubble = true,
  interactive = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: "w-28 h-36",
    md: "w-40 h-48",
    lg: "w-52 h-60",
    xl: "w-64 h-76",
  };

  const currentCategory = category || state;

  const renderCategoryProp = () => {
    switch (currentCategory) {
      case "birthday":
        return (
          <motion.g
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            transform="translate(112, 122)"
          >
            <rect x="-18" y="-4" width="36" height="20" rx="5" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            <rect x="-14" y="-12" width="28" height="10" rx="4" fill="#FFF1F2" />
            <path d="M-14 -2 Q-10 2 -6 -2 Q-2 2 2 -2 Q6 2 10 -2 Q14 2 14 -2" fill="none" stroke="#F472B6" strokeWidth="2" />
            <rect x="-2" y="-22" width="4" height="10" fill="#FBBF24" rx="1" />
            <motion.ellipse
              cx="0" cy="-25" rx="3" ry="5" fill="#EF4444"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          </motion.g>
        );

      case "anniversary":
      case "wedding":
        return (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: [0.9, 1.1, 1], y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            transform="translate(130, 85)"
          >
            <path
              d="M 0 -10 C 0 -22, -18 -26, -18 -10 C -18 4, 0 16, 0 16 C 0 16, 18 4, 18 -10 C 18 -26, 0 -26, 0 -10 Z"
              fill="#EC4899" stroke="#BE185D" strokeWidth="1.5"
            />
            <path d="M 0 16 L -10 45" stroke="#F472B6" strokeWidth="1.5" strokeDasharray="3 2" />
          </motion.g>
        );

      case "graduation":
        return (
          <motion.g
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <polygon points="90,26 55,36 90,46 125,36" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="74" y="38" width="32" height="10" fill="#0F172A" rx="2" />
            <path d="M 125 36 L 132 54" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="132" cy="56" r="3.5" fill="#F59E0B" />
          </motion.g>
        );

      case "congratulations":
      case "celebrating":
      case "happy":
        return (
          <motion.g
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ transformOrigin: "90px 38px" }}
          >
            <polygon points="90,16 76,42 104,42" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5" />
            <circle cx="90" cy="14" r="4.5" fill="#F59E0B" />
            <path d="M78 38 Q90 42 102 38" stroke="#EC4899" strokeWidth="2.5" fill="none" />
          </motion.g>
        );

      case "festival":
        return (
          <motion.g
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 1 }}
            transform="translate(132, 105)"
          >
            <line x1="0" y1="20" x2="-15" y2="-10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="-15" cy="-10" r="4" fill="#F59E0B" />
            <path d="M -15 -22 L -15 2 M -27 -10 L -3 -10 M -22 -17 L -8 -3 M -8 -17 L -22 -3" stroke="#F59E0B" strokeWidth="2" />
          </motion.g>
        );

      default:
        return null;
    }
  };

  const isCoveringEyes = state === "coveringEyes";
  const isLookingLeft = state === "typing" || state === "looking";
  const isConfused = state === "confused";
  const isHappy =
    state === "happy" ||
    state === "celebrating" ||
    state === "greeting" ||
    state === "waving";

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="mb-2 max-w-[220px] sm:max-w-[270px] bg-white/60 text-[#4e220f] text-xs font-semibold py-2.5 px-4 rounded-2xl border border-[#b0ba99] shadow-xl shadow-purple-500/10 text-center relative z-10"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9d6638] shrink-0 animate-pulse" />
              <span>{speechText}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Character */}
      <motion.div
        onClick={onClick}
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.96 } : undefined}
        className={`relative cursor-pointer transition-transform ${sizeClasses[size]}`}
      >
        <svg viewBox="0 0 180 220" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDDEC6" />
              <stop offset="100%" stopColor="#F9CBB0" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B2314" />
              <stop offset="100%" stopColor="#1E130B" />
            </linearGradient>
            <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <radialGradient id="humanBlush">
              <stop offset="0%" stopColor="#FB7185" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
            </radialGradient>
            <filter id="humanShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#475569" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="90" cy="206" rx="44" ry="7" fill="#000000" opacity="0.14" />

          {/* Body */}
          <motion.g
            filter="url(#humanShadow)"
            animate={
              state === "walking" || state === "entering"
                ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
                : state === "celebrating" || state === "happy"
                ? { y: [0, -10, 0] }
                : { y: [0, -3, 0] }
            }
            transition={{
              repeat: Infinity,
              duration: state === "celebrating" ? 0.6 : 2.5,
              ease: "easeInOut",
            }}
          >
            {/* Legs */}
            <g>
              <rect x="68" y="152" width="18" height="42" rx="6" fill="#334155" />
              <rect x="94" y="152" width="18" height="42" rx="6" fill="#334155" />
              <path d="M 64 190 Q 77 186 86 190 L 86 198 Q 74 200 64 198 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="64" y="194" width="22" height="4" rx="2" fill="#7C3AED" />
              <path d="M 94 190 Q 103 186 116 190 L 116 198 Q 106 200 94 198 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="94" y="194" width="22" height="4" rx="2" fill="#7C3AED" />
            </g>

            {/* Torso */}
            <g>
              <rect x="76" y="108" width="28" height="48" rx="4" fill="#FFFFFF" />
              <path
                d="M 54 112 C 54 100, 72 98, 90 98 C 108 98, 126 100, 126 112 L 122 154 C 122 156, 116 158, 90 158 C 64 158, 58 156, 58 154 Z"
                fill="url(#jacketGrad)"
              />
              <path d="M 78 100 L 78 158" stroke="#6D28D9" strokeWidth="1.5" />
              <path d="M 102 100 L 102 158" stroke="#6D28D9" strokeWidth="1.5" />
              <path d="M 90 114 L 90 158" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="72" cy="120" r="5" fill="#F472B6" />
              <path d="M 72 117 L 72 123 M 69 120 L 75 120" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>

            {/* Neck */}
            <rect x="83" y="88" width="14" height="14" rx="4" fill="url(#skinGrad)" />

            {/* Head */}
            <g>
              <circle cx="56" cy="70" r="6" fill="url(#skinGrad)" />
              <circle cx="124" cy="70" r="6" fill="url(#skinGrad)" />
              <ellipse cx="90" cy="68" rx="33" ry="35" fill="url(#skinGrad)" />
              <ellipse cx="70" cy="76" rx="8" ry="5" fill="url(#humanBlush)" />
              <ellipse cx="110" cy="76" rx="8" ry="5" fill="url(#humanBlush)" />
              <path d="M 88 71 C 88 74, 92 74, 92 71" stroke="#E2A78C" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Eyes & Eyebrows */}
              {!isCoveringEyes ? (
                <g>
                  <g stroke="#3B2314" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <path d={isConfused ? "M 66 52 Q 74 48 80 55" : isHappy ? "M 66 52 Q 74 46 82 52" : "M 66 54 Q 74 51 82 54"} />
                    <path d={isConfused ? "M 98 56 Q 106 52 114 54" : isHappy ? "M 98 52 Q 106 46 114 52" : "M 98 54 Q 106 51 114 54"} />
                  </g>
                  {/* Left Eye */}
                  <g transform="translate(72, 65)">
                    {isHappy ? (
                      <path d="M -8 2 Q 0 -6 8 2" stroke="#1E130B" strokeWidth="3" strokeLinecap="round" fill="none" />
                    ) : (
                      <g>
                        <ellipse cx="0" cy="0" rx="7" ry="8" fill="#FFFFFF" stroke="#1E130B" strokeWidth="1" />
                        <ellipse cx={isLookingLeft ? -3 : 0} cy="0" rx="4.5" ry="5.5" fill="#1E293B" />
                        <circle cx={isLookingLeft ? -4.5 : -1.5} cy="-2" r="2" fill="#FFFFFF" />
                      </g>
                    )}
                  </g>
                  {/* Right Eye */}
                  <g transform="translate(108, 65)">
                    {isHappy ? (
                      <path d="M -8 2 Q 0 -6 8 2" stroke="#1E130B" strokeWidth="3" strokeLinecap="round" fill="none" />
                    ) : (
                      <g>
                        <ellipse cx="0" cy="0" rx="7" ry="8" fill="#FFFFFF" stroke="#1E130B" strokeWidth="1" />
                        <ellipse cx={isLookingLeft ? -3 : 0} cy="0" rx="4.5" ry="5.5" fill="#1E293B" />
                        <circle cx={isLookingLeft ? -4.5 : -1.5} cy="-2" r="2" fill="#FFFFFF" />
                      </g>
                    )}
                  </g>
                </g>
              ) : (
                <g stroke="#3B2314" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 64 66 Q 72 72 80 66" />
                  <path d="M 100 66 Q 108 72 116 66" />
                </g>
              )}

              {/* Mouth */}
              <g transform="translate(90, 80)">
                {isConfused ? (
                  <path d="M -8 2 Q 0 -3 8 1" stroke="#3B2314" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : isHappy ? (
                  <g>
                    <path d="M -11 -2 Q 0 14 11 -2 Z" fill="#E11D48" />
                    <path d="M -9 -1 Q 0 4 9 -1 Z" fill="#FFFFFF" />
                  </g>
                ) : (
                  <path d="M -8 0 Q 0 7 8 0" stroke="#3B2314" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                )}
              </g>

              {/* Hair */}
              <g>
                <path
                  d="M 54 62 C 50 34, 72 20, 90 20 C 108 20, 130 34, 126 62 C 122 42, 108 28, 90 28 C 72 28, 58 42, 54 62 Z"
                  fill="url(#hairGrad)"
                />
                <path
                  d="M 54 54 Q 75 30 102 38 Q 118 42 126 54 C 114 42, 92 38, 70 42 C 62 45, 56 50, 54 54 Z"
                  fill="url(#hairGrad)"
                />
              </g>
            </g>

            {/* Category Props */}
            {renderCategoryProp()}

            {/* Arms */}
            {isCoveringEyes ? (
              <g>
                <path d="M 56 112 Q 52 82 68 68" stroke="#7C3AED" strokeWidth="12" strokeLinecap="round" fill="none" />
                <g transform="translate(68, 66)">
                  <ellipse cx="0" cy="0" rx="9" ry="8" fill="url(#skinGrad)" stroke="#E2A78C" strokeWidth="1" />
                  <path d="M -6 -4 L -6 -8 M -2 -5 L -2 -9 M 2 -5 L 2 -9 M 6 -4 L 6 -8" stroke="#E2A78C" strokeWidth="2" strokeLinecap="round" />
                </g>
                <path d="M 124 112 Q 128 82 112 68" stroke="#7C3AED" strokeWidth="12" strokeLinecap="round" fill="none" />
                <g transform="translate(112, 66)">
                  <ellipse cx="0" cy="0" rx="9" ry="8" fill="url(#skinGrad)" stroke="#E2A78C" strokeWidth="1" />
                  <path d="M -6 -4 L -6 -8 M -2 -5 L -2 -9 M 2 -5 L 2 -9 M 6 -4 L 6 -8" stroke="#E2A78C" strokeWidth="2" strokeLinecap="round" />
                </g>
              </g>
            ) : state === "waving" || state === "greeting" ? (
              <g>
                <path d="M 56 112 Q 46 130 50 144" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="146" r="6" fill="url(#skinGrad)" />
                <motion.g
                  animate={{ rotate: [0, 20, -10, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ transformOrigin: "124px 112px" }}
                >
                  <path d="M 124 112 Q 146 95 142 75" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none" />
                  <g transform="translate(142, 73)">
                    <circle cx="0" cy="0" r="7" fill="url(#skinGrad)" />
                    <path d="M -4 -6 L -4 -10 M -1 -7 L -1 -12 M 2 -7 L 2 -12 M 5 -5 L 6 -9" stroke="#E2A78C" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </motion.g>
              </g>
            ) : state === "celebrating" ? (
              <g>
                <motion.path
                  d="M 56 112 Q 36 90 40 70"
                  stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
                <circle cx="40" cy="68" r="6" fill="url(#skinGrad)" />
                <motion.path
                  d="M 124 112 Q 144 90 140 70"
                  stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
                <circle cx="140" cy="68" r="6" fill="url(#skinGrad)" />
              </g>
            ) : isConfused ? (
              <g>
                <path d="M 56 112 Q 46 130 50 144" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="146" r="6" fill="url(#skinGrad)" />
                <path d="M 124 112 Q 118 100 98 84" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none" />
                <circle cx="98" cy="84" r="6" fill="url(#skinGrad)" />
              </g>
            ) : (
              <g>
                <path d="M 56 112 Q 46 130 50 144" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="146" r="6" fill="url(#skinGrad)" />
                <path d="M 124 112 Q 134 130 130 144" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round" fill="none" />
                <circle cx="130" cy="146" r="6" fill="url(#skinGrad)" />
              </g>
            )}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
};
