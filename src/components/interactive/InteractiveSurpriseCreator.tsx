import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle,
  Copy,
  ImageIcon,
  Music,
  Video,
  MessageSquare,
  LayoutGrid,
  GripVertical,
  Upload,
} from "lucide-react";
import type {
  InteractiveTemplate,
  InteractiveQuestion,
  InteractiveOption,
  FinalSurprise,
  QuestionType,
  CategoryId,
} from "../../types";
import { saveInteractiveTemplate, createInteractiveInstance } from "../../admin/services/adminService";
import { useAuth } from "../../lib/AuthContext";

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = ["Setup", "Questions", "Surprise", "Preview & Share"] as const;
type Step = typeof STEPS[number];

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

const SURPRISE_TYPES: { type: FinalSurprise["type"]; label: string; icon: React.ElementType; desc: string }[] = [
  { type: "text", label: "Message", icon: MessageSquare, desc: "A heartfelt personal message" },
  { type: "photo", label: "Photo", icon: ImageIcon, desc: "A special photo or image URL" },
  { type: "gallery", label: "Gallery", icon: LayoutGrid, desc: "Multiple photos together" },
  { type: "video", label: "Video", icon: Video, desc: "A video link (YouTube, etc.)" },
  { type: "music", label: "Music", icon: Music, desc: "An audio file or song link" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
              i < current
                ? "bg-violet-500 text-white"
                : i === current
                ? "bg-violet-600 text-white ring-2 ring-violet-500/40"
                : "bg-white/5 text-white/30"
            }`}
          >
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px ${i < current ? "bg-violet-500" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const QuestionCard: React.FC<{
  q: InteractiveQuestion;
  idx: number;
  onChange: (updated: InteractiveQuestion) => void;
  onDelete: () => void;
}> = ({ q, idx, onChange, onDelete }) => {
  const updateOption = (optId: string, label: string) => {
    onChange({ ...q, options: q.options.map((o) => (o.id === optId ? { ...o, label } : o)) });
  };
  const addOption = () => {
    if (q.options.length >= 5) return;
    onChange({ ...q, options: [...q.options, { id: uid(), label: "" }] });
  };
  const removeOption = (optId: string) => {
    if (q.options.length <= 2) return;
    onChange({ ...q, options: q.options.filter((o) => o.id !== optId) });
  };

  return (
    <motion.div
      layout
      className="bg-[#1a1a24] border border-white/8 rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-3">
          <input
            className="w-full bg-transparent border-b border-white/10 pb-1 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Type your question here..."
            value={q.prompt}
            onChange={(e) => onChange({ ...q, prompt: e.target.value })}
          />

          {/* Type toggle */}
          <div className="flex gap-2">
            {(["multiple", "truefalse"] as QuestionType[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  if (t === "truefalse") {
                    onChange({
                      ...q,
                      type: t,
                      options: [
                        { id: "tf-true", label: "True ✅" },
                        { id: "tf-false", label: "False ❌" },
                      ],
                      correctOptionId: "tf-true",
                    });
                  } else {
                    onChange({ ...q, type: t });
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  q.type === t
                    ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                    : "bg-white/5 border border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {t === "multiple" ? "Multiple Choice" : "True / False"}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctOptionId === opt.id}
                  onChange={() => onChange({ ...q, correctOptionId: opt.id })}
                  className="accent-violet-500 w-4 h-4 flex-shrink-0"
                />
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                  placeholder={`Option ${q.options.indexOf(opt) + 1}`}
                  value={opt.label}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  readOnly={q.type === "truefalse"}
                />
                {q.type === "multiple" && q.options.length > 2 && (
                  <button onClick={() => removeOption(opt.id)} className="text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {q.type === "multiple" && q.options.length < 5 && (
            <button
              onClick={addOption}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add option
            </button>
          )}

          {/* Hint */}
          <input
            className="w-full bg-transparent border-b border-white/5 pb-1 text-white/50 placeholder-white/20 text-xs focus:outline-none focus:border-amber-500/50 transition-colors"
            placeholder="Optional hint (shown if user asks)..."
            value={q.hint || ""}
            onChange={(e) => onChange({ ...q, hint: e.target.value })}
          />
        </div>
        <button onClick={onDelete} className="text-white/20 hover:text-red-400 transition-colors mt-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
interface Props {
  onClose?: () => void;
}

export default function InteractiveSurpriseCreator({ onClose }: Props) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);

  // Form state
  const [title, setTitle] = useState("My Surprise for You 🎁");
  const [category, setCategory] = useState<CategoryId>("birthday");
  const [allowHints, setAllowHints] = useState(true);
  const [questions, setQuestions] = useState<InteractiveQuestion[]>([
    {
      id: uid(),
      type: "multiple",
      prompt: "",
      options: [
        { id: uid(), label: "" },
        { id: uid(), label: "" },
        { id: uid(), label: "" },
      ],
      correctOptionId: "",
      order: 1,
    },
  ]);
  const [surpriseType, setSurpriseType] = useState<FinalSurprise["type"]>("text");
  const [surpriseContent, setSurpriseContent] = useState("");
  const [surpriseTitle, setSurpriseTitle] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(["", ""]);

  // Result state
  const [saving, setSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Validation ──
  const canGoNext = () => {
    if (step === 0) return title.trim().length > 0;
    if (step === 1)
      return (
        questions.length >= 1 &&
        questions.every(
          (q) =>
            q.prompt.trim() &&
            q.correctOptionId &&
            q.options.every((o) => o.label.trim())
        )
      );
    if (step === 2) {
      if (surpriseType === "gallery") return galleryUrls.filter((u) => u.trim()).length >= 2;
      return surpriseContent.trim().length > 0;
    }
    return true;
  };

  // ── Save & generate link ──
  const handlePublish = async () => {
    setSaving(true);
    try {
      const finalSurprise: FinalSurprise = {
        type: surpriseType,
        content: surpriseType === "gallery" ? galleryUrls.filter((u) => u.trim()) : surpriseContent,
        title: surpriseTitle || undefined,
      };

      const template: InteractiveTemplate = {
        id: `itpl-${uid()}`,
        title,
        description: `An interactive surprise created by ${currentUser?.displayName || "Someone special"}`,
        thumbnail: "",
        isPremium: false,
        category,
        questions: questions.map((q, i) => ({ ...q, order: i + 1 })),
        finalSurprise,
        settings: { attemptsMode: "unlimited", allowHints },
      };

      const saved = await saveInteractiveTemplate(template);
      const instance = await createInteractiveInstance(saved.id, currentUser?.uid || "anonymous");
      const link = `${window.location.origin}/unlock/${saved.id}`;
      setShareLink(link);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      {
        id: uid(),
        type: "multiple",
        prompt: "",
        options: [
          { id: uid(), label: "" },
          { id: uid(), label: "" },
          { id: uid(), label: "" },
        ],
        correctOptionId: "",
        order: qs.length + 1,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#0a0a10]/95 backdrop-blur-sm flex items-start justify-center py-8 px-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Unlock the Surprise</h1>
              <p className="text-xs text-white/40">Create an interactive challenge for someone special</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-lg leading-none transition-all"
            >
              ×
            </button>
          )}
        </div>

        <StepDots current={step} />

        <AnimatePresence mode="wait">
          {/* Step 0: Setup */}
          {step === 0 && (
            <motion.div key="setup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="bg-[#1a1a24] border border-white/8 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-2">Challenge Title</label>
                  <input
                    className="w-full bg-transparent border-b border-white/10 pb-2 text-white placeholder-white/30 text-lg font-semibold focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="e.g. Birthday Surprise for Rahul 🎂"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["birthday", "anniversary", "graduation", "wedding", "valentine", "festival"] as CategoryId[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                          category === cat
                            ? "bg-violet-500/20 border border-violet-500/50 text-violet-300"
                            : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">Allow Hints</p>
                    <p className="text-xs text-white/40">Let the receiver ask for a hint on each question</p>
                  </div>
                  <button
                    onClick={() => setAllowHints(!allowHints)}
                    className={`w-11 h-6 rounded-full transition-all relative ${allowHints ? "bg-violet-500" : "bg-white/10"}`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full absolute top-1"
                      animate={{ left: allowHints ? "calc(100% - 1.25rem)" : "0.25rem" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Questions */}
          {step === 1 && (
            <motion.div key="questions" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/60 text-sm">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-semibold text-white transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  idx={i}
                  onChange={(updated) =>
                    setQuestions((qs) => qs.map((x) => (x.id === updated.id ? updated : x)))
                  }
                  onDelete={() => {
                    if (questions.length > 1) setQuestions((qs) => qs.filter((x) => x.id !== q.id));
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Step 2: Surprise */}
          {step === 2 && (
            <motion.div key="surprise" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              <div className="bg-[#1a1a24] border border-white/8 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-3">Surprise Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SURPRISE_TYPES.map(({ type, label, icon: Icon, desc }) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSurpriseType(type);
                          if (type === "gallery" && galleryUrls.filter(u => u.trim()).length === 0) {
                            setGalleryUrls(["", ""]);
                          }
                        }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                          surpriseType === type
                            ? "border-violet-500/60 bg-violet-500/15"
                            : "border-white/8 bg-white/3 hover:border-white/20"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${surpriseType === type ? "text-violet-400" : "text-white/40"}`} />
                        <span className={`text-xs font-semibold ${surpriseType === type ? "text-violet-300" : "text-white/60"}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-2">Surprise Title (optional)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                    placeholder="e.g. A special surprise just for you..."
                    value={surpriseTitle}
                    onChange={(e) => setSurpriseTitle(e.target.value)}
                  />
                </div>

                {/* Text Message */}
                {surpriseType === "text" && (
                  <div>
                    <label className="text-xs text-white/50 font-medium uppercase tracking-wider block mb-2">Your Heartfelt Message</label>
                    <textarea
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 resize-none"
                      placeholder="Write your secret message here..."
                      value={surpriseContent}
                      onChange={(e) => setSurpriseContent(e.target.value)}
                    />
                  </div>
                )}

                {/* Single Photo */}
                {surpriseType === "photo" && (
                  <div className="space-y-4">
                    <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Upload Photo or Enter Web URL</label>
                    
                    {/* File Dropzone */}
                    <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-white/5 space-y-3 relative hover:border-violet-500/50 transition-all">
                      <Upload className="w-8 h-8 text-violet-400 mx-auto" />
                      <div>
                        <p className="text-sm font-semibold text-white">Choose a photo file from your device</p>
                        <p className="text-xs text-white/40">PNG, JPG, WebP or GIF</p>
                      </div>
                      <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all">
                        <span>Browse Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) setSurpriseContent(evt.target.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Or URL input */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 shrink-0">OR URL:</span>
                      <input
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                        placeholder="https://images.unsplash.com/..."
                        value={surpriseContent}
                        onChange={(e) => setSurpriseContent(e.target.value)}
                      />
                    </div>

                    {/* Image Preview */}
                    {surpriseContent && (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-60 bg-black/40">
                        <img src={surpriseContent} alt="Surprise Preview" className="w-full h-48 object-cover" />
                        <button
                          onClick={() => setSurpriseContent("")}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Photo Gallery */}
                {surpriseType === "gallery" && (
                  <div className="space-y-4">
                    <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Gallery Photos (At least 2 required)</label>
                    
                    {/* File Dropzone for Multiple Photos */}
                    <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-white/5 space-y-3 hover:border-violet-500/50 transition-all">
                      <Upload className="w-8 h-8 text-violet-400 mx-auto" />
                      <div>
                        <p className="text-sm font-semibold text-white">Select multiple photos from device</p>
                        <p className="text-xs text-white/40">Upload images to build your surprise photo memory grid</p>
                      </div>
                      <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all">
                        <span>Upload Photos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              (Array.from(files) as File[]).forEach((file: File) => {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  if (evt.target?.result) {
                                    setGalleryUrls((prev) => [...prev.filter((u) => u.trim()), evt.target!.result as string]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Previews / URL inputs */}
                    <div className="space-y-2">
                      <p className="text-xs text-white/40">Photo Items ({galleryUrls.filter(u => u.trim()).length}):</p>
                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                        {galleryUrls.map((url, i) => (
                          <div key={i} className="relative group border border-white/10 rounded-xl overflow-hidden bg-black/40 p-2 flex flex-col justify-between">
                            {url ? (
                              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover rounded-lg mb-2" />
                            ) : (
                              <div className="w-full h-24 bg-white/5 rounded-lg mb-2 flex items-center justify-center text-xs text-white/20">No Image</div>
                            )}
                            <div className="flex items-center gap-1">
                              <input
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white placeholder-white/20 focus:outline-none"
                                placeholder={`Photo ${i + 1} URL`}
                                value={url}
                                onChange={(e) => {
                                  const copy = [...galleryUrls];
                                  copy[i] = e.target.value;
                                  setGalleryUrls(copy);
                                }}
                              />
                              <button
                                onClick={() => setGalleryUrls(galleryUrls.filter((_, j) => j !== i))}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setGalleryUrls([...galleryUrls, ""])}
                        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add another photo URL
                      </button>
                    </div>
                  </div>
                )}

                {/* Video */}
                {surpriseType === "video" && (
                  <div className="space-y-4">
                    <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Upload Video File or Enter Video URL</label>
                    <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-white/5 space-y-3 hover:border-violet-500/50 transition-all">
                      <Video className="w-8 h-8 text-violet-400 mx-auto" />
                      <div>
                        <p className="text-sm font-semibold text-white">Choose a video file from your device</p>
                        <p className="text-xs text-white/40">MP4, WebM or MOV</p>
                      </div>
                      <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all">
                        <span>Browse Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) setSurpriseContent(evt.target.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 shrink-0">OR URL:</span>
                      <input
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                        placeholder="https://example.com/video.mp4"
                        value={surpriseContent}
                        onChange={(e) => setSurpriseContent(e.target.value)}
                      />
                    </div>

                    {surpriseContent && (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-2">
                        <video src={surpriseContent} controls className="w-full rounded-xl max-h-56" />
                        <button
                          onClick={() => setSurpriseContent("")}
                          className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove video
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Music */}
                {surpriseType === "music" && (
                  <div className="space-y-4">
                    <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Upload Music Track or Enter Audio URL</label>
                    <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-white/5 space-y-3 hover:border-violet-500/50 transition-all">
                      <Music className="w-8 h-8 text-violet-400 mx-auto" />
                      <div>
                        <p className="text-sm font-semibold text-white">Choose an audio file from your device</p>
                        <p className="text-xs text-white/40">MP3, WAV, OGG or AAC</p>
                      </div>
                      <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all">
                        <span>Browse Audio</span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) setSurpriseContent(evt.target.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 shrink-0">OR URL:</span>
                      <input
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                        placeholder="https://example.com/song.mp3"
                        value={surpriseContent}
                        onChange={(e) => setSurpriseContent(e.target.value)}
                      />
                    </div>

                    {surpriseContent && (
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
                        <p className="text-xs text-white/60">🎵 Audio Track Preview</p>
                        <audio src={surpriseContent} controls className="w-full" />
                        <button
                          onClick={() => setSurpriseContent("")}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove track
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Share */}
          {step === 3 && shareLink && (
            <motion.div key="share" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Your Challenge is Live! 🎉</h2>
                <p className="text-white/50 text-sm">Share this link with your special person</p>
              </div>
              <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <p className="flex-1 text-sm text-violet-300 text-left truncate font-mono">{shareLink}</p>
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                  <p className="text-xs text-white/40 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-white">{questions.length}</p>
                </div>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                  <p className="text-xs text-white/40 mb-1">Surprise Type</p>
                  <p className="text-sm font-bold text-white capitalize">{surpriseType}</p>
                </div>
              </div>
              {onClose && (
                <button onClick={onClose} className="text-white/40 text-sm hover:text-white/70 transition-colors">
                  Close & go back
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={saving || !canGoNext()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-violet-500/25"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                {saving ? "Publishing..." : "Publish & Get Link"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
