import React, { useState } from "react";
import { CelebrationData } from "../types";
import {
  Sparkles,
  PlusCircle,
  Eye,
  Copy,
  QrCode,
  Trash2,
  ExternalLink,
  Edit,
  Share2,
  Gift,
} from "lucide-react";
import { useToast } from "../components/common/Toast";
import { QRCodeModal } from "../components/common/QRCodeModal";
interface MyCelebrationsViewProps {
  celebrations: CelebrationData[];
  onOpenCelebration: (celebration: CelebrationData) => void;
  onEditCelebration: (celebration: CelebrationData) => void;
  onDeleteCelebration: (id: string) => void;
  onCreateNew: () => void;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
}
export const MyCelebrationsView: React.FC<MyCelebrationsViewProps> = ({
  celebrations,
  onOpenCelebration,
  onEditCelebration,
  onDeleteCelebration,
  onCreateNew,
}) => {
  const [selectedQrCelebration, setSelectedQrCelebration] =
    useState<CelebrationData | null>(null);
  const { showToast } = useToast();
  const totalViews = celebrations.reduce(
    (acc, curr) => acc + curr.viewsCount,
    0,
  );
  const handleCopyLink = (slug: string, recipient: string) => {
    const url = `${window.location.origin}/w/${slug}`;
    navigator.clipboard.writeText(url);
    showToast("Link Copied! 📋", `Share link for ${recipient} copied.`);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {" "}
      {/* Top Banner & Stats */}{" "}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#b0ba99] ">
        {" "}
        <div>
          {" "}
          <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
            Dashboard
          </span>{" "}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4e220f] tracking-tight">
            {" "}
            My Celebrations{" "}
          </h1>{" "}
          <p className="text-sm text-[#4e220f] mt-1">
            {" "}
            Manage your personalized digital celebration pages, views, and
            links.{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-full shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          {" "}
          <PlusCircle className="w-4 h-4" />{" "}
          <span>Create New Celebration</span>{" "}
        </button>{" "}
      </div>{" "}
      {/* Metrics Row */}{" "}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {" "}
        <div className="p-5 rounded-2xl bg-white/60 border border-[#b0ba99] shadow-sm flex items-center gap-4">
          {" "}
          <div className="w-12 h-12 rounded-xl bg-[#b0ba99] text-[#9d6638] flex items-center justify-center">
            {" "}
            <Gift className="w-6 h-6" />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs font-semibold text-[#4e220f]">
              Total Celebrations
            </p>{" "}
            <p className="text-2xl font-black text-[#4e220f] ">
              {celebrations.length}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-5 rounded-2xl bg-white/60 border border-[#b0ba99] shadow-sm flex items-center gap-4">
          {" "}
          <div className="w-12 h-12 rounded-xl bg-[#b0ba99] text-[#9d6638] flex items-center justify-center">
            {" "}
            <Eye className="w-6 h-6" />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs font-semibold text-[#4e220f]">
              Total Page Views
            </p>{" "}
            <p className="text-2xl font-black text-[#4e220f] ">
              {totalViews.toLocaleString()}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-5 rounded-2xl bg-white/60 border border-[#b0ba99] shadow-sm flex items-center gap-4">
          {" "}
          <div className="w-12 h-12 rounded-xl bg-[#b0ba99] text-[#9d6638] flex items-center justify-center">
            {" "}
            <Share2 className="w-6 h-6" />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs font-semibold text-[#4e220f]">
              Active Share Links
            </p>{" "}
            <p className="text-2xl font-black text-[#4e220f] ">
              {celebrations.length}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Celebrations Grid */}{" "}
      {celebrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {celebrations.map((item) => (
            <div
              key={item.id}
              className="bg-white/60 rounded-2xl border border-[#b0ba99] shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-purple-100 :shadow-purple-950/20 hover:border-[#b0ba99] transition-all"
            >
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {" "}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#b0ba99] text-[#9d6638] ">
                    {" "}
                    {item.templateTitle}{" "}
                  </span>{" "}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.status === "Active" ? "bg-emerald-100 text-emerald-800 " : "bg-[#b0ba99] text-[#9d6638] "}`}
                  >
                    {" "}
                    {item.status}{" "}
                  </span>{" "}
                </div>{" "}
                <h3 className="text-lg font-bold text-[#4e220f] truncate">
                  {" "}
                  For: {item.recipientName}{" "}
                </h3>{" "}
                <p className="text-xs text-[#4e220f] mt-1 line-clamp-2 italic">
                  {" "}
                  "{item.message}"{" "}
                </p>{" "}
                <div className="mt-3 flex items-center justify-between text-xs text-[#4e220f]">
                  {" "}
                  <span>Created: {item.createdAt}</span>{" "}
                  <span className="flex items-center gap-1 font-semibold text-[#4e220f] ">
                    {" "}
                    <Eye className="w-3.5 h-3.5 text-[#4e220f]" />{" "}
                    {item.viewsCount} views{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              {/* Actions */}{" "}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#b0ba99] ">
                {" "}
                <button
                  onClick={() => onOpenCelebration(item)}
                  className="py-2 px-3 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  {" "}
                  <ExternalLink className="w-3.5 h-3.5" />{" "}
                  <span>Open</span>{" "}
                </button>{" "}
                <button
                  onClick={() => handleCopyLink(item.slug, item.recipientName)}
                  className="py-2 px-3 border border-[#b0ba99] hover:bg-white/60/60 :bg-white/60/60 text-[#4e220f] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {" "}
                  <Copy className="w-3.5 h-3.5" /> <span>Copy Link</span>{" "}
                </button>{" "}
                <button
                  onClick={() => setSelectedQrCelebration(item)}
                  className="py-2 px-3 bg-white/60/60 hover:bg-white/60/60 :bg-white/60/60 text-[#4e220f] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {" "}
                  <QrCode className="w-3.5 h-3.5" /> <span>QR Code</span>{" "}
                </button>{" "}
                <button
                  onClick={() => onDeleteCelebration(item.id)}
                  className="py-2 px-3 bg-[#b0ba99] hover:bg-[#b0ba99] text-[#9d6638] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {" "}
                  <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>{" "}
                </button>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white/60/60 rounded-3xl border border-dashed border-[#b0ba99] space-y-3">
          {" "}
          <p className="text-3xl">🎁</p>{" "}
          <h3 className="text-lg font-bold text-[#4e220f] ">
            No celebrations created yet
          </h3>{" "}
          <p className="text-sm text-[#4e220f] max-w-sm mx-auto">
            {" "}
            Choose a celebration template and create your very first digital
            surprise page.{" "}
          </p>{" "}
          <button
            onClick={onCreateNew}
            className="mt-2 px-5 py-2.5 bg-[#9d6638] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-full shadow-md hover:scale-105 transition-all"
          >
            {" "}
            Create Celebration Now{" "}
          </button>{" "}
        </div>
      )}{" "}
      {selectedQrCelebration && (
        <QRCodeModal
          isOpen={!!selectedQrCelebration}
          onClose={() => setSelectedQrCelebration(null)}
          url={`${window.location.origin}/w/${selectedQrCelebration.slug}`}
          recipientName={selectedQrCelebration.recipientName}
        />
      )}{" "}
    </div>
  );
};
