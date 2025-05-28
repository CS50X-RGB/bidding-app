import multer from "multer";

const storage = multer.memoryStorage();

export const uploadMultiple = multer({
  storage,
  limits: { files: 5 },
}).array("images", 5);
