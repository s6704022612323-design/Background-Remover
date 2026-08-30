import { BackgroundPreset, MatteRefineOptions } from "../types";

export const DEFAULT_MATTE_OPTIONS: MatteRefineOptions = {
  smoothness: 1.2,
  edgeChoke: 0.2,
  decontamination: 75,
  hairDetail: 50,
  whiteGarmentProtect: true,
  whiteGarmentStrength: 80,
  presetId: "ultra_fine",
};

export const MATTE_PRESETS: {
  id: "ultra_fine" | "white_shirt" | "soft_hair" | "crisp_edge" | "id_photo" | "group_photo";
  name: string;
  description: string;
  iconName: string;
  options: MatteRefineOptions;
}[] = [
  {
    id: "ultra_fine",
    name: "สตูดิโอระดับเนียนสูงสุด (Studio Ultra-Fine)",
    description: "เก็บขอบเส้นผมละเอียด นุ่มนวล สมดุลเป็นธรรมชาติที่สุด",
    iconName: "Sparkles",
    options: {
      smoothness: 1.2,
      edgeChoke: 0.2,
      decontamination: 75,
      hairDetail: 50,
      whiteGarmentProtect: true,
      whiteGarmentStrength: 80,
      presetId: "ultra_fine",
    },
  },
  {
    id: "white_shirt",
    name: "คุ้มครองเสื้อสีขาว / ชุดนักเรียน (White Shirt & Uniform)",
    description: "แก้ปัญหาเสื้อขาวกลืนกับฉากหลัง คืนขอบเสื้อเชิ้ต ไหล่ คอปก และเนื้อผ้าขาวครบ 100%",
    iconName: "ShieldCheck",
    options: {
      smoothness: 1.0,
      edgeChoke: -0.1,
      decontamination: 35,
      hairDetail: 60,
      whiteGarmentProtect: true,
      whiteGarmentStrength: 95,
      presetId: "white_shirt",
    },
  },
  {
    id: "group_photo",
    name: "ภาพหมู่ / หลายคน (Group & Multi-Person)",
    description: "ตัดเก็บครบทุกคนในกลุ่ม ไม่ตัดกินแขน ไหล่ หรือปอยผมของคนที่ยืนชิดกัน",
    iconName: "Users",
    options: {
      smoothness: 1.0,
      edgeChoke: 0.1,
      decontamination: 75,
      hairDetail: 50,
      whiteGarmentProtect: true,
      whiteGarmentStrength: 75,
      presetId: "group_photo",
    },
  },
  {
    id: "soft_hair",
    name: "เน้นปอยผมพริ้วไหว (Soft Hair & Wisps)",
    description: "รักษารายละเอียดไรผมและเส้นผมเส้นเล็กๆ ไม่ให้ขาดหาย",
    iconName: "Feather",
    options: {
      smoothness: 0.8,
      edgeChoke: -0.3,
      decontamination: 60,
      hairDetail: 80,
      whiteGarmentProtect: true,
      whiteGarmentStrength: 70,
      presetId: "soft_hair",
    },
  },
  {
    id: "crisp_edge",
    name: "ขอบคมกริบ ไร้ขอบฟุ้ง (Crisp & Clean)",
    description: "ตัดขอบคมชัด ตัดแสงฟุ้งสีพื้นหลังเดิมออก 100%",
    iconName: "Scissors",
    options: {
      smoothness: 0.3,
      edgeChoke: 1.0,
      decontamination: 90,
      hairDetail: 10,
      whiteGarmentProtect: false,
      whiteGarmentStrength: 0,
      presetId: "crisp_edge",
    },
  },
  {
    id: "id_photo",
    name: "รูปถ่ายติดบัตรทางการ (Official ID Photo)",
    description: "ขอบเนียนเรียบร้อย ปกป้องเสื้อเชิ้ตและสูท เหมาะสำหรับทำรูปติดบัตร",
    iconName: "UserCheck",
    options: {
      smoothness: 1.4,
      edgeChoke: 0.3,
      decontamination: 70,
      hairDetail: 30,
      whiteGarmentProtect: true,
      whiteGarmentStrength: 85,
      presetId: "id_photo",
    },
  },
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "transparent", name: "โปร่งใส (PNG Transparent)", type: "transparent", value: "transparent" },
  { id: "white", name: "สีขาวบริสุทธิ์ (Pure White)", type: "solid", value: "#ffffff" },
  { id: "passport-blue", name: "สีฟ้าทำรูปติดบัตร (Passport Blue)", type: "solid", value: "#0284c7" },
  { id: "studio-gray", name: "สีเทาสตูดิโอ (Studio Slate)", type: "solid", value: "#1e293b" },
  { id: "warm-beige", name: "สีเบจอุ่น (Warm Cream)", type: "solid", value: "#fdf8f0" },
  { id: "pastel-pink", name: "สีชมพูพาสเทล (Pastel Rose)", type: "solid", value: "#fce7f3" },
  { id: "pastel-mint", name: "สีเขียวมิ้นต์ (Pastel Mint)", type: "solid", value: "#dcfce7" },
  { id: "grad-studio-dark", name: "สตูดิโอแสงสปอตไลท์ (Studio Dark)", type: "gradient", value: "radial-gradient(circle at 50% 40%, #334155 0%, #0f172a 100%)" },
  { id: "grad-sunset", name: "แสงอาทิตย์ตก (Sunset Glow)", type: "gradient", value: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)" },
  { id: "grad-ocean", name: "ไล่เฉดสีฟ้าคราม (Ocean Breeze)", type: "gradient", value: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { id: "blur-bg", name: "หน้าชัดหลังเบลอ (Portrait Bokeh)", type: "blur", value: "blur" },
];

