import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable large JSON payloads for base64 image data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Background Separation & Foreground People Segmentation Endpoint
app.post("/api/remove-background", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data" });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    const ai = getGenAI();

    // Call Gemini to identify foreground persons (single, double, or front-most group of people)
    // and provide ultra-accurate anatomical structure analysis, keypoint tagging, segmentation polygons, and mask metadata.
    const prompt = `You are a precision AI vision segmentation and human anatomy analysis engine.
Your task is to analyze this photo with extreme geometric precision for human foreground isolation, anatomical landmark tagging, and white/light clothing boundary separation.

COORDINATE SYSTEM DEFINITION:
- All coordinates are in a normalized 0-1000 integer grid where:
  * [0, 0] is the TOP-LEFT corner of the image.
  * [1000, 1000] is the BOTTOM-RIGHT corner of the image.
  * x is the horizontal coordinate from left (0) to right (1000).
  * y is the vertical coordinate from top (0) to bottom (1000).

CRITICAL INSTRUCTIONS:
1. Subject Isolation & White Garment Separation (สำคัญที่สุด):
   - Identify all PERSONS in the FOREGROUND plane (single portrait, couple/duo, or front-most members of a group).
   - SPECIAL ATTENTION FOR WHITE / LIGHT-COLORED CLOTHING:
     * When the subject is wearing a WHITE SHIRT, WHITE T-SHIRT, UNIFORM, STUDENT SHIRT, LAB COAT, or LIGHT GARMENT:
       You MUST clearly distinguish fabric texture, folds, seams, collar edges, shoulder slopes, sleeves, and waist hems from any white/light background or wall!
     * NEVER cut into, erode, or omit white shirts. The person's torso, chest, collar, and sleeves are 100% part of the subject foreground!
   - Discard background scenery, walls, furniture, sky, and floor.

2. Anatomical Landmark Tagging:
   - For EACH detected foreground person, detect the EXACT location of the following visible anatomical joints/landmarks on their body:
     * "head_crown": Top apex of head/hairline (x, y)
     * "face_jaw": Chin/jawline center (x, y)
     * "neck": Base of neck / clavicle notch (x, y)
     * "left_shoulder": The person's anatomical left shoulder joint (visible on image right from viewer's perspective)
     * "right_shoulder": The person's anatomical right shoulder joint (visible on image left from viewer's perspective)
     * "left_elbow": Anatomical left elbow joint
     * "right_elbow": Anatomical right elbow joint
     * "left_hand": Anatomical left wrist / hand center
     * "right_hand": Anatomical right wrist / hand center
     * "chest_torso": Center of upper chest / solar plexus (middle of shirt)
     * "waist_hip": Center of navel / shirt hem / waist
     * "left_hip": Anatomical left hip joint
     * "right_hip": Anatomical right hip joint
     * "left_knee": Anatomical left knee (if visible in portrait/crop; if cropped, estimate closest bottom edge)
     * "right_knee": Anatomical right knee (if visible)
     * "left_ankle": Anatomical left ankle (if visible)
     * "right_ankle": Anatomical right ankle (if visible)
   - Calibrate the landmarks to match the ACTUAL pose (portrait, half-body, seated, standing, leaning).
   - Assign status: "perfect_edge", "hair_refinement", "limb_protected", or "gap_cleared".

3. Silhouette Polygon & Bounding Box:
   - BoundingBox: tight box [ymin, xmin, ymax, xmax] encompassing the whole person(s) including hair and all white/colored clothing.
   - Polygons: array of [x, y] polygon points closely outlining the silhouette of the foreground person(s), fully wrapping around white shirts, collars, and sleeves without cutting into them.

4. Output valid JSON adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedPeopleCount: { type: Type.INTEGER },
            description: { type: Type.STRING },
            foregroundConfidence: { type: Type.NUMBER },
            subjectCategory: {
              type: Type.STRING,
              enum: ["single_person", "two_people", "group_foreground", "group_photo"],
            },
            keyHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            boundingBox: {
              type: Type.OBJECT,
              properties: {
                ymin: { type: Type.INTEGER },
                xmin: { type: Type.INTEGER },
                ymax: { type: Type.INTEGER },
                xmax: { type: Type.INTEGER },
              },
              required: ["ymin", "xmin", "ymax", "xmax"],
            },
            polygons: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER },
                },
              },
            },
            anatomyAnalysis: {
              type: Type.OBJECT,
              properties: {
                totalPeople: { type: Type.INTEGER },
                overallAnatomyScore: { type: Type.NUMBER },
                alignmentSummary: { type: Type.STRING },
                detectedGapsCount: { type: Type.INTEGER },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                persons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      personIndex: { type: Type.INTEGER },
                      label: { type: Type.STRING },
                      poseType: {
                        type: Type.STRING,
                        enum: ["portrait", "half_body", "full_body", "standing", "sitting", "group_member"],
                      },
                      poseDescription: { type: Type.STRING },
                      overallAlignmentScore: { type: Type.NUMBER },
                      keypoints: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            nameEn: { type: Type.STRING },
                            x: { type: Type.INTEGER },
                            y: { type: Type.INTEGER },
                            confidence: { type: Type.NUMBER },
                            bodyPart: { type: Type.STRING },
                            status: {
                              type: Type.STRING,
                              enum: ["perfect_edge", "hair_refinement", "limb_protected", "gap_cleared"],
                            },
                            description: { type: Type.STRING },
                          },
                          required: ["id", "name", "nameEn", "x", "y", "confidence", "bodyPart", "status", "description"],
                        },
                      },
                      segments: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            part: { type: Type.STRING },
                            nameTh: { type: Type.STRING },
                            confidence: { type: Type.NUMBER },
                            edgeAlignmentScore: { type: Type.NUMBER },
                            notes: { type: Type.STRING },
                          },
                          required: ["part", "nameTh", "confidence", "edgeAlignmentScore", "notes"],
                        },
                      },
                      integrityChecks: {
                        type: Type.OBJECT,
                        properties: {
                          headHairProtected: { type: Type.BOOLEAN },
                          shouldersAligned: { type: Type.BOOLEAN },
                          armGapsPerforated: { type: Type.BOOLEAN },
                          fingersPreserved: { type: Type.BOOLEAN },
                          clothingSeamsClean: { type: Type.BOOLEAN },
                        },
                        required: ["headHairProtected", "shouldersAligned", "armGapsPerforated", "fingersPreserved", "clothingSeamsClean"],
                      },
                    },
                    required: ["personIndex", "label", "poseType", "poseDescription", "overallAlignmentScore", "keypoints", "segments", "integrityChecks"],
                  },
                },
              },
              required: ["totalPeople", "overallAnatomyScore", "alignmentSummary", "persons"],
            },
          },
          required: ["detectedPeopleCount", "description", "subjectCategory", "boundingBox", "polygons"],
        },
      },
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/remove-background:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process AI background removal",
    });
  }
});

// Vite middleware / static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Background Remover server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
