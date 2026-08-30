import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, FolderOpen, ArrowRight } from "lucide-react";
import { SAMPLE_IMAGES } from "../utils/sampleImages";
import { SampleImage } from "../types";

interface ImageUploaderProps {
  onImageSelected: (imageBase64: string, fileInfo?: { name: string; size: number }) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Support paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (PNG, JPG, JPEG, WEBP)");
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onImageSelected(base64, { name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedFileName(sample.title);
    onImageSelected(sample.fullImage, { name: `${sample.id}.png`, size: 240000 });
  };

  return (
    <div className="w-full">
      {/* Upload Box */}
      <div
        id="dropzone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/70 scale-[1.01]"
            : "border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto pointer-events-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-inner">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
            เลือกรูปภาพจากในเครื่องของคุณ
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mb-6 leading-relaxed">
            ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเปิดค้นหาไฟล์ในเครื่อง
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition">
            <FolderOpen className="w-4 h-4" />
            <span>เลือกรูปภาพจากเครื่อง</span>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            รองรับไฟล์ JPG, PNG, WEBP (สามารถกด Ctrl+V เพื่อวางรูปภาพได้)
          </p>
        </div>
      </div>

      {/* Preset Sample Images */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-700">
              หรือทดลองด้วยรูปตัวอย่าง (สำหรับทดสอบทันที)
            </h2>
          </div>
          <span className="text-xs text-slate-400">คลิกเพื่อทดสอบ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              id={`sample-btn-${sample.id}`}
              onClick={() => handleSelectSample(sample)}
              disabled={isLoading}
              className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-3 text-left transition-all duration-200 hover:shadow-md group flex items-center gap-3 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 group-hover:scale-105 transition duration-200">
                <img
                  src={sample.thumbnail}
                  alt={sample.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                  {sample.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {sample.subtitle}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
