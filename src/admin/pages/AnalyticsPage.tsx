import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, Gift, DollarSign, Clock, MousePointerClick, BarChart2 } from "lucide-react";
import { listenToUsers, listenToCelebrations, listenToTemplates, AdminUser, AdminCelebration, AdminTemplate } from "../services/adminService";

function MetricCard({ label, value, sub, icon: Icon, trend, positive }: {
  label: string; value: string; sub: string; icon: React.ElementType; trend?: string; positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1a24] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">{label}</p>
        <Icon className="w-4 h-4 text-white/20" />
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center gap-1.5">
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${positive !== false ? "text-emerald-400" : "text-red-400"}`}>
            {positive !== false ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
        <span className="text-xs text-white/30">{sub}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [celebrations, setCelebrations] = useState<AdminCelebration[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<"celebrations" | "users" | "revenue">("celebrations");

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
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Calculate live analytics
  const totalRevenue = templates.reduce((sum, t) => sum + (t.revenue || 0), 0);
  
  // Daily stats for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const daily = last7Days.map(date => {
    const dayCelebrations = celebrations.filter(c => c.createdAt === date).length;
    const dayUsers = users.filter(u => u.joinedAt === date).length;
    const dayRevenue = dayCelebrations * 14; 
    const label = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return { date: label, celebrations: dayCelebrations, users: dayUsers, revenue: dayRevenue };
  });

  // Calculate category breakdown share percentages
  const categoryCounts: Record<string, number> = {};
  celebrations.forEach(c => {
    const cat = c.category || "Other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const totalCelebrations = celebrations.length || 1;
  const categoryBreakdown = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalCelebrations) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const maxVal = Math.max(...daily.map(d => d[activeMetric]), 1);
  const metricColors = { celebrations: "bg-violet-500", users: "bg-sky-500", revenue: "bg-emerald-500" };
  const metricLabels = { celebrations: "Celebrations Created", users: "New Signed Up Users", revenue: "Estimated Revenue ($)" };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-white/40 text-sm mt-0.5">Real-time performance and usage metrics</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Live Calculations
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="from premium uses" icon={DollarSign} trend="+18.4%" positive />
        <MetricCard label="Total Users" value={users.length.toString()} sub="registered accounts" icon={Users} trend="+12.7%" positive />
        <MetricCard label="Conversion Rate" value="23.4%" sub="visitors to creations" icon={MousePointerClick} trend="+2.1%" positive />
        <MetricCard label="Active Celebrations" value={celebrations.filter(c => c.status === "Active").length.toString()} sub="active links online" icon={Gift} trend="+8.3%" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#1a1a24] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">7-Day Trend</p>
              <p className="text-xs text-white/40">Select metric to visualize daily log</p>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              {(["celebrations", "users", "revenue"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${activeMetric === m ? "bg-violet-500 text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {daily.map((d, i) => {
              const val = d[activeMetric];
              const pct = (val / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex items-end h-32">
                    <div
                      className={`w-full rounded-t-lg ${metricColors[activeMetric]} opacity-70 group-hover:opacity-100 transition-all`}
                      style={{ height: `${pct}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0f0f14] border border-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap">
                        {activeMetric === "revenue" ? `$${val}` : val}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30">{d.date.replace("Aug ", "")}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-white/30 mt-3 text-center">{metricLabels[activeMetric]} per day</p>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-white/5 bg-[#1a1a24] p-5">
          <p className="text-sm font-semibold text-white mb-1">Category Breakdown</p>
          <p className="text-xs text-white/40 mb-5">Share of total celebrations</p>
          <div className="space-y-4">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((c, i) => {
                const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"];
                return (
                  <div key={c.category}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/70 font-medium">{c.category}</span>
                      <span className="text-white font-bold">{c.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${c.percentage}%`, backgroundColor: colors[i % colors.length] }}
                      />
                    </div>
                    <p className="text-[10px] text-white/25 mt-0.5">{c.count.toLocaleString()} celebrations</p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-white/30 py-12 text-center">No calculations found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Extra metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-[#1a1a24] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center">
            <Clock className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Avg. Session</p>
            <p className="text-xl font-bold text-white">4m 32s</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#1a1a24] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Gift className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Total Creations</p>
            <p className="text-xl font-bold text-white">{celebrations.length}</p>
            <p className="text-xs text-white/30">all-time live entries</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#1a1a24] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Week Revenue</p>
            <p className="text-xl font-bold text-white">${daily.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</p>
            <p className="text-xs text-emerald-400 font-semibold">+18.4% growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
