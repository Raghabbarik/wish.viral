import React, { useEffect, useState } from "react";
import { Search, UserCheck, UserX, Trash2, Crown, Shield, User } from "lucide-react";
import { listenToUsers, updateUserStatus, deleteUser, AdminUser } from "../services/adminService";

const planColors: Record<string, string> = {
  free: "bg-white/5 text-white/50",
  pro: "bg-violet-500/15 text-violet-400",
  premium: "bg-amber-500/15 text-amber-400",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  banned: "bg-red-500/15 text-red-400",
  pending: "bg-amber-500/15 text-amber-400",
};

const planIcons: Record<string, React.ElementType> = { free: User, pro: Shield, premium: Crown };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const unsub = listenToUsers((data) => {
      setUsers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleToggleBan = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "banned" ? "active" : "banned";
      await updateUserStatus(id, nextStatus);
    } catch (err) {
      console.error("Error toggling user ban:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user from Firestore?")) {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalActive = users.filter(u => u.status === "active").length;
  const totalBanned = users.filter(u => u.status === "banned").length;
  const totalPro = users.filter(u => u.plan === "pro" || u.plan === "premium").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/40 text-sm mt-0.5">Real-time user accounts database</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold">{totalActive} Active</span>
          <span className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 font-semibold">{totalBanned} Banned</span>
          <span className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-400 font-semibold">{totalPro} Paid</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white/70 focus:outline-none focus:border-violet-500/40"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/5 text-sm text-white/70 focus:outline-none focus:border-violet-500/40"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-[#1a1a24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["User", "Plan", "Status", "Celebrations", "Joined", "Last Active", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-white/30 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const PlanIcon = planIcons[user.plan] || User;
                return (
                  <tr key={user.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? "bg-white/[0.01]" : ""}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {user.avatar || (user.name ? user.name.slice(0,2).toUpperCase() : "U")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-[11px] text-white/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${planColors[user.plan] || planColors.free}`}>
                        <PlanIcon className="w-3 h-3" /> {user.plan || "free"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusColors[user.status] || statusColors.active}`}>
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/70 font-semibold">{user.celebrationsCount || 0}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{user.joinedAt || "N/A"}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{user.lastActive || "N/A"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBan(user.id, user.status)}
                          className={`p-1.5 rounded-lg transition-colors ${user.status === "banned" ? "text-emerald-400 hover:bg-emerald-500/10" : "text-amber-400 hover:bg-amber-500/10"}`}
                          title={user.status === "banned" ? "Unban" : "Ban"}
                        >
                          {user.status === "banned" ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">No users found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 text-xs text-white/30">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
