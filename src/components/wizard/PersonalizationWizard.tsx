import React, { useState } from "react";
import {
  Template,
  PersonalizationFormState,
  CelebrationData,
  CustomField,
} from "../../types";
import { MUSIC_TRACKS } from "../../data/mockData";
import { musicSynth } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  User,
  Calendar,
  Sparkles,
  Upload,
  X,
  Music,
  Check,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Gift,
  Plus,
  Trash2,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useToast } from "../common/Toast";
import { useAuth } from "../../lib/AuthContext";
import { saveCelebration } from "../../lib/celebrations";
import {
  CelebrationCharacter,
  CharacterState,
} from "../character/CelebrationCharacter";
import { motion, AnimatePresence } from "motion/react";

interface PersonalizationWizardProps {
  template: Template;
  onBack: () => void;
  onGenerated: (celebration: CelebrationData) => void;
}

export const PersonalizationWizard: React.FC<PersonalizationWizardProps> = ({
  template,
  onBack,
  onGenerated,
}) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { showToast } = useToast();
  const [form, setForm] = useState<PersonalizationFormState>({
    templateId: template.id,
    recipientName: template.sampleRecipient,
    senderName: template.sampleSender,
    date: new Date().toISOString().split("T")[0],
    message: template.sampleMessage,
    photos: template.samplePhotos,
    musicTrack: template.musicTrack,
    animationStyle: template.bgPattern === "hearts" ? "hearts" : "confetti",
    themeColor: template.themeColor,
    customFields: template.defaultCustomFields || [
      { id: "f1", label: "Favorite Memory Together", value: "Our trip to the beach!", fieldType: "question" },
      { id: "f2", label: "Special Milestone Date", value: new Date().toISOString().split("T")[0], fieldType: "date" },
    ],
  });

  const handleAddCustomField = () => {
    const newField: CustomField = {
      id: "f-" + Date.now(),
      label: "Custom Question / Header",
      value: "",
      fieldType: "question",
    };
    setForm((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
  };

  const handleUpdateCustomField = (id: string, key: keyof CustomField, val: string) => {
    setForm((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).map((f) =>
        f.id === id ? ({ ...f, [key]: val } as CustomField) : f
      ),
    }));
  };

  const handleRemoveCustomField = (id: string) => {
    setForm((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((f) => f.id !== id),
    }));
  };
  const [previewPhotoInput, setPreviewPhotoInput] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<"box" | "unboxing" | "ready">("box");
  const [characterState, setCharacterState] = useState<CharacterState>(
    (template.category as CharacterState) || "greeting"
  );
  const [speechText, setSpeechText] = useState("Let's create something special together! 🎉");

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!form.recipientName.trim()) {
        showToast("Please enter recipient name", "Who is this celebration for?", "warning");
        return;
      }
      if (!form.message.trim()) {
        showToast("Please enter personal message", "Add a heartfelt wish message", "warning");
        return;
      }
    }
    const next = Math.min(currentStep + 1, 4);
    setCurrentStep(next);
    if (next === 2) {
      setCharacterState("happy");
      setSpeechText("Let's add some memories! 📸 Upload photos or pick presets.");
    } else if (next === 3) {
      setCharacterState("celebrating");
      setSpeechText("Pick tunes & particle magic to match the vibe 🎵");
    } else if (next === 4) {
      setCharacterState("happy");
      setSpeechText("Everything looks amazing! Ready to generate?");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setCurrentStep(prev);
    if (prev === 1) {
      setCharacterState((template.category as CharacterState) || "greeting");
      setSpeechText("Let's customize the receiver & message! ✍️");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm((prev) => ({
            ...prev,
            photos: [...prev.photos, event.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    setCharacterState("celebrating");
    setSpeechText("Great photo! Added to memories 📸");
    showToast("Photos added! 📸", "Added your uploaded photo memories.");
  };

  const handleAddPhotoUrl = () => {
    if (previewPhotoInput.trim()) {
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, previewPhotoInput.trim()],
      }));
      setPreviewPhotoInput("");
      setCharacterState("celebrating");
      setSpeechText("Memory added! 🖼️");
      showToast("Photo added! 🖼️", "URL photo memory saved.");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleGenerateAiWish = async () => {
    setIsAiGenerating(true);
    setCharacterState("looking");
    setSpeechText("Crafting a magical wish message... ✨");
    try {
      const response = await fetch("/api/wishes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: form.recipientName,
          senderName: form.senderName,
          category: template.categoryName,
        }),
      });
      const data = await response.json();
      setForm((prev) => ({ ...prev, message: data.wish }));
      setIsAiGenerating(false);
      setCharacterState("happy");
      setSpeechText("Heartfelt wish loaded! Feel free to tweak it ❤️");
      showToast("Wish Generated! ✨", "Inspirational wish loaded into message box.");
    } catch (err) {
      console.error(err);
      setIsAiGenerating(false);
      showToast("Error", "Failed to generate wish.", "warning");
    }
  };

  const handleFinalGenerate = () => {
    setIsGeneratingModalOpen(true);
    setGenerationPhase("box");

    setTimeout(() => {
      setGenerationPhase("unboxing");
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
    }, 1200);

    setTimeout(() => {
      setGenerationPhase("ready");
    }, 2400);

    setTimeout(async () => {
      const slug = `${form.recipientName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}-${template.category}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newCelebration: CelebrationData = {
        id: "wish-" + Date.now(),
        templateId: template.id,
        templateTitle: template.title,
        recipientName: form.recipientName,
        senderName: form.senderName || "A Well Wisher",
        date: form.date,
        message: form.message,
        photos: form.photos.length > 0 ? form.photos : template.samplePhotos,
        musicTrack: form.musicTrack,
        themeColor: form.themeColor,
        animationStyle: form.animationStyle,
        createdAt: new Date().toISOString().split("T")[0],
        viewsCount: 1,
        slug: slug,
        status: "Active",
        category: template.categoryName || (template.category.charAt(0).toUpperCase() + template.category.slice(1)),
        userId: currentUser?.uid || "guest",
        customFields: form.customFields,
      };

      try {
        await saveCelebration(newCelebration, currentUser?.uid || "guest");
      } catch (err) {
        console.error("Failed to save celebration to Firestore", err);
      }

      musicSynth.stop();
      setIsGeneratingModalOpen(false);
      onGenerated(newCelebration);
    }, 3400);
  };

  const steps = [
    { step: 1, label: "Details" },
    { step: 2, label: "Photos" },
    { step: 3, label: "Settings" },
    { step: 4, label: "Preview" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Full Screen Generation Overlay */}
      <AnimatePresence>
        {isGeneratingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#f7f1de]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full space-y-6">
              <motion.div
                animate={
                  generationPhase === "unboxing"
                    ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
                    : {}
                }
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <CelebrationCharacter
                  state={generationPhase === "unboxing" ? "celebrating" : "walking"}
                  category={template.category}
                  speechText={
                    generationPhase === "box"
                      ? "Preparing your celebration box... 🎁"
                      : generationPhase === "unboxing"
                      ? "Unboxing the magic & sparkles! ✨"
                      : "Your surprise is ready! 🎉"
                  }
                  size="xl"
                />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4e220f]">
                  {generationPhase === "ready" ? "Celebration Ready! 🎉" : "Creating Your Celebration..."}
                </h2>
                <p className="text-xs sm:text-sm text-[#9d6638]">
                  {generationPhase === "box"
                    ? "Setting up personalized themes and memories..."
                    : generationPhase === "unboxing"
                    ? "Adding sparkles, music & interactive effects..."
                    : "Generating your custom shareable link..."}
                </p>
              </div>

              <div className="w-full h-2 bg-[#b0ba99] rounded-full overflow-hidden border border-[#b0ba99]">
                <motion.div
                  className="h-full bg-[#9d6638]"
                  initial={{ width: "10%" }}
                  animate={
                    generationPhase === "box"
                      ? { width: "40%" }
                      : generationPhase === "unboxing"
                      ? { width: "80%" }
                      : { width: "100%" }
                  }
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#b0ba99]">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl border border-[#b0ba99] hover:bg-[#b0ba99]/30 text-[#4e220f] font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </button>
        <div className="text-right">
          <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">Personalizing</span>
          <h2 className="text-lg font-black text-[#4e220f]">{template.title}</h2>
        </div>
      </div>

      {/* Character Guidance */}
      <div className="mb-8 p-4 bg-[#b0ba99]/40 rounded-2xl border border-[#b0ba99] flex flex-col sm:flex-row items-center gap-4">
        <CelebrationCharacter
          state={characterState}
          category={template.category}
          speechText={speechText}
          size="sm"
        />
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-sm font-bold text-[#4e220f]">
            Wishy is guiding your {template.categoryName} surprise
          </h3>
          <p className="text-xs text-[#4e220f]/70">
            Fill in the details below. Wishy will customize the music, floating effects, and layout for you.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-10">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s) => {
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all mb-2 shadow-sm ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-[#9d6638] text-white ring-4 ring-[#b0ba99]"
                      : "bg-white/60 text-[#4e220f]"
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : s.step}
                </div>
                <span className={`text-xs font-bold ${isCurrent ? "text-[#9d6638]" : "text-[#4e220f]"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Details */}
      {currentStep === 1 && (
        <div className="bg-white/60 rounded-3xl p-6 sm:p-8 border border-[#b0ba99] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#4e220f]">1. Celebration Details</h3>
            <p className="text-xs text-[#4e220f]/70 mt-1">
              Who is this surprise for, and what message would you like to convey?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4e220f] mb-1.5">Receiver Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#4e220f] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={form.recipientName}
                  onFocus={() => {
                    setCharacterState("happy");
                    setSpeechText("Who is this special surprise for? Enter their name! 😊");
                  }}
                  onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                  placeholder="e.g. Sophia, Alex"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-sm focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4e220f] mb-1.5">Your Name / From</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#4e220f] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={form.senderName}
                  onFocus={() => {
                    setCharacterState("greeting");
                    setSpeechText("And who is sending this lovely surprise? ✨");
                  }}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  placeholder="e.g. Mom & Dad, The Squad"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-sm focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4e220f] mb-1.5">Celebration Date</label>
            <div className="relative max-w-xs">
              <Calendar className="w-4 h-4 text-[#4e220f] absolute left-3.5 top-3.5" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-sm focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#4e220f]">Personal Message *</label>
              <button
                type="button"
                onClick={handleGenerateAiWish}
                disabled={isAiGenerating}
                className="text-xs font-bold text-[#9d6638] flex items-center gap-1 bg-[#b0ba99]/40 px-2.5 py-1 rounded-lg border border-[#b0ba99] transition-colors hover:bg-[#b0ba99]/60"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isAiGenerating ? "animate-spin" : ""}`} />
                <span>{isAiGenerating ? "Inspiring..." : "Inspire Wish Ideas ✨"}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={form.message}
              onFocus={() => {
                setCharacterState("happy");
                setSpeechText("Now write something heartfelt from your heart ❤️");
              }}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your heartfelt message here..."
              maxLength={500}
              className="w-full p-4 rounded-2xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-sm focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40 resize-none"
            />
            <div className="flex justify-end text-[11px] text-[#4e220f]/50 mt-1">
              {form.message.length} / 500 characters
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Photos */}
      {currentStep === 2 && (
        <div className="bg-white/60 rounded-3xl p-6 sm:p-8 border border-[#b0ba99] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#4e220f]">2. Upload Photo Memories</h3>
            <p className="text-xs text-[#4e220f]/70 mt-1">
              Add favorite photo moments to make the celebration page shine.
            </p>
          </div>

          <div className="border-2 border-dashed border-[#b0ba99] rounded-3xl p-8 text-center bg-white/40 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#b0ba99]/40 text-[#9d6638] flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#4e220f]">Drag & drop photos or browse from device</p>
              <p className="text-xs text-[#4e220f]/60 mt-0.5">Supports PNG, JPG, WebP up to 10MB each</p>
            </div>
            <label className="inline-block px-5 py-2.5 bg-[#9d6638] hover:bg-[#4e220f] text-[#f7f1de] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors">
              <span>Select Photos</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={previewPhotoInput}
              onChange={(e) => setPreviewPhotoInput(e.target.value)}
              placeholder="Or paste an image web URL..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-sm focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
            />
            <button
              type="button"
              onClick={handleAddPhotoUrl}
              className="px-4 py-2.5 bg-[#9d6638] hover:bg-[#4e220f] text-[#f7f1de] font-bold text-xs rounded-2xl transition-colors shrink-0"
            >
              Add URL
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#4e220f] uppercase tracking-wider mb-3">
              Selected Memories ({form.photos.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-2xl overflow-hidden border border-[#b0ba99] shadow-sm bg-white/60"
                >
                  <img src={photo} alt={`Memory ${idx}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-[#b0ba99] text-white opacity-90 hover:opacity-100 shadow-md transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Settings & Music */}
      {currentStep === 3 && (
        <div className="bg-white/60 rounded-3xl p-6 sm:p-8 border border-[#b0ba99] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#4e220f]">3. Celebration Audio & Style</h3>
            <p className="text-xs text-[#4e220f]/70 mt-1">
              Select background tunes and floating particle animations.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4e220f] mb-2">Background Music Track</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MUSIC_TRACKS.map((track) => {
                const isSelected = form.musicTrack === track.id;
                return (
                  <button
                    type="button"
                    key={track.id}
                    onClick={() => {
                      setForm({ ...form, musicTrack: track.id });
                      if (track.id !== "silent") {
                        musicSynth.playTrack(track.id);
                        showToast("Audio Preview", `Playing ${track.name}`);
                      } else {
                        musicSynth.stop();
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-[#b0ba99]/40 border-[#9d6638] text-[#9d6638] font-bold shadow-sm"
                        : "border-[#b0ba99] hover:border-[#9d6638] text-[#4e220f]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? "bg-[#9d6638] text-white" : "bg-white/60 text-[#4e220f]"}`}>
                        <Music className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">{track.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#9d6638]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4e220f] mb-2">Particle Animation Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "confetti", label: "Party Confetti 🎉" },
                { id: "hearts", label: "Love Hearts 💕" },
                { id: "sparkles", label: "Golden Stars ✨" },
                { id: "balloons", label: "Sky Balloons 🎈" },
              ].map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setForm({ ...form, animationStyle: style.id as any })}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    form.animationStyle === style.id
                      ? "bg-[#9d6638] text-white border-[#9d6638] shadow-md"
                      : "border-[#b0ba99] text-[#4e220f] hover:border-[#9d6638]"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Generate */}
      {currentStep === 4 && (
        <div className="bg-white/60 rounded-3xl p-6 sm:p-8 border border-[#b0ba99] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#4e220f]">4. Final Celebration Preview</h3>
            <p className="text-xs text-[#4e220f]/70 mt-1">
              Review your personalized page before generating your shareable link.
            </p>
          </div>

          <div className={`p-8 rounded-3xl bg-gradient-to-br ${template.gradient} text-white shadow-2xl space-y-6 text-center`}>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto border border-white/30">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                Surprise Page Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Happy {template.categoryName}, {form.recipientName}!
              </h2>
              <p className="text-xs text-white/80 mt-1">From: {form.senderName || "Anonymous"}</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-sm italic font-serif max-w-lg mx-auto">
              "{form.message}"
            </div>
            {form.photos.length > 0 && (
              <div className="flex justify-center gap-2 overflow-x-auto py-2">
                {form.photos.slice(0, 4).map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="Photo"
                    className="w-16 h-16 object-cover rounded-xl border-2 border-white/40 shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6">
        {currentStep > 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={handlePrevStep}
            className="px-5 py-2.5 rounded-[1.5rem] border-2 border-[#b0ba99] text-[#4e220f] font-bold text-xs sm:text-sm hover:bg-[#b0ba99]/40 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </motion.button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={handleNextStep}
            className="px-6 py-3 rounded-[2rem] bg-[#9d6638] hover:bg-[#4e220f] text-[#f7f1de] font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={handleFinalGenerate}
            className="px-8 py-3.5 rounded-[2rem] bg-[#4e220f] hover:bg-[#9d6638] text-[#f7f1de] font-black text-sm shadow-xl flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[#b0ba99]" />
            <span>Generate Celebration Link 🎉</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
