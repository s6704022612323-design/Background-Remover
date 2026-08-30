import React from "react";
import { Upload, Sparkles, SlidersHorizontal, Download, CheckCircle2, Users, Eye, HelpCircle } from "lucide-react";

interface InstructionGuideProps {
  onStartUpload: () => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export const InstructionGuide: React.FC<InstructionGuideProps> = ({
  onStartUpload,
  isOpenAsModal,
  onCloseModal,
}) => {
  const steps = [
    {
      stepNumber: "01",
      title: "เลือกรูปภาพบุคคลจากเครื่อง",
      description: "เลือกรูปภาพคนเดี่ยว, 2 คนยืนคู่กัน หรือภาพหมู่คณะหลายคนในระนาบด้านหน้า",
      icon: Upload,
      accent: "from-blue-500 to-indigo-600",
      badge: "รองรับ JPG / PNG / WEBP",
    },
    {
      stepNumber: "02",
      title: "AI แยกบุคคลกับพื้นหลัง",
      description: "AI จะตรวจจับบุคคลด้านหน้าสุดอย่างแม่นยำ พร้อมตัดพื้นหลังที่ไม่ต้องการออก",
      icon: Sparkles,
      accent: "from-indigo-600 to-purple-600",
      badge: "ระบบ AI อัจฉริยะ",
    },
    {
      stepNumber: "03",
      title: "เปรียบเทียบภาพ ก่อน-หลัง",
      description: "เลื่อนแถบสไลเดอร์เพื่อดูภาพก่อนตัดและหลังตัด พร้อมเลือกเปลี่ยนสีพื้นหลังได้ตามต้องการ",
      icon: SlidersHorizontal,
      accent: "from-purple-600 to-pink-600",
      badge: "Before & After Slider",
    },
    {
      stepNumber: "04",
      title: "ดาวน์โหลดรูปเข้าเครื่อง",
      description: "กดปุ่มดาวน์โหลดเพื่อบันทึกรูปภาพโปร่งใส (PNG) ความละเอียดสูงลงในเครื่องของคุณ",
      icon: Download,
      accent: "from-emerald-500 to-teal-600",
      badge: "ความละเอียดสูง Full HD",
    },
  ];

  const content = (
    <div className="w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-blue-100 mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>AI Person Background Removal Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            ขั้นตอนการใช้งานระบบตัดพื้นหลังบุคคลและภาพหมู่ด้วย AI
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
            ระบบจะตรวจจับบุคคลที่อยู่ด้านหน้าสุดอย่างแม่นยำ ไม่ว่าจะเป็น<strong>บุคคลเดี่ยว</strong>, <strong>บุคคล 2 คนที่ยืนเคียงข้างกัน</strong> หรือ <strong>ภาพถ่ายหมู่คณะ/ทีมงาน/ครอบครัว</strong> พร้อมแยกบุคคลออกจากพื้นหลังอย่างประณีตในไม่กี่วินาที
          </p>

          {!isOpenAsModal && (
            <button
              id="guide-start-btn"
              onClick={onStartUpload}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-indigo-700 hover:bg-blue-50 font-semibold rounded-xl shadow-md transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>เริ่มอัปโหลดรูปภาพ</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.stepNumber}
              id={`instruction-step-${item.stepNumber}`}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group hover:border-indigo-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.accent} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    ขั้นตอน {item.stepNumber}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-800 mb-2">{item.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-medium text-indigo-600">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                <span>{item.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Principles & Best Result Tips */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-4">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          หลักการทำงานและการเตรียมรูปภาพเพื่อผลลัพธ์ที่ดีที่สุด
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1">👥 ตรวจจับบุคคลเดี่ยว/คู่/ภาพหมู่</span>
            <span>AI จะตรวจจับบุคคลในระนาบหน้าสุด หากเป็นภาพหมู่หรือคนยืนชิดกัน ระบบจะตัดแยกเก็บรายละเอียดครบทุกคน</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1">🖼️ ขอบเนียนละเอียดระดับพิกเซล</span>
            <span>ปรับแต่งความเนียน ขอบผมพริ้ว และลบสีสะท้อนจากพื้นหลังเดิมด้วย Matte Refinement Studio</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1">💾 บันทึกแบบโปร่งใส</span>
            <span>ไฟล์ที่ดาวน์โหลดจะเป็น PNG แบบโปร่งใส สามารถนำไปวางบนฉากหลังอื่นหรือทำกราฟิกได้ทันที</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              คู่มือขั้นตอนการใช้งาน
            </h2>
            <button
              onClick={onCloseModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
          {content}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onCloseModal}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow cursor-pointer"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return content;
};
