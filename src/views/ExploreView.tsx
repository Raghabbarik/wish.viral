import React, { useState } from "react";
import { Template, CategoryId } from "../types";
import { TemplateGrid } from "../components/templates/TemplateGrid";
import { Sparkles, Plus, X, Trash2, Lock } from "lucide-react";
import { saveTemplate } from "../admin/services/adminService";

interface ExploreViewProps {
  templates: Template[];
  onViewDemo: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
  selectedCategory?: CategoryId | "all";
  onCategoryChange?: (category: CategoryId | "all") => void;
  onCreateSurpriseChallenge?: () => void;
}
export const ExploreView: React.FC<ExploreViewProps> = ({
  templates,
  onViewDemo,
  onUseTemplate,
  selectedCategory = "all",
  onCategoryChange,
  onCreateSurpriseChallenge,
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    title: "",
    category: "Birthday",
    description: "",
    isPremium: false,
    previewImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    themeColor: "purple",
    gradient: "from-purple-600 to-pink-500",
    bgPattern: "confetti",
    musicTrack: "birthday",
    sampleRecipient: "Friend",
    sampleSender: "Well Wisher",
    sampleMessage: "Wishing you a wonderful day!",
    samplePhotos: [],
    features: [],
    customFields: [],
  });
  const [saving, setSaving] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTemplate({});
  };

  const handleAddCustomField = () => {
    const newField = {
      id: "f-" + Date.now(),
      label: "New Question",
      value: "",
      fieldType: "question" as const,
    };
    setNewTemplate((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
  };
  const handleUpdateCustomField = (id: string, key: keyof typeof newTemplate.customFields[0], val: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).map((f) =>
        f.id === id ? { ...f, [key]: val } : f
      ),
    }));
  };
  const handleRemoveCustomField = (id: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((f) => f.id !== id),
    }));
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.title) return;
    setSaving(true);
    try {
      await saveTemplate({
        ...newTemplate,
        title: newTemplate.title!,
        category: newTemplate.category || "Birthday",
      } as any);
      setIsModalOpen(false);
      // Optionally refresh templates elsewhere; Firestore listeners will update UI automatically
    } catch (err) {
      console.error("Error saving template", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b0ba99] border border-[#b0ba99] text-[#9d6638] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#9d6638]" />
          <span>Marketplace & Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#4e220f] tracking-tight">Explore Celebration Templates</h1>
        <p className="text-sm sm:text-base text-[#4e220f]">
          Find the perfect ready-made template for birthdays, anniversaries, weddings, festivals, and special achievements.
        </p>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow transition-colors mx-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Template</span>
        </button>
      </div>

      {/* Filterable Grid */}
      <TemplateGrid
        templates={templates}
        onViewDemo={onViewDemo}
        onUseTemplate={onUseTemplate}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        showFilters={true}
      />

      {/* Unlock the Surprise Feature Card */}
      {onCreateSurpriseChallenge && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a2e] via-[#1e0f3a] to-[#0f0a1e] border border-violet-500/20 p-8 flex flex-col md:flex-row items-center gap-6">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-pink-600/15 blur-3xl pointer-events-none" />

          <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/40">
            <Lock className="w-10 h-10 text-white" />
          </div>

          <div className="relative flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold mb-3">
              <Sparkles className="w-3 h-3" /> New Feature
            </div>
            <h2 className="text-2xl font-black text-white mb-2">🔐 Unlock the Surprise</h2>
            <p className="text-white/60 text-sm max-w-md">
              Create an interactive quiz challenge for your friend, partner, or family. They must answer your questions
              correctly to unlock a hidden final surprise — message, photo, video, music, or gallery.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {["Quiz Challenge", "Surprise Reveal", "Shareable Link", "Confetti Animation"].map(f => (
                <span key={f} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">{f}</span>
              ))}
            </div>
          </div>

          <button
            onClick={onCreateSurpriseChallenge}
            className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-violet-500/30 transition-all hover:scale-105 whitespace-nowrap"
          >
            <Lock className="w-4 h-4" /> Create a Challenge
          </button>
        </div>
      )}

      {/* Modal for creating a template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold">Create New Template</h2>
              <button onClick={handleCloseModal} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTemplate.title || ""}
                    onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                    placeholder="e.g. Birthday Surprise Box"
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Category</label>
                  <select
                    value={newTemplate.category || "Birthday"}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Valentine">Valentine</option>
                    <option value="Farewell">Farewell</option>
                    <option value="Baby">Baby</option>
                    <option value="Festival">Festival</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTemplate.description || ""}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Brief description of the template..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!newTemplate.isPremium}
                    onChange={(e) => setNewTemplate({ ...newTemplate, isPremium: e.target.checked })}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-0 bg-[#0f0f14] border-white/20"
                  />
                  Premium Only
                </label>
              </div>

              {/* Custom Form Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white/80">Custom Form Fields</h3>
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-xs rounded-lg"
                  >
                    <Plus className="w-3 h-3" /> Add Field
                  </button>
                </div>
                {newTemplate.customFields && newTemplate.customFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center bg-white/5 p-3 rounded-xl">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                      placeholder="Field label"
                      className="col-span-2 px-2 py-1 rounded bg-[#0f0f14] border border-white/10 text-sm text-white"
                    />
                    <select
                      value={field.fieldType}
                      onChange={(e) => handleUpdateCustomField(field.id, "fieldType", e.target.value as any)}
                      className="px-2 py-1 rounded bg-[#0f0f14] border border-white/10 text-sm text-white"
                    >
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="header">Header</option>
                      <option value="question">Question</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(field.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
