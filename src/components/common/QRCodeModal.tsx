import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "./Modal";
import { Copy, Download, Share2, MessageCircle, Sparkles } from "lucide-react";
import { useToast } from "./Toast";
interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  recipientName: string;
}
export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  recipientName,
}) => {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    showToast(
      "Link Copied! 🎉",
      "Share it with " + recipientName + " anywhere.",
    );
  };
  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector("canvas");
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `wishora-qr-${recipientName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.click();
    showToast("QR Code Downloaded! 📱", "Saved image to your downloads.");
  };
  const whatsappMessage = encodeURIComponent(
    `Hey ${recipientName}! Someone sent you a special celebration page on Wishora 🎉✨ Open your surprise here: ${url}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Celebration QR Code"
      subtitle={`Scan to open ${recipientName}'s celebration page instantly`}
      maxWidth="md"
    >
      {" "}
      <div className="flex flex-col items-center text-center py-2 space-y-6">
        {" "}
        {/* QR Box with Wishora Branding Frame */}{" "}
        <div
          ref={canvasRef}
          className="p-6 bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-indigo-500/10 rounded-3xl border border-[#b0ba99] shadow-inner flex flex-col items-center"
        >
          {" "}
          <div className="p-4 bg-white/60 rounded-2xl shadow-md border border-[#b0ba99]">
            {" "}
            <QRCodeCanvas
              value={url}
              size={200}
              bgColor="#ffffff"
              fgColor="#1e293b"
              level="H"
              includeMargin={true}
            />{" "}
          </div>{" "}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#9d6638] ">
            {" "}
            <Sparkles className="w-3.5 h-3.5" />{" "}
            <span>Scan with any phone camera</span>{" "}
          </div>{" "}
        </div>{" "}
        {/* Link Box */}{" "}
        <div className="w-full bg-white/60/60 p-3.5 rounded-2xl border border-[#b0ba99] flex items-center justify-between text-left">
          {" "}
          <div className="truncate pr-2">
            {" "}
            <p className="text-xs text-[#4e220f] font-medium">
              Celebration Link
            </p>{" "}
            <p className="text-sm font-medium text-[#4e220f] truncate">
              {url}
            </p>{" "}
          </div>{" "}
          <button
            onClick={handleCopyLink}
            className="shrink-0 px-3 py-1.5 bg-[#b0ba99] hover:bg-[#b0ba99] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            {" "}
            <Copy className="w-3.5 h-3.5" /> <span>Copy</span>{" "}
          </button>{" "}
        </div>{" "}
        {/* Action Grid */}{" "}
        <div className="grid grid-cols-2 gap-3 w-full">
          {" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            {" "}
            <MessageCircle className="w-4 h-4" />{" "}
            <span>Send on WhatsApp</span>{" "}
          </a>{" "}
          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/60/60 hover:bg-white/60/60 :bg-white/60 text-white font-semibold rounded-2xl text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            {" "}
            <Download className="w-4 h-4" /> <span>Save QR Image</span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </Modal>
  );
};
