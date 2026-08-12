import React, { useEffect, useState } from "react";
import { Search, Star, Lock, Unlock, Archive, ToggleRight, Eye, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { listenToTemplates, updateTemplatePremium, updateTemplateStatus, saveTemplate, deleteTemplate, AdminTemplate } from "../services/adminService";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  draft: "bg-amber-500/15 text-amber-400",
  archived: "bg-white/5 text-white/30",
};

const categoryEmojis: Record<string, string> = {
  Birthday: "??", Anniversary: "??", Graduation: "??", Wedding: "??",
  Valentine: "??", Farewell: "??", Baby: "??", Festival: "??",
  "Thank You": "??", Achievement: "??",
};

const CATEGORIES_LIST = [
  { id: "birthday", name: "Birthday" },
  { id: "anniversary", name: "Anniversary" },
  { id: "graduation", name: "Graduation" },
  { id: "wedding", name: "Wedding" },
  { id: "valentine", name: "Valentine" },
  { id: "farewell", name: "Farewell" },
  { id: "baby", name: "Baby" },
  { id: "festival", name: "Festival" },
  { id: "thankyou", name: "Thank You" },
  { id: "achievement", name: "Achievement" },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<AdminTemplate> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = listenToTemplates((data) => {
      setTemplates(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = templates.filter(t => {
    const titleMatch = (t.title || "").toLowerCase().includes(search.toLowerCase());
    const categoryMatch = (t.category || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return (titleMatch || categoryMatch) && matchStatus;
  });

  const togglePremium = async (id: string, currentVal: boolean) => {
    try {
      await updateTemplatePremium(id, !currentVal);
    } catch (err) {
      console.error("Error updating template premium:", err);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "active" ? "archived" : "active";
      await updateTemplateStatus(id, nextStatus);
    } catch (err) {
      console.error("Error updating template status:", err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTemplate({
      title: "",
      category: "Birthday",
      categoryName: "Birthday",
      description: "",
      isPremium: false,
      status: "active",
      previewImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      themeColor: "purple",
      gradient: "from-purple-600 to-pink-500",
      musicTrack: "birthday",
      sampleRecipient: "Sarah",
      sampleSender: "Friends",
      sampleMessage: "Wishing you a fantastic day filled with happiness!",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: AdminTemplate) => {
    setEditingTemplate({ ...t });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template from Firestore?")) {
      try {
        await deleteTemplate(id);
      } catch (err) {
        console.error("Error deleting template:", err);
      }
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.title) return;
    setSaving(true);
    try {
      await saveTemplate({
        ...editingTemplate,
        title: editingTemplate.title,
        category: editingTemplate.category || "Birthday",
      });
      setIsModalOpen(false);
      setEditingTemplate(null);
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Failed to save template to Firestore");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalRevenue = templates.reduce((sum, t) => sum + (t.revenue || 0), 0);
  const totalUsage = templates.reduce((sum, t) => sum + (t.useCount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Template Management</h1>
          <p className="text-white/40 text-sm mt-0.5">Add, edit, or remove celebration templates in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Template</span>
          </button>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/60 font-semibold">{totalUsage.toLocaleString()} uses</span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold">${totalRevenue.toLocaleString()} revenue</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search templates by title or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white/70 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-[#1a1a24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Template", "Category", "Usage", "Rating", "Revenue", "Status", "Premium", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-white/30 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? "bg-white/[0.01]" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={t.previewImage || "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80"} alt={t.title} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                      <div>
                        <p className="text-sm font-semibold text-white">{t.title}</p>
                        <p className="text-[11px] text-white/30">ID: {t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/60">
                      {categoryEmojis[t.category] ?? "?"} {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-white/70 font-semibold">
                      <Eye className="w-3.5 h-3.5 text-white/30" /> {(t.useCount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {t.rating || 4.8}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-emerald-400">
                    {(t.revenue || 0) > 0 ? `$${t.revenue?.toLocaleString()}` : <span className="text-white/20">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusColors[t.status || 'active']}`}>
                      {t.status || 'active'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => togglePremium(t.id, t.isPremium)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        t.isPremium ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25" : "bg-white/5 text-white/30 hover:bg-white/10"
                      }`}
                    >
                      {t.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {t.isPremium ? "Premium" : "Free"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(t)}
                        className="p-1.5 rounded-lg text-violet-400 hover:bg-violet-500/10 transition-colors"
                        title="Edit template"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStatus(t.id, t.status)}
                        className={`p-1.5 rounded-lg transition-colors ${t.status === "active" ? "text-amber-400 hover:bg-amber-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
                        title={t.status === "active" ? "Archive" : "Activate"}
                      >
                        {t.status === "active" ? <Archive className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-white/30 text-sm">No templates found matching search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 text-xs text-white/30">
          Showing {filtered.length} of {templates.length} templates
        </div>
      </div>

      {/* Add / Edit Template Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold">
                {editingTemplate.id ? "Edit Template" : "Add New Template"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingTemplate.title || ""}
                    onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    placeholder="e.g. Birthday Surprise Box"
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Category</label>
                  <select
                    value={editingTemplate.category || "Birthday"}
                    onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value, categoryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    {CATEGORIES_LIST.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTemplate.description || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  placeholder="Describe the card theme and visual effects..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Preview Image URL</label>
                  <input
                    type="text"
                    value={editingTemplate.previewImage || ""}
                    onChange={e => setEditingTemplate({ ...editingTemplate, previewImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Gradient Class</label>
                  <input
                    type="text"
                    value={editingTemplate.gradient || ""}
                    onChange={e => setEditingTemplate({ ...editingTemplate, gradient: e.target.value })}
                    placeholder="from-purple-600 via-pink-600 to-red-500"
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Status</label>
                  <select
                    value={editingTemplate.status || "active"}
                    onChange={e => setEditingTemplate({ ...editingTemplate, status: e.target.value as AdminTemplate["status"] })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Music Track</label>
                  <select
                    value={editingTemplate.musicTrack || "birthday"}
                    onChange={e => setEditingTemplate({ ...editingTemplate, musicTrack: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none"
                  >
                    <option value="birthday">Birthday Chimes</option>
                    <option value="romantic">Romantic Piano</option>
                    <option value="upbeat">Upbeat Pop</option>
                    <option value="lofi">Ambient Lofi</option>
                    <option value="silent">Silent / Mute</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                    <input
                      type="checkbox"
                      checked={!!editingTemplate.isPremium}
                      onChange={e => setEditingTemplate({ ...editingTemplate, isPremium: e.target.checked })}
                      className="w-4 h-4 rounded text-violet-600 focus:ring-0 bg-[#0f0f14] border-white/20"
                    />
                    <span>Premium Only</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Sample Recipient</label>
                  <input
                    type="text"
                    value={editingTemplate.sampleRecipient || ""}
                    onChange={e => setEditingTemplate({ ...editingTemplate, sampleRecipient: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Sample Sender</label>
                  <input
                    type="text"
                    value={editingTemplate.sampleSender || ""}
                    onChange={e => setEditingTemplate({ ...editingTemplate, sampleSender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Sample Message</label>
                <textarea
                  rows={2}
                  value={editingTemplate.sampleMessage || ""}
                  onChange={e => setEditingTemplate({ ...editingTemplate, sampleMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
                >
                  {saving ? "Saving to Firestore..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
