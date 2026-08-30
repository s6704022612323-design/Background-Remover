import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Columns,
  SplitSquareVertical,
  Layers,
  Sparkles,
  Users,
  Eye,
  Palette,
  Check,
  Sliders,
  Feather,
  Scissors,
  UserCheck,
  RotateCcw,
  ShieldCheck,
  ZoomIn,
  Activity,
  Eraser,
  Paintbrush,
  Sun,
  Moon,
  Upload,
  Image as ImageIcon,
  Undo2,
  Wand2,
} from "lucide-react";
import { BackgroundPreset, MatteRefineOptions, SegmentationData } from "../types";
import { BACKGROUND_PRESETS, MATTE_PRESETS, DEFAULT_MATTE_OPTIONS } from "../utils/imageProcessor";
import { generateFallbackAnatomy } from "../utils/anatomyAnalyzer";
import { AnatomyInspector } from "./AnatomyInspector";

interface ComparisonViewerProps {
  originalImageUrl: string;
  cutoutImageUrl: string;
  segmentationData: SegmentationData | null;
  selectedBg: BackgroundPreset;
  onSelectBg: (bg: BackgroundPreset) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  matteOptions: MatteRefineOptions;
  onMatteOptionsChange: (options: MatteRefineOptions) => void;
}

type ViewMode = "split" | "side-by-side" | "hover-toggle";
type MainTab = "studio" | "anatomy";
type BrushMode = "none" | "erase" | "restore";

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  originalImageUrl,
  cutoutImageUrl,
  segmentationData,
  selectedBg,
  onSelectBg,
  customColor,
  onCustomColorChange,
  matteOptions,
  onMatteOptionsChange,
}) => {
  const [mainTab, setMainTab] = useState<MainTab>("studio");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHoveringOriginal, setIsHoveringOriginal] = useState<boolean>(false);
  const [showAdvancedSliders, setShowAdvancedSliders] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Manual Touch-Up Brush State
  const [brushMode, setBrushMode] = useState<BrushMode>("none");
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [customBgImageSrc, setCustomBgImageSrc] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Compute or extract rich Anatomy Analysis
  const anatomyData = useMemo(() => {
    if (segmentationData?.anatomyAnalysis && segmentationData.anatomyAnalysis.persons?.length > 0) {
      return segmentationData.anatomyAnalysis;
    }
    return generateFallbackAnatomy(
      segmentationData?.detectedPeopleCount || 1,
      segmentationData?.subjectCategory || "single_person",
      segmentationData?.boundingBox,
      segmentationData?.polygons
    );
  }, [segmentationData]);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsPainting(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerUp, handlePointerMove]);

  // Checkerboard background style for transparency
  const checkerboardStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
      linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
      linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
    `,
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    backgroundColor: "#f1f5f9",
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    if (selectedBg.type === "transparent") {
      return checkerboardStyle;
    }
    if (selectedBg.id === "custom-image" && customBgImageSrc) {
      return {
        backgroundImage: `url(${customBgImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (selectedBg.type === "solid") {
      return { backgroundColor: selectedBg.id === "custom" ? customColor : selectedBg.value };
    }
    if (selectedBg.type === "gradient") {
      return { background: selectedBg.value };
    }
    return {};
  };

  const handlePresetSelect = (preset: (typeof MATTE_PRESETS)[0]) => {
    onMatteOptionsChange(preset.options);
  };

  const handleSliderChange = (key: keyof MatteRefineOptions, value: any) => {
    onMatteOptionsChange({
      ...matteOptions,
      [key]: value,
      presetId: "custom",
    });
  };

  const handleResetMatte = () => {
    onMatteOptionsChange(DEFAULT_MATTE_OPTIONS);
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomBgImageSrc(result);
      onSelectBg({
        id: "custom-image",
        name: "รูปฉากหลังของฉัน",
        type: "custom",
        value: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case "Feather":
        return <Feather className="w-4 h-4 text-purple-500" />;
      case "Scissors":
        return <Scissors className="w-4 h-4 text-emerald-500" />;
      case "UserCheck":
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "Users":
        return <Users className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Master View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white border border-slate-200 rounded-2xl p-2 shadow-xs gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            id="tab-studio-mode"
            onClick={() => setMainTab("studio")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              mainTab === "studio"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>1. สตูดิโอปรับแต่งภาพ & เปลี่ยนฉากหลัง</span>
          </button>

          <button
            id="tab-anatomy-mode"
            onClick={() => setMainTab("anatomy")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              mainTab === "anatomy"
                ? "bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>2. วิเคราะห์โครงสร้าง Anatomy & แท็กเปรียบเทียบ</span>
            <span className="hidden md:inline-flex text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-extrabold">
              AI TAGS
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 px-2">
          <span className="text-xs font-semibold text-slate-500">
            คะแนนความสมบูรณ์ Anatomy:
          </span>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {anatomyData.overallAnatomyScore}% Precision
          </span>
        </div>
      </div>

      {/* VIEW ACCORDING TO ACTIVE TAB */}
      {mainTab === "anatomy" ? (
        <AnatomyInspector
          originalImage={originalImageUrl}
          processedImage={cutoutImageUrl}
          segmentationData={segmentationData}
          anatomyData={anatomyData}
          onApplyAnatomyLock={() => {
            onMatteOptionsChange({
              ...matteOptions,
              anatomyGuideLock: true,
            });
            setMainTab("studio");
          }}
        />
      ) : (
        <>
          {/* Top Toolbar: View Mode Switcher & Detection Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            {/* Left: AI Detection Badge */}
            {segmentationData ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                      AI PRECISION SEGMENTATION
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {segmentationData.detectedPeopleCount === 1
                        ? "บุคคลเดี่ยว (1 คน)"
                        : segmentationData.detectedPeopleCount === 2
                        ? "พบบุคคลคู่ด้านหน้า (2 คน)"
                        : `พบภาพหมู่ (${segmentationData.detectedPeopleCount} คน)`}
                    </span>
                    <button
                      onClick={() => setMainTab("anatomy")}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center gap-1 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      เปิดระบบแท็ก Anatomy
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {segmentationData.description || "ตัดพื้นหลังแยกบุคคลเรียบร้อยแล้ว"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>ตัดพื้นหลังแยกบุคคลเรียบร้อยแล้ว</span>
              </div>
            )}

            {/* Right: View Mode Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  id="view-mode-split-btn"
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === "split"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>เลื่อนสไลเดอร์ (Split)</span>
                </button>

                <button
                  id="view-mode-side-btn"
                  onClick={() => setViewMode("side-by-side")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === "side-by-side"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>เทียบสองฝั่ง (Side by Side)</span>
                </button>

                <button
                  id="view-mode-toggle-btn"
                  onClick={() => setViewMode("hover-toggle")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === "hover-toggle"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>กดค้างดูภาพเดิม</span>
                </button>
              </div>

              {/* Zoom Toggle */}
              <button
                id="zoom-detail-btn"
                onClick={() => setIsZoomed(!isZoomed)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                  isZoomed
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
                title="ซูมตรวจดูรายละเอียดเส้นผมและขอบภาพแบบใกล้ชิด"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isZoomed ? "ซูมออกปกติ" : "ซูมตรวจขอบ (Zoom)"}</span>
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="bg-slate-900/5 rounded-3xl p-3 sm:p-4 border border-slate-200">
            {viewMode === "split" && (
              <div
                ref={containerRef}
                id="split-compare-stage"
                onPointerMove={handlePointerMove}
                className={`relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] rounded-2xl overflow-hidden shadow-md cursor-ew-resize select-none flex items-center justify-center transition-all ${
                  isZoomed ? "scale-105" : ""
                }`}
                style={getBackgroundStyle()}
              >
                {/* Background Blur layer if selected */}
                {selectedBg.type === "blur" && (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center blur-lg scale-110 opacity-80"
                    style={{
                      backgroundImage: `url(${originalImageUrl})`,
                      filter: `blur(${matteOptions.bokehBlurStrength || 24}px) brightness(0.92)`,
                    }}
                  />
                )}

                {/* Cutout Person Result (Right side / After) */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10">
                  <img
                    src={cutoutImageUrl}
                    alt="Cutout Person"
                    className="w-full h-full object-contain"
                    style={{
                      filter: matteOptions.dropShadow
                        ? `drop-shadow(0 12px ${matteOptions.shadowBlur || 20}px rgba(0,0,0,${(matteOptions.shadowOpacity || 35) / 100}))`
                        : undefined,
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Foreground Original Image (Left side / Before) - Clipped to slider */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none z-20"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={originalImageUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Split Divider Line & Draggable Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] z-30 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div
                    onPointerDown={handlePointerDown}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-indigo-600 shadow-2xl border-2 border-indigo-600 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                  >
                    <SplitSquareVertical className="w-5 h-5" />
                  </div>
                </div>

                {/* Floating Labels */}
                <div className="absolute top-4 left-4 z-40 px-3 py-1 bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold rounded-full pointer-events-none shadow">
                  ภาพก่อนตัด (Original)
                </div>
                <div className="absolute top-4 right-4 z-40 px-3 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-full pointer-events-none shadow flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ภาพหลังตัดเนียนระดับ HD</span>
                </div>
              </div>
            )}

            {viewMode === "side-by-side" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Original */}
                <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex flex-col">
                  <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">ภาพต้นฉบับ (ก่อนตัด)</span>
                    <span className="text-[11px] text-slate-400">Original Photo</span>
                  </div>
                  <div className="p-4 flex-1 flex items-center justify-center min-h-[340px] max-h-[480px]">
                    <img
                      src={originalImageUrl}
                      alt="Original"
                      className={`max-h-full max-w-full object-contain rounded-lg transition-transform ${
                        isZoomed ? "scale-110" : ""
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Right: Cutout Result */}
                <div className="bg-slate-100 rounded-2xl overflow-hidden border border-emerald-200 flex flex-col">
                  <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      ผลลัพธ์ตัดแยกบุคคล (หลังตัด)
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">{selectedBg.name}</span>
                  </div>
                  <div
                    className="p-4 flex-1 flex items-center justify-center min-h-[340px] max-h-[480px] relative overflow-hidden"
                    style={getBackgroundStyle()}
                  >
                    {selectedBg.type === "blur" && (
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center blur-lg scale-110 opacity-80"
                        style={{
                          backgroundImage: `url(${originalImageUrl})`,
                          filter: `blur(${matteOptions.bokehBlurStrength || 24}px) brightness(0.92)`,
                        }}
                      />
                    )}
                    <img
                      src={cutoutImageUrl}
                      alt="Cutout Result"
                      className={`max-h-full max-w-full object-contain rounded-lg relative z-10 transition-transform ${
                        isZoomed ? "scale-110" : ""
                      }`}
                      style={{
                        filter: matteOptions.dropShadow
                          ? `drop-shadow(0 12px ${matteOptions.shadowBlur || 20}px rgba(0,0,0,${(matteOptions.shadowOpacity || 35) / 100}))`
                          : undefined,
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            )}

            {viewMode === "hover-toggle" && (
              <div
                onMouseDown={() => setIsHoveringOriginal(true)}
                onMouseUp={() => setIsHoveringOriginal(false)}
                onTouchStart={() => setIsHoveringOriginal(true)}
                onTouchEnd={() => setIsHoveringOriginal(false)}
                className={`relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] rounded-2xl overflow-hidden shadow-md cursor-pointer select-none flex items-center justify-center transition-transform ${
                  isZoomed ? "scale-105" : ""
                }`}
                style={!isHoveringOriginal ? getBackgroundStyle() : { backgroundColor: "#0f172a" }}
              >
                {selectedBg.type === "blur" && !isHoveringOriginal && (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center blur-lg scale-110 opacity-80"
                    style={{
                      backgroundImage: `url(${originalImageUrl})`,
                      filter: `blur(${matteOptions.bokehBlurStrength || 24}px) brightness(0.92)`,
                    }}
                  />
                )}
                <img
                  src={isHoveringOriginal ? originalImageUrl : cutoutImageUrl}
                  alt={isHoveringOriginal ? "Original Photo" : "Cutout Person"}
                  className="w-full h-full object-contain relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow pointer-events-none">
                  {isHoveringOriginal ? "กำลังแสดงภาพต้นฉบับ" : "กดค้างไว้เพื่อดูภาพต้นฉบับ"}
                </div>
              </div>
            )}
          </div>

          {/* Matte Refinement & Studio Lighting Controls */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  ปรับแต่งขอบภาพและจัดแสงสตูดิโอ (Matte & Studio Lighting Refiner)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  เลือกโหมดสำเร็จรูป หรือเลื่อนปรับความเนียนของไรผม ขจัดขอบฟุ้ง และเพิ่มเงาสะท้อนสมจริง
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="reset-matte-btn"
                  onClick={handleResetMatte}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  title="คืนค่าความเนียนเริ่มต้น"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ตค่า</span>
                </button>

                <button
                  id="toggle-sliders-btn"
                  onClick={() => setShowAdvancedSliders(!showAdvancedSliders)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                    showAdvancedSliders
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showAdvancedSliders ? "ซ่อนแถบปรับละเอียด" : "ปรับแต่งละเอียด (Custom Sliders)"}</span>
                </button>
              </div>
            </div>

            {/* White Garment / Shirt Protection Quick Action Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-xl p-3.5 mb-4 border border-emerald-500/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      ระบบ AI คุ้มครองเสื้อสีขาว & ยูนิฟอร์ม (White Shirt Shield)
                    </span>
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded-full font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    ป้องกันเสื้อเชิ้ตขาว ชุดนักเรียน/นักศึกษา หรือยูนิฟอร์มสีขาวไม่ให้ถูกลบแหว่งหรือกลืนกับฉากหลังสีสว่าง
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-[11px] text-slate-300 font-medium">เปิดการป้องกัน:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="white-garment-quick-toggle"
                      type="checkbox"
                      checked={matteOptions.whiteGarmentProtect !== false}
                      onChange={(e) => {
                        handleSliderChange("whiteGarmentProtect", e.target.checked);
                        if (e.target.checked && (!matteOptions.whiteGarmentStrength || matteOptions.whiteGarmentStrength === 0)) {
                          handleSliderChange("whiteGarmentStrength", 85);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <button
                  id="quick-white-shirt-preset-btn"
                  onClick={() => {
                    const whitePreset = MATTE_PRESETS.find((p) => p.id === "white_shirt");
                    if (whitePreset) handlePresetSelect(whitePreset);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ใช้โหมดเสื้อขาวทันที</span>
                </button>
              </div>
            </div>

            {/* Preset Modes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
              {MATTE_PRESETS.map((preset) => {
                const isSelected = matteOptions.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`matte-preset-${preset.id}`}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {getPresetIcon(preset.iconName)}
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {preset.name.split(" ")[0]}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Fine-Tuning Sliders & Studio Lighting (Collapsible / Expandable) */}
            {showAdvancedSliders && (
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Edge Smoothness / Feather */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      1. ความเนียนนุ่มของขอบ (Edge Smoothness)
                    </span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {matteOptions.smoothness.toFixed(1)} px
                    </span>
                  </div>
                  <input
                    id="matte-smoothness-slider"
                    type="range"
                    min="0"
                    max="4"
                    step="0.1"
                    value={matteOptions.smoothness}
                    onChange={(e) => handleSliderChange("smoothness", parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">
                    เพิ่มความสมูทเพื่อไม่ให้ขอบตัดแข็งกระด้าง
                  </span>
                </div>

                {/* 2. Color Decontamination / Anti-Fringe */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      2. ลบแสงฟุ้งสีพื้นหลังเดิม (Anti-Fringe Despill)
                    </span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {matteOptions.decontamination}%
                    </span>
                  </div>
                  <input
                    id="matte-decontam-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={matteOptions.decontamination}
                    onChange={(e) => handleSliderChange("decontamination", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">
                    กำจัดขอบสีขาวหรือสีฉากหลังเดิมที่เกาะอยู่ตามขอบผมและเสื้อผ้า
                  </span>
                </div>

                {/* 3. Edge Choke / Shift */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      3. การเก็บขอบ/หดขอบเข้าใน (Edge Choke Trim)
                    </span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {matteOptions.edgeChoke > 0 ? `+${matteOptions.edgeChoke.toFixed(1)}` : matteOptions.edgeChoke.toFixed(1)} px
                    </span>
                  </div>
                  <input
                    id="matte-choke-slider"
                    type="range"
                    min="-1.5"
                    max="2.0"
                    step="0.1"
                    value={matteOptions.edgeChoke}
                    onChange={(e) => handleSliderChange("edgeChoke", parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">
                    หดขอบเข้ามาเล็กน้อยเพื่อลบเส้นขอบสีฉากหลัง หรือขยายออกเพื่อเก็บไรผม
                  </span>
                </div>

                {/* 4. Hair Detail Clarity */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      4. ความคมชัดของเส้นผม (Hair Detail Clarity)
                    </span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {matteOptions.hairDetail}%
                    </span>
                  </div>
                  <input
                    id="matte-hair-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={matteOptions.hairDetail}
                    onChange={(e) => handleSliderChange("hairDetail", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">
                    เพิ่มคอนทราสต์ให้ไรผมและปอยผมเส้นเล็กๆ คมชัดดูมีมิติ
                  </span>
                </div>

                {/* 5. Drop Shadow Toggle & Blur */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      5. เงาตกกระทบสมจริง (Drop Shadow)
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!matteOptions.dropShadow}
                        onChange={(e) => handleSliderChange("dropShadow", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={matteOptions.shadowBlur || 20}
                    disabled={!matteOptions.dropShadow}
                    onChange={(e) => handleSliderChange("shadowBlur", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                  />
                  <span className="text-[11px] text-slate-400">
                    เพิ่มเงาด้านหลังหรือใต้ตัวแบบเพื่อความสมจริงเมื่อวางบนฉากหลัง
                  </span>
                </div>

                {/* 6. Background Bokeh Blur (when blur mode is selected) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      6. หน้าชัดหลังเบลอ (Bokeh Blur)
                    </span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {matteOptions.bokehBlurStrength || 24} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={matteOptions.bokehBlurStrength || 24}
                    onChange={(e) => handleSliderChange("bokehBlurStrength", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">
                    ปรับระดับความเบลอของฉากหลังเดิมให้ดูเหมือนถ่ายด้วยเลนส์โปร
                  </span>
                </div>

                {/* 7. White Garment Protection Strength */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      7. ความเข้มข้นการกู้คืนเสื้อขาว (White Shirt Shield)
                    </span>
                    <span className="font-mono text-emerald-600 font-bold">
                      {matteOptions.whiteGarmentProtect === false ? "ปิด" : `${matteOptions.whiteGarmentStrength || 80}%`}
                    </span>
                  </div>
                  <input
                    id="matte-white-garment-slider"
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={matteOptions.whiteGarmentStrength || 80}
                    disabled={matteOptions.whiteGarmentProtect === false}
                    onChange={(e) => {
                      handleSliderChange("whiteGarmentStrength", parseInt(e.target.value));
                      if (matteOptions.whiteGarmentProtect === false) {
                        handleSliderChange("whiteGarmentProtect", true);
                      }
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-40"
                  />
                  <span className="text-[11px] text-slate-400">
                    ดึงเนื้อผ้าและขอบเสื้อเชิ้ตขาว/ชุดนักเรียนกลับมาเมื่อพื้นหลังเป็นสีสว่าง
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Background Customizer */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">
                  เลือกพื้นหลังที่ต้องการ (Background Options)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                โปร่งใส (PNG) / สตูดิโอ / ทำรูปติดบัตร / อัปโหลดฉากหลังของตัวเอง
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-4">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected = selectedBg.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`bg-preset-${preset.id}`}
                    onClick={() => onSelectBg(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    }`}
                  >
                    {/* Thumbnail circle */}
                    <div
                      className="w-7 h-7 rounded-lg border border-slate-300 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-2xs"
                      style={
                        preset.type === "transparent"
                          ? checkerboardStyle
                          : preset.type === "solid"
                          ? { backgroundColor: preset.value }
                          : preset.type === "gradient"
                          ? { background: preset.value }
                          : { background: "#64748b" }
                      }
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            preset.id === "white" ||
                            preset.id === "pastel-pink" ||
                            preset.id === "pastel-mint" ||
                            preset.id === "warm-beige"
                              ? "text-slate-900"
                              : "text-white"
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {preset.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}

              {/* Custom Image Upload Backdrop Button */}
              <button
                onClick={() => customBgInputRef.current?.click()}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-2.5 cursor-pointer ${
                  selectedBg.id === "custom-image"
                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                    : "border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/30"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block text-xs font-bold text-indigo-900 truncate">
                    + อัปโหลดฉาก
                  </span>
                </div>
              </button>
              <input
                ref={customBgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomBgUpload}
              />
            </div>

            {/* Custom Color Picker Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600">กำหนดสีพื้นหลังเอง:</span>
                <input
                  id="custom-color-picker"
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    onCustomColorChange(e.target.value);
                    onSelectBg({
                      id: "custom",
                      name: `สี ${e.target.value}`,
                      type: "solid",
                      value: e.target.value,
                    });
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-xs text-slate-500 font-mono">{customColor}</span>
              </div>

              <div className="text-xs text-slate-400">
                * กดปุ่มดาวน์โหลด PNG ด้านล่างเพื่อบันทึกไฟล์แบบพื้นหลังโปร่งใสระดับ HD หรือพร้อมฉากหลังสตูดิโอ
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
