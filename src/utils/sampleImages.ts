import { SampleImage } from "../types";

// Helper to generate a realistic SVG canvas image as data URL for sample demonstrations
function createSampleSvg(type: "single" | "two_people" | "scenic_pair"): string {
  if (type === "single") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="50%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#db2777" />
        </linearGradient>
        <radialGradient id="sun" cx="80%" cy="20%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Background elements: Scenery & Buildings -->
      <rect width="800" height="1000" fill="url(#bgGrad)"/>
      <circle cx="650" cy="180" r="140" fill="url(#sun)"/>
      <rect x="50" y="450" width="160" height="400" fill="#312e81" opacity="0.4" rx="10"/>
      <rect x="580" y="400" width="180" height="450" fill="#312e81" opacity="0.4" rx="10"/>
      <path d="M 0 850 Q 400 780 800 850 L 800 1000 L 0 1000 Z" fill="#1e1b4b"/>
      
      <!-- Foreground Person (Single) -->
      <!-- Body & Shirt -->
      <path d="M 260 900 L 260 700 Q 280 560 400 560 Q 520 560 540 700 L 540 900 Z" fill="#0284c7" />
      <path d="M 340 560 L 400 680 L 460 560 Z" fill="#e0f2fe"/>
      <!-- Neck -->
      <rect x="365" y="490" width="70" height="90" rx="20" fill="#fbcfe8"/>
      <!-- Head & Face -->
      <ellipse cx="400" cy="400" rx="110" ry="135" fill="#fbcfe8"/>
      <!-- Hair -->
      <path d="M 285 380 Q 275 250 400 240 Q 525 250 515 380 Q 500 270 400 265 Q 300 270 285 380 Z" fill="#1e293b"/>
      <!-- Eyes & Smile -->
      <ellipse cx="360" cy="390" rx="12" ry="8" fill="#0f172a"/>
      <ellipse cx="440" cy="390" rx="12" ry="8" fill="#0f172a"/>
      <path d="M 370 445 Q 400 475 430 445" stroke="#be185d" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 350 365 Q 365 355 380 365" stroke="#0f172a" stroke-width="4" fill="none"/>
      <path d="M 420 365 Q 435 355 450 365" stroke="#0f172a" stroke-width="4" fill="none"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (type === "two_people") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" width="1000" height="800">
      <defs>
        <linearGradient id="officeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>
      </defs>
      <!-- Background Office Room with windows & plants -->
      <rect width="1000" height="800" fill="url(#officeBg)"/>
      <rect x="80" y="80" width="380" height="280" rx="8" fill="#1e293b" stroke="#475569" stroke-width="6"/>
      <line x1="270" y1="80" x2="270" y2="360" stroke="#475569" stroke-width="4"/>
      <line x1="80" y1="220" x2="460" y2="220" stroke="#475569" stroke-width="4"/>
      <!-- Background bookshelf -->
      <rect x="750" y="100" width="200" height="600" fill="#1e293b" rx="6"/>
      <rect x="770" y="150" width="160" height="20" fill="#e2e8f0"/>
      <rect x="770" y="240" width="160" height="20" fill="#e2e8f0"/>

      <!-- FOREGROUND PERSON 1 (Left Friend) -->
      <g id="person1">
        <!-- Body / Jacket -->
        <path d="M 180 800 L 190 520 Q 210 420 320 420 Q 420 420 440 520 L 450 800 Z" fill="#059669" />
        <!-- Inner shirt -->
        <path d="M 285 420 L 320 520 L 355 420 Z" fill="#f8fafc"/>
        <!-- Neck -->
        <rect x="295" y="360" width="50" height="70" rx="15" fill="#fed7aa"/>
        <!-- Head -->
        <ellipse cx="320" cy="290" rx="85" ry="105" fill="#fed7aa"/>
        <!-- Hair -->
        <path d="M 230 270 Q 225 170 320 160 Q 415 170 410 270 Q 380 185 320 185 Q 260 185 230 270 Z" fill="#1c1917"/>
        <!-- Face details -->
        <ellipse cx="290" cy="280" rx="9" ry="6" fill="#1c1917"/>
        <ellipse cx="350" cy="280" rx="9" ry="6" fill="#1c1917"/>
        <path d="M 295 330 Q 320 355 345 330" stroke="#dc2626" stroke-width="5" fill="none" stroke-linecap="round"/>
      </g>

      <!-- FOREGROUND PERSON 2 (Right Friend - standing close, arm together) -->
      <g id="person2">
        <!-- Body / Jacket -->
        <path d="M 430 800 L 440 510 Q 460 410 570 410 Q 680 410 700 510 L 710 800 Z" fill="#d97706" />
        <!-- Inner shirt -->
        <path d="M 535 410 L 570 510 L 605 410 Z" fill="#ffffff"/>
        <!-- Neck -->
        <rect x="545" y="350" width="50" height="70" rx="15" fill="#ffedd5"/>
        <!-- Head -->
        <ellipse cx="570" cy="280" rx="85" ry="105" fill="#ffedd5"/>
        <!-- Long Hair -->
        <path d="M 470 290 Q 465 150 570 145 Q 675 150 670 290 Q 690 400 660 490 Q 640 370 650 250 Q 570 170 490 250 Q 500 370 480 490 Z" fill="#78350f"/>
        <!-- Face details -->
        <ellipse cx="540" cy="275" rx="9" ry="6" fill="#1c1917"/>
        <ellipse cx="600" cy="275" rx="9" ry="6" fill="#1c1917"/>
        <path d="M 545 320 Q 570 345 595 320" stroke="#db2777" stroke-width="5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // scenic pair
  if (type === "scenic_pair") {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="60%" stop-color="#bae6fd" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
      </defs>
      <!-- Background: Mountain Landscape -->
      <rect width="900" height="900" fill="url(#skyGrad)"/>
      <polygon points="0,550 250,300 500,550" fill="#94a3b8"/>
      <polygon points="350,550 600,240 850,550" fill="#64748b"/>
      <polygon points="500,550 750,320 900,500 900,550" fill="#475569"/>
      <rect y="520" width="900" height="380" fill="#15803d"/>

      <!-- TWO PERSONS IN FOREGROUND -->
      <!-- Person A -->
      <path d="M 180 900 L 200 620 Q 230 520 340 520 Q 440 520 460 620 L 480 900 Z" fill="#dc2626"/>
      <rect x="315" y="470" width="50" height="60" rx="12" fill="#fde047"/>
      <ellipse cx="340" cy="400" rx="75" ry="95" fill="#fde047"/>
      <path d="M 265 370 Q 260 270 340 260 Q 420 270 415 370 Z" fill="#1e1b4b"/>

      <!-- Person B (standing side-by-side) -->
      <path d="M 440 900 L 460 620 Q 490 520 590 520 Q 690 520 710 620 L 730 900 Z" fill="#2563eb"/>
      <rect x="565" y="470" width="50" height="60" rx="12" fill="#fed7aa"/>
      <ellipse cx="590" cy="400" rx="75" ry="95" fill="#fed7aa"/>
      <path d="M 515 370 Q 510 270 590 260 Q 670 270 665 370 Z" fill="#451a03"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  return "";
}

// Helper to generate Group Photo SVG (4 people standing side by side in foreground)
function createGroupSampleSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="eventBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e1b4b" />
        <stop offset="100%" stop-color="#312e81" />
      </linearGradient>
      <linearGradient id="stageLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#818cf8" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <!-- Background: Event Stage / Conference Hall with Lighting -->
    <rect width="1200" height="800" fill="url(#eventBg)"/>
    <polygon points="200,0 400,0 550,550 50,550" fill="url(#stageLight)"/>
    <polygon points="800,0 1000,0 1150,550 650,550" fill="url(#stageLight)"/>
    <rect x="100" y="200" width="1000" height="60" fill="#3730a3" opacity="0.3" rx="8"/>
    <circle cx="150" cy="120" r="15" fill="#38bdf8" opacity="0.5"/>
    <circle cx="600" cy="90" r="25" fill="#c084fc" opacity="0.4"/>
    <circle cx="1050" cy="120" r="15" fill="#f472b6" opacity="0.5"/>
    <rect y="680" width="1200" height="120" fill="#090d16"/>

    <!-- FOREGROUND GROUP OF 4 PEOPLE (Team / Friends Group) -->

    <!-- Person 1 (Far Left) -->
    <g id="group-p1">
      <path d="M 80 800 L 100 520 Q 120 430 200 430 Q 280 430 300 520 L 320 800 Z" fill="#0284c7"/>
      <path d="M 175 430 L 200 520 L 225 430 Z" fill="#f0f9ff"/>
      <rect x="180" y="370" width="40" height="65" rx="10" fill="#fed7aa"/>
      <ellipse cx="200" cy="300" rx="70" ry="85" fill="#fed7aa"/>
      <path d="M 130 280 Q 130 180 200 170 Q 270 180 270 280 Q 240 190 200 190 Q 160 190 130 280 Z" fill="#1e293b"/>
      <ellipse cx="175" cy="295" rx="7" ry="5" fill="#0f172a"/>
      <ellipse cx="225" cy="295" rx="7" ry="5" fill="#0f172a"/>
      <path d="M 180 340 Q 200 360 220 340" stroke="#db2777" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Person 2 (Center-Left) -->
    <g id="group-p2">
      <path d="M 310 800 L 330 490 Q 360 400 460 400 Q 560 400 590 490 L 610 800 Z" fill="#4f46e5"/>
      <path d="M 430 400 L 460 490 L 490 400 Z" fill="#ffffff"/>
      <rect x="440" y="340" width="40" height="65" rx="10" fill="#fde047"/>
      <ellipse cx="460" cy="270" rx="75" ry="90" fill="#fde047"/>
      <path d="M 370 270 Q 370 140 460 135 Q 550 140 550 270 Q 580 380 540 460 Q 530 330 530 230 Q 460 160 390 230 Q 390 330 380 460 Z" fill="#713f12"/>
      <ellipse cx="435" cy="265" rx="7" ry="5" fill="#0f172a"/>
      <ellipse cx="485" cy="265" rx="7" ry="5" fill="#0f172a"/>
      <path d="M 440 310 Q 460 330 480 310" stroke="#dc2626" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Person 3 (Center-Right) -->
    <g id="group-p3">
      <path d="M 600 800 L 620 500 Q 650 410 740 410 Q 830 410 860 500 L 880 800 Z" fill="#16a34a"/>
      <path d="M 710 410 L 740 500 L 770 410 Z" fill="#f0fdf4"/>
      <rect x="720" y="350" width="40" height="65" rx="10" fill="#fed7aa"/>
      <ellipse cx="740" cy="280" rx="72" ry="88" fill="#fed7aa"/>
      <path d="M 660 260 Q 660 160 740 150 Q 820 160 820 260 Z" fill="#1c1917"/>
      <ellipse cx="715" cy="275" rx="7" ry="5" fill="#0f172a"/>
      <ellipse cx="765" cy="275" rx="7" ry="5" fill="#0f172a"/>
      <path d="M 720 320 Q 740 340 760 320" stroke="#db2777" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Person 4 (Far Right) -->
    <g id="group-p4">
      <path d="M 870 800 L 890 520 Q 910 430 990 430 Q 1070 430 1090 520 L 1110 800 Z" fill="#ea580c"/>
      <path d="M 965 430 L 990 520 L 1015 430 Z" fill="#fff7ed"/>
      <rect x="970" y="370" width="40" height="65" rx="10" fill="#ffedd5"/>
      <ellipse cx="990" cy="300" rx="70" ry="85" fill="#ffedd5"/>
      <path d="M 915 290 Q 915 170 990 165 Q 1065 170 1065 290 Q 1080 390 1055 460 Q 1045 340 1045 250 Q 990 190 935 250 Q 935 340 925 460 Z" fill="#312e81"/>
      <ellipse cx="965" cy="295" rx="7" ry="5" fill="#0f172a"/>
      <ellipse cx="1015" cy="295" rx="7" ry="5" fill="#0f172a"/>
      <path d="M 970 340 Q 990 360 1010 340" stroke="#dc2626" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: "sample-single",
    title: "บุคคลเดี่ยว (Single Portrait)",
    subtitle: "ภาพบุคคล 1 คนเดี่ยว ตัดแยกพื้นหลังกราฟิก",
    category: "single",
    thumbnail: createSampleSvg("single"),
    fullImage: createSampleSvg("single"),
  },
  {
    id: "sample-duo",
    title: "บุคคล 2 คนยืนติดกัน (Two People Together)",
    subtitle: "ภาพเพื่อน/คู่รัก 2 คนยืนชิดกันในสำนักงาน",
    category: "two_people",
    thumbnail: createSampleSvg("two_people"),
    fullImage: createSampleSvg("two_people"),
  },
  {
    id: "sample-group",
    title: "ภาพถ่ายหมู่คณะ (Team / Group Photo)",
    subtitle: "ภาพกลุ่มเพื่อน/ทีมงาน 4 คนยืนเรียงแถวหน้า",
    category: "group",
    thumbnail: createGroupSampleSvg(),
    fullImage: createGroupSampleSvg(),
  },
  {
    id: "sample-scenic",
    title: "คู่รัก/เพื่อนในวิวธรรมชาติ (Scenic Duo)",
    subtitle: "ภาพ 2 คนยืนหน้าวิวภูเขา ตัดเฉพาะบุคคล",
    category: "two_people",
    thumbnail: createSampleSvg("scenic_pair"),
    fullImage: createSampleSvg("scenic_pair"),
  },
];
