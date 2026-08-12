import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  ChevronDown,
  Shield,
} from "lucide-react";
import { seedFirestoreIfEmpty } from "../services/adminService";

const navSections = [
  {
    label: "MAIN",
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
      { to: "/admin/users", icon: Users, label: "Users" },
      { to: "/admin/templates", icon: Layers, label: "Templates" },
      { to: "/admin/celebrations", icon: Gift, label: "Celebrations" },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { to: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    seedFirestoreIfEmpty();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f14] text-white font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } flex-shrink-0 flex flex-col bg-[#13131a] border-r border-white/5 transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-sm font-bold text-white">Wishora</p>
              <p className="text-[10px] text-white/40">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
          {navSections.map((section) => (
            <div key={section.label}>
              {sidebarOpen && (
                <p className="px-2 mb-2 text-[10px] font-bold tracking-widest text-white/25 uppercase">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                        isActive
                          ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                          : "text-white/50 hover:bg-white/5 hover:text-white/80"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin profile + signout */}
        <div className="border-t border-white/5 p-3 space-y-1">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">Admin</p>
                <p className="text-[10px] text-white/40 truncate">raghabbarik@gmail.com</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f0f14]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </div>
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
