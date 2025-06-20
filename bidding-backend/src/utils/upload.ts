import multer from "multer";

const storage = multer.memoryStorage();

// Multer middleware to handle uploading up to 5 files with the field name "images".
export const uploadMultiple = multer({
  storage,
  limits: { files: 5 },
}).array("images", 5);