/**
 * Load an image from data URL / URL into HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Convert file to base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Convert Blob to Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}

/**
 * Ultra-Fine Matte Refinement Engine (Anti-fringing, Hair detail enhancement, White Shirt Protection, Alpha Smoothing & Choke)
 */
export function refineCutoutMatte(
  cutoutImage: HTMLImageElement,
  originalImage: HTMLImageElement | null,
  options: MatteRefineOptions
): HTMLCanvasElement {
  const width = cutoutImage.naturalWidth || cutoutImage.width;
  const height = cutoutImage.naturalHeight || cutoutImage.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(cutoutImage, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Extract original image pixel data if available for White Shirt & Fabric Shield
  let origData: Uint8ClampedArray | null = null;
  if (originalImage) {
    try {
      const origCanvas = document.createElement("canvas");
      origCanvas.width = width;
      origCanvas.height = height;
      const origCtx = origCanvas.getContext("2d", { willReadFrequently: true });
      if (origCtx) {
        origCtx.drawImage(originalImage, 0, 0, width, height);
        origData = origCtx.getImageData(0, 0, width, height).data;
      }
    } catch (e) {
      console.warn("Could not read original image pixel data for white shirt recovery:", e);
    }
  }

  // Clone original alpha channel for mathematical filtering
  const originalAlpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    originalAlpha[i] = data[i * 4 + 3];
  }

  const {
    smoothness,
    edgeChoke,
    decontamination,
    hairDetail,
    whiteGarmentProtect = true,
    whiteGarmentStrength = 80,
  } = options;

  // 0. White Garment & Shirt Recovery Pass (Prevent white shirts on white/bright backgrounds from eroding)
  if (origData && (whiteGarmentProtect || (whiteGarmentStrength && whiteGarmentStrength > 0))) {
    const strengthRatio = Math.min(1, Math.max(0.2, (whiteGarmentStrength || 80) / 100));

    // Find subject vertical and horizontal envelope
    let minY = height,
      maxY = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (originalAlpha[y * width + x] > 50) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxY > minY) {
      // Focus on the torso, chest, collar, shoulders and arms region (from 15% below top of head down to bottom of subject)
      const torsoStart = Math.floor(minY + (maxY - minY) * 0.15);

      for (let y = torsoStart; y <= maxY; y++) {
        // Find left-most and right-most solid foreground pixels on this scanline
        let leftX = -1;
        let rightX = -1;
        for (let x = 0; x < width; x++) {
          if (originalAlpha[y * width + x] > 100) {
            if (leftX === -1) leftX = x;
            rightX = x;
          }
        }

        // Expand horizontal search by a buffer for white sleeves and shoulders
        const buffer = Math.floor(width * 0.08);
        const searchLeft = Math.max(0, leftX !== -1 ? leftX - buffer : 0);
        const searchRight = Math.min(width - 1, rightX !== -1 ? rightX + buffer : width - 1);

        for (let x = searchLeft; x <= searchRight; x++) {
          const idx = y * width + x;
          const pIdx = idx * 4;

          const oR = origData[pIdx];
          const oG = origData[pIdx + 1];
          const oB = origData[pIdx + 2];
          const brightness = (oR + oG + oB) / 3;
          const maxDiff = Math.max(Math.abs(oR - oG), Math.abs(oG - oB), Math.abs(oR - oB));

          // Detect white shirt / light uniform fabric characteristics:
          // Brightness > 160 and low chroma (neutral white/cream/light gray tone)
          const isWhiteFabric = brightness > 155 && maxDiff < 55;

          if (isWhiteFabric) {
            const currentAlpha = originalAlpha[idx];

            // If between left and right boundary of subject, restore lost shirt pixels
            const isInsideTorso = leftX !== -1 && rightX !== -1 && x >= leftX && x <= rightX;

            if (isInsideTorso && currentAlpha < 220) {
              const restoredAlpha = Math.round(255 * strengthRatio);
              originalAlpha[idx] = Math.max(originalAlpha[idx], restoredAlpha);
              data[pIdx] = oR;
              data[pIdx + 1] = oG;
              data[pIdx + 2] = oB;
              data[pIdx + 3] = originalAlpha[idx];
            } else if (currentAlpha > 0 && currentAlpha < 255) {
              // On outer edge of white sleeve/collar/shoulder, preserve shirt boundary
              const boostedAlpha = Math.min(255, Math.round(currentAlpha * (1 + strengthRatio * 0.6)));
              originalAlpha[idx] = boostedAlpha;
              data[pIdx + 3] = boostedAlpha;
            }
          }
        }
      }
    }
  }

  // 1. Edge Choke / Expand & Feather pass
  const refinedAlpha = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const alpha = originalAlpha[idx];

      if (alpha === 0) {
        refinedAlpha[idx] = 0;
        continue;
      }

      if (alpha === 255 && Math.abs(edgeChoke) < 0.1) {
        refinedAlpha[idx] = 255;
        continue;
      }

      // Calculate Choked Alpha
      let newAlpha = alpha;
      if (edgeChoke > 0) {
        // Shift alpha threshold inward to remove fringe halo
        const factor = 1 + edgeChoke * 0.35;
        newAlpha = Math.max(0, Math.min(255, (alpha - edgeChoke * 18) * factor));
      } else if (edgeChoke < 0) {
        // Expand alpha to recover thin wisps and clothing edges
        const expandFactor = 1 + Math.abs(edgeChoke) * 0.4;
        newAlpha = Math.min(255, alpha * expandFactor);
      }

      // Hair Detail Enhancement (S-curve contrast on mid-alpha values)
      if (hairDetail > 0 && newAlpha > 15 && newAlpha < 240) {
        const norm = newAlpha / 255;
        // Contrast enhancement
        const boost = (hairDetail / 100) * 0.45;
        const enhanced = norm < 0.5 ? Math.pow(norm, 1 + boost) : 1 - Math.pow(1 - norm, 1 + boost);
        newAlpha = Math.round(enhanced * 255);
      }

      refinedAlpha[idx] = Math.max(0, Math.min(255, newAlpha));
    }
  }

  // 2. Alpha Smoothness Filter (Separable Fast Box / Gaussian-like Blur)
  if (smoothness > 0.1) {
    const radius = Math.min(4, Math.round(smoothness));
    const tempAlpha = new Uint8Array(width * height);

    // Horizontal pass
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx >= 0 && nx < width) {
            sum += refinedAlpha[y * width + nx];
            count++;
          }
        }
        tempAlpha[y * width + x] = Math.round(sum / count);
      }
    }

    // Vertical pass
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          const ny = y + dy;
          if (ny >= 0 && ny < height) {
            sum += tempAlpha[ny * width + x];
            count++;
          }
        }
        // Preserve solid foreground
        if (originalAlpha[y * width + x] > 250) {
          refinedAlpha[y * width + x] = 255;
        } else {
          refinedAlpha[y * width + x] = Math.round(sum / count);
        }
      }
    }
  }

  // 3. Color Decontamination (Anti-Fringe & Despill pass)
  const decontamRatio = Math.min(1, Math.max(0, decontamination / 100));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = (y * width + x) * 4;
      const alpha = refinedAlpha[y * width + x];
      data[pIdx + 3] = alpha;

      // In transition boundary zones, decontaminate color fringe
      if (decontamRatio > 0 && alpha > 0 && alpha < 240) {
        // If this pixel is part of a white shirt, preserve clean white without dark tinting
        if (origData) {
          const oR = origData[pIdx];
          const oG = origData[pIdx + 1];
          const oB = origData[pIdx + 2];
          if ((oR + oG + oB) / 3 > 185 && Math.abs(oR - oG) < 35) {
            data[pIdx] = oR;
            data[pIdx + 1] = oG;
            data[pIdx + 2] = oB;
            continue;
          }
        }

        let innerR = 0,
          innerG = 0,
          innerB = 0,
          innerCount = 0;

        // Sample inward nearby solid foreground pixels
        const sampleRadius = 3;
        for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
          for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
            const sx = x + dx;
            const sy = y + dy;
            if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
              const sAlpha = originalAlpha[sy * width + sx];
              if (sAlpha > 220) {
                const sIdx = (sy * width + sx) * 4;
                innerR += data[sIdx];
                innerG += data[sIdx + 1];
                innerB += data[sIdx + 2];
                innerCount++;
              }
            }
          }
        }

        if (innerCount > 0) {
          const avgR = innerR / innerCount;
          const avgG = innerG / innerCount;
          const avgB = innerB / innerCount;

          // Blend current pixel towards true inner foreground color to eliminate halo
          const blendFactor = (1 - alpha / 255) * decontamRatio * 0.75;
          data[pIdx] = Math.round(data[pIdx] * (1 - blendFactor) + avgR * blendFactor);
          data[pIdx + 1] = Math.round(data[pIdx + 1] * (1 - blendFactor) + avgG * blendFactor);
          data[pIdx + 2] = Math.round(data[pIdx + 2] * (1 - blendFactor) + avgB * blendFactor);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Render cutout person with selected background onto a Canvas with studio lighting and shadow
 */
export async function renderCutoutWithBackground(
  cutoutCanvasOrImage: HTMLCanvasElement | HTMLImageElement,
  originalImage: HTMLImageElement | null,
  bgPreset: BackgroundPreset,
  customColor: string = "#3b82f6",
  options?: MatteRefineOptions,
  customBgImage?: HTMLImageElement | null
): Promise<HTMLCanvasElement> {
  const width =
    cutoutCanvasOrImage instanceof HTMLImageElement
      ? cutoutCanvasOrImage.naturalWidth || cutoutCanvasOrImage.width
      : cutoutCanvasOrImage.width;
  const height =
    cutoutCanvasOrImage instanceof HTMLImageElement
      ? cutoutCanvasOrImage.naturalHeight || cutoutCanvasOrImage.height
      : cutoutCanvasOrImage.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Draw Selected Background
  if (bgPreset.type === "solid") {
    ctx.fillStyle = bgPreset.id === "custom" ? customColor : bgPreset.value;
    ctx.fillRect(0, 0, width, height);
  } else if (bgPreset.type === "gradient") {
    if (bgPreset.id === "grad-studio-dark") {
      const radGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        10,
        width / 2,
        height * 0.4,
        width * 0.8
      );
      radGrad.addColorStop(0, "#334155");
      radGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = radGrad;
    } else if (bgPreset.id === "grad-sunset") {
      const linGrad = ctx.createLinearGradient(0, 0, width, height);
      linGrad.addColorStop(0, "#f97316");
      linGrad.addColorStop(1, "#ec4899");
      ctx.fillStyle = linGrad;
    } else {
      const linGrad = ctx.createLinearGradient(0, 0, width, height);
      linGrad.addColorStop(0, "#06b6d4");
      linGrad.addColorStop(1, "#3b82f6");
      ctx.fillStyle = linGrad;
    }
    ctx.fillRect(0, 0, width, height);
  } else if (bgPreset.type === "blur" && originalImage) {
    // Render blurred original background with custom strength
    const blurPx = options?.bokehBlurStrength !== undefined ? options.bokehBlurStrength : 24;
    ctx.save();
    ctx.filter = `blur(${Math.max(2, blurPx)}px) brightness(0.92)`;
    ctx.drawImage(originalImage, -30, -30, width + 60, height + 60);
    ctx.restore();
  } else if (bgPreset.id === "custom-image" && customBgImage) {
    // Draw user-uploaded custom background image covering the canvas
    const imgRatio = customBgImage.width / customBgImage.height;
    const canvasRatio = width / height;
    let dw = width, dh = height, dx = 0, dy = 0;
    if (imgRatio > canvasRatio) {
      dw = height * imgRatio;
      dx = (width - dw) / 2;
    } else {
      dh = width / imgRatio;
      dy = (height - dh) / 2;
    }
    ctx.drawImage(customBgImage, dx, dy, dw, dh);
  }
  // 'transparent' leaves the canvas background clear

  // 2. Realistic Studio Drop Shadow pass (if enabled)
  if (options?.dropShadow && bgPreset.type !== "transparent") {
    ctx.save();
    const shadowOpacity = options.shadowOpacity !== undefined ? options.shadowOpacity / 100 : 0.35;
    const shadowBlur = options.shadowBlur !== undefined ? options.shadowBlur : 20;
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;
    ctx.drawImage(cutoutCanvasOrImage, 0, 0, width, height);
    ctx.restore();
  }

  // 3. Draw Main Refined Cutout Subject
  ctx.drawImage(cutoutCanvasOrImage, 0, 0, width, height);

  // 4. Subtle Studio Rim Light Glow (if enabled)
  if (options?.rimLight && options.rimLight > 0 && bgPreset.type !== "transparent") {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    const rimIntensity = (options.rimLight / 100) * 0.4;
    ctx.fillStyle = `rgba(255, 255, 255, ${rimIntensity})`;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.drawImage(cutoutCanvasOrImage, 0, 0, width, height);
    ctx.restore();
  }

  return canvas;
}

/**
 * Trigger file download directly to user's device
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string = "person-cutout-ai.png",
  format: "image/png" | "image/jpeg" = "image/png"
) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL(format, 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
