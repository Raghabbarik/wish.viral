import React, { useEffect, useState } from "react";
import { Search, Eye, Trash2, ExternalLink } from "lucide-react";
import { listenToCelebrations, updateCelebrationStatus, deleteCelebration, AdminCelebration } from "../services/adminService";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  Delivered: "bg-sky-500/15 text-sky-400",
  Scheduled: "bg-amber-500/15 text-amber-400",
};

const categoryEmojis: Record<string, string> = {
  Birthday: "??", Anniversary: "??", Graduation: "??", Wedding: "??",
  Valentine: "??", Farewell: "??", "Thank You": "??", Achievement: "??",
};

export default function CelebrationsPage() {
  const [celebrations, setCelebrations] = useState<AdminCelebration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const unsub = listenToCelebrations((data) => {
      setCelebrations(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const categories = Array.from(new Set(celebrations.map(c => c.category).filter(Boolean)));

  const filtered = celebrations.filter(c => {
    const matchSearch =
      (c.recipientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.senderName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.templateTitle || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchCat = categoryFilter === "all" || c.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Delete this celebration from Firestore?")) {
      try {
        await deleteCelebration(id);
      } catch (err) {
        console.error("Error deleting celebration:", err);
      }
    }
  };

  const handleStatusChange = async (id: string, nextStatus: AdminCelebration["status"]) => {
    try {
      await updateCelebrationStatus(id, nextStatus);
    } catch (err) {
      console.error("Error updating celebration status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalViews = celebrations.reduce((s, c) => s + (c.viewsCount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Celebrations</h1>
          <p className="text-white/40 text-sm mt-0.5">Real-time user created celebration wish pages</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/60 font-semibold">{celebrations.length} total</span>
          <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 font-semibold">
            <Eye className="w-3 h-3 inline mr-1" />{totalViews.toLocaleString()} views
          </span>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", count: celebrations.filter(c => c.status === "Active").length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Delivered", count: celebrations.filter(c => c.status === "Delivered").length, color: "text-sky-400", bg: "bg-sky-500/10" },
          { label: "Scheduled", count: celebrations.filter(c => c.status === "Scheduled").length, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-white/5 ${s.bg} bg-[#1a1a24] p-4 flex items-center gap-3`}>
            <div>
              <p className="text-2xl font-bold text-white">{s.count}</p>
              <p className={`text-xs font-semibold ${s.color}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by recipient, sender or template..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white/70 focus:outline-none">
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Delivered">Delivered</option>
          <option value="Scheduled">Scheduled</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white/70 focus:outline-none">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-[#1a1a24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Template", "Recipient", "Sender", "Category", "Date", "Views", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-white/30 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? "bg-white/[0.01]" : ""}`}>
                  <td className="px-5 py-3.5 text-sm font-semibold text-white">{c.templateTitle}</td>
                  <td className="px-5 py-3.5 text-sm text-white/70">{c.recipientName}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm text-white/70">{c.senderName}</p>
                      <p className="text-[11px] text-white/30">{c.senderEmail || "N/A"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/50">
                    {categoryEmojis[c.category] ?? "?"} {c.category}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/40">{c.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-white/50 font-semibold">
                      <Eye className="w-3 h-3" /> {c.viewsCount || 0}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={c.status}
                      onChange={e => handleStatusChange(c.id, e.target.value as AdminCelebration["status"])}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border-0 cursor-pointer focus:outline-none ${statusColors[c.status]} bg-[#0f0f14]/50`}
                    >
                      <option value="Active">Active</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/w/${c.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors"
                        title="View celebration"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-white/30 text-sm">No celebrations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 text-xs text-white/30">
          Showing {filtered.length} of {celebrations.length} celebrations
        </div>
      </div>
    </div>
  );
}
