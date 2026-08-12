import React, { useEffect, useState } from "react";
import { Users, Gift, Layers, TrendingUp, ArrowUpRight, Star, Eye, Database, RefreshCw } from "lucide-react";
import { listenToUsers, listenToCelebrations, listenToTemplates, forceSeedDatabase, AdminUser, AdminCelebration, AdminTemplate } from "../services/adminService";

function StatCard({ title, value, sub, icon: Icon, color, trend }: {
  title: string; value: string | number; sub: string;
  icon: React.ElementType; color: string; trend?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a24] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/40 mt-1">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{trend} this week</span>
        </div>
      )}
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>{label}</span>
        <span className="font-semibold text-white">{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [celebrations, setCelebrations] = useState<AdminCelebration[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let usersLoaded = false;
    let celebrationsLoaded = false;
    let templatesLoaded = false;

    const checkLoading = () => {
      if (usersLoaded && celebrationsLoaded && templatesLoaded) {
        setLoading(false);
      }
    };

    const unsubUsers = listenToUsers((data) => {
      setUsers(data);
      usersLoaded = true;
      checkLoading();
    });

    const unsubCelebrations = listenToCelebrations((data) => {
      setCelebrations(data);
      celebrationsLoaded = true;
      checkLoading();
    });

    const unsubTemplates = listenToTemplates((data) => {
      setTemplates(data);
      templatesLoaded = true;
      checkLoading();
    });

    return () => {
      unsubUsers();
      unsubCelebrations();
      unsubTemplates();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-white/40 text-sm">Loading live metrics...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics from real-time data
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalCelebrations = celebrations.length;
  const totalTemplates = templates.length;

  // Calculate total revenue from templates
  const totalRevenue = templates.reduce((sum, t) => sum + (t.revenue || 0), 0);

  // Group celebrations by category for breakdown
  const categoryCounts: Record<string, number> = {};
  celebrations.forEach(c => {
    const cat = c.category || "Other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const maxCategoryCount = categoryBreakdown[0]?.count ?? 1;

  // Get recent 5 celebrations
  const recentCelebrations = [...celebrations]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  // Simple daily chart data based on mock or generated celebrations
  // We can group calculations by the last 7 dates
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const dailyStats = last7Days.map(date => {
    const dayCelebrations = celebrations.filter(c => c.createdAt === date).length;
    // Estimate daily revenue
    const dayRevenue = dayCelebrations * 14; 
    const label = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return { date: label, celebrations: dayCelebrations, revenue: dayRevenue };
  });

  const [seedingState, setSeedingState] = useState<string | null>(null);

  const handleForceSeed = async () => {
    setSeedingState("Pushing data to Firestore...");
    try {
      await forceSeedDatabase();
      setSeedingState("Success! Database populated. Refresh Firebase Console!");
      setTimeout(() => setSeedingState(null), 5000);
    } catch (err: any) {
      console.error("Firestore push error:", err);
      setSeedingState(`Error: ${err?.message || "Check Firestore Security Rules!"}`);
      setTimeout(() => setSeedingState(null), 7000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-white/40 text-sm mt-0.5">Real-time platform status and overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleForceSeed}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <Database className="w-4 h-4" />
            <span>Push Data to Firestore</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Connection
          </div>
        </div>
      </div>

      {seedingState && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold border ${
          seedingState.startsWith("Success")
            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
            : seedingState.startsWith("Error")
            ? "bg-red-500/15 border-red-500/30 text-red-300"
            : "bg-violet-500/15 border-violet-500/30 text-violet-300 animate-pulse"
        }`}>
          {seedingState}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers.toLocaleString()} sub={`${activeUsers} active accounts`} icon={Users} color="bg-violet-500/20" trend="+12%" />
        <StatCard title="Celebrations" value={totalCelebrations.toLocaleString()} sub="Created links" icon={Gift} color="bg-pink-500/20" trend="+8%" />
        <StatCard title="Templates" value={totalTemplates} sub="Library templates" icon={Layers} color="bg-amber-500/20" />
        <StatCard title="Estimated Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="From premium templates" icon={TrendingUp} color="bg-emerald-500/20" trend="+18%" />
      </div>

      {/* Mid grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity chart (simple bar) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#1a1a24] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-white">Celebrations This Week</p>
              <p className="text-xs text-white/40">Real-time daily creation log</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />Celebrations
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ml-2" />Revenue
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {dailyStats.map((d, i) => {
              const maxC = Math.max(...dailyStats.map(x => x.celebrations), 1);
              const maxR = Math.max(...dailyStats.map(x => x.revenue), 1);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 h-28 justify-center">
                    <div
                      className="flex-1 rounded-t-md bg-violet-500/60 hover:bg-violet-500 transition-all cursor-default"
                      style={{ height: `${(d.celebrations / maxC) * 100}%` }}
                      title={`${d.celebrations} celebrations`}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-emerald-500/60 hover:bg-emerald-500 transition-all cursor-default"
                      style={{ height: `${(d.revenue / maxR) * 100}%` }}
                      title={`$${d.revenue} revenue`}
                    />
                  </div>
                  <span className="text-[10px] text-white/30">{d.date.replace("Aug ", "")}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-white/5 bg-[#1a1a24] p-5">
          <p className="text-sm font-semibold text-white mb-1">Top Categories</p>
          <p className="text-xs text-white/40 mb-4">By live wishes</p>
          <div className="space-y-3">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((c, i) => {
                const colors = ["bg-violet-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500"];
                return (
                  <MiniBar key={c.category} label={c.category} value={c.count} max={maxCategoryCount} color={colors[i % colors.length]} />
                );
              })
            ) : (
              <p className="text-xs text-white/30 py-8 text-center">No calculations found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent celebrations */}
      <div className="rounded-2xl border border-white/5 bg-[#1a1a24] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Recent Celebrations</p>
          <span className="text-xs text-white/40">Latest live entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                {["Template", "Recipient", "Sender", "Date", "Views", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-white/30 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCelebrations.length > 0 ? (
                recentCelebrations.map((c, i) => (
                  <tr key={c.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                    <td className="px-5 py-3.5 text-sm text-white font-medium">{c.templateTitle}</td>
                    <td className="px-5 py-3.5 text-sm text-white/70">{c.recipientName}</td>
                    <td className="px-5 py-3.5 text-sm text-white/50">{c.senderName}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{c.createdAt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Eye className="w-3 h-3" /> {c.viewsCount}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.status === "Active" ? "bg-emerald-500/15 text-emerald-400" :
                        c.status === "Delivered" ? "bg-sky-500/15 text-sky-400" :
                        "bg-amber-500/15 text-amber-400"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-white/30 text-sm">No celebrations found in Firestore.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
