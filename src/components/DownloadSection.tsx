import React, { useState } from "react";
import { Download, Sparkles, RefreshCw, Check, FileCheck, Layers } from "lucide-react";
import confetti from "canvas-confetti";
import { downloadCanvas, renderCutoutWithBackground, BACKGROUND_PRESETS } from "../utils/imageProcessor";
import { BackgroundPreset, MatteRefineOptions } from "../types";

interface DownloadSectionProps {
  cutoutImage: HTMLImageElement | null;
  originalImage: HTMLImageElement | null;
  selectedBg: BackgroundPreset;
  customColor?: string;
  matteOptions?: MatteRefineOptions;
  fileName?: string;
  onReset: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  cutoutImage,
  originalImage,
  selectedBg,
  customColor = "#3b82f6",
  matteOptions,
  fileName = "person-cutout.png",
  onReset,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#4f46e5", "#06b6d4", "#ec4899", "#10b981"],
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadTransparent = async () => {
    if (!cutoutImage) return;
    setIsDownloading(true);
    try {
      // Render pure transparent canvas
      const transparentPreset = BACKGROUND_PRESETS[0]; // transparent
      const canvas = await renderCutoutWithBackground(cutoutImage, originalImage, transparentPreset, undefined, matteOptions);
      const cleanName = fileName.replace(/\.[^/.]+$/, "");
      downloadCanvas(canvas, `${cleanName}_transparent_ai.png`, "image/png");
      fireConfetti();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to download transparent image:", err);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadCurrent = async () => {
    if (!cutoutImage) return;
    setIsDownloading(true);
    try {
      const canvas = await renderCutoutWithBackground(cutoutImage, originalImage, selectedBg, customColor, matteOptions);
      const cleanName = fileName.replace(/\.[^/.]+$/, "");
      downloadCanvas(canvas, `${cleanName}_cutout_${selectedBg.id}.png`, "image/png");
      fireConfetti();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to download image with background:", err);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  const width = cutoutImage?.naturalWidth || cutoutImage?.width || originalImage?.naturalWidth || 0;
  const height = cutoutImage?.naturalHeight || cutoutImage?.height || originalImage?.naturalHeight || 0;

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Image Dimensions & Info */}
        <div className="flex items-center gap-4 text-left w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">รูปภาพพร้อมดาวน์โหลด</h2>
              {downloadSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> ดาวน์โหลดสำเร็จแล้ว!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ความละเอียด: <strong>{width} × {height} px</strong> (ไฟล์ PNG คุณภาพสูง โปร่งใส คมชัดทุกพิกเซล)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            id="reset-new-image-btn"
            onClick={onReset}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ทำรูปภาพใหม่</span>
          </button>

          {selectedBg.type !== "transparent" && (
            <button
              id="download-with-bg-btn"
              onClick={handleDownloadCurrent}
              disabled={isDownloading}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>ดาวน์โหลดพร้อมพื้นหลัง ({selectedBg.name.split(" ")[0]})</span>
            </button>
          )}

          <button
            id="download-transparent-png-btn"
            onClick={handleDownloadTransparent}
            disabled={isDownloading}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-5 h-5" />
            <span>ดาวน์โหลด PNG (โปร่งใส)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
