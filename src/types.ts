export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export type Polygon = [number, number][];

export type AnatomyBodyPart =
  | "head_crown"
  | "face_jaw"
  | "hair_outline"
  | "neck"
  | "left_shoulder"
  | "right_shoulder"
  | "chest_torso"
  | "left_elbow"
  | "right_elbow"
  | "left_hand"
  | "right_hand"
  | "waist_hip"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle"
  | "right_ankle"
  | "garment_edge";

export interface AnatomyKeypoint {
  id: string;
  name: string; // Thai title e.g. "ไหล่ซ้าย (Left Shoulder)"
  nameEn: string;
  x: number; // 0 to 1000 normalized
  y: number; // 0 to 1000 normalized
  confidence: number; // 0.0 to 1.0
  bodyPart: AnatomyBodyPart;
  status: "perfect_edge" | "hair_refinement" | "limb_protected" | "gap_cleared";
  description: string;
  regionColor?: string;
}

export interface AnatomySegment {
  part: string;
  nameTh: string;
  confidence: number;
  edgeAlignmentScore: number; // 0 to 100
  notes: string;
}

export interface PersonAnatomy {
  personIndex: number;
  label: string; // e.g. "บุคคลที่ 1 (คนกลาง)", "บุคคลเดี่ยว"
  poseType: "portrait" | "half_body" | "full_body" | "standing" | "sitting" | "group_member";
  poseDescription: string;
  overallAlignmentScore: number; // e.g. 99.4
  keypoints: AnatomyKeypoint[];
  segments: AnatomySegment[];
  integrityChecks: {
    headHairProtected: boolean;
    shouldersAligned: boolean;
    armGapsPerforated: boolean;
    fingersPreserved: boolean;
    clothingSeamsClean: boolean;
  };
}

export interface AnatomyAnalysis {
  totalPeople: number;
  overallAnatomyScore: number;
  alignmentSummary: string;
  persons: PersonAnatomy[];
  detectedGapsCount: number;
  recommendations: string[];
}

export interface SegmentationData {
  detectedPeopleCount: number;
  description: string;
  foregroundConfidence?: number;
  subjectCategory: "single_person" | "two_people" | "group_foreground" | "group_photo";
  keyHighlights?: string[];
  boundingBox?: BoundingBox;
  polygons?: Polygon[];
  anatomyAnalysis?: AnatomyAnalysis;
}

export type BackgroundType = "transparent" | "solid" | "gradient" | "blur" | "custom";

export interface BackgroundPreset {
  id: string;
  name: string;
  type: BackgroundType;
  value: string;
  previewClass?: string;
}

export interface MatteRefineOptions {
  smoothness: number; // 0 to 5 (feather radius)
  edgeChoke: number; // -3 to 3 (contraction / expansion)
  decontamination: number; // 0 to 100% (anti-fringe & background color despill)
  hairDetail: number; // 0 to 100% (sharpness enhancement in semi-transparent wisps)
  whiteGarmentProtect?: boolean; // Protect white shirts, uniforms, light clothing from being cut or erased
  whiteGarmentStrength?: number; // 0 to 100% (White clothing edge recovery intensity)
  anatomyGuideLock?: boolean; // Anatomy-guided edge protection for hands & shoulders
  rimLight?: number; // 0 to 100% (Studio rim light wrap)
  dropShadow?: boolean; // Realistic shadow
  shadowBlur?: number; // Shadow blur
  shadowOpacity?: number; // Shadow opacity
  bokehBlurStrength?: number; // 0 to 40px blur
  presetId?: "ultra_fine" | "white_shirt" | "soft_hair" | "crisp_edge" | "id_photo" | "group_photo" | "custom";
}

export interface SampleImage {
  id: string;
  title: string;
  subtitle: string;
  category: "single" | "two_people" | "group";
  thumbnail: string;
  fullImage: string;
}

export type AppStep = "guide" | "upload" | "processing" | "result";

