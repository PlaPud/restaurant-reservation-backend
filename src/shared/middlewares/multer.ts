import multer from "multer";

export const uploadFile = multer({
  storage: multer.memoryStorage(), // Store files in memory for easier access
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
});
