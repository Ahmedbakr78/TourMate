import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import env from '../config/env.js';
import { ApiError, httpStatus } from '../utils/apiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../', env.upload.dir);

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const imageFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new ApiError(httpStatus.UNPROCESSABLE, 'Only image files are allowed'), false);
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: env.upload.maxFileSizeMb * 1024 * 1024 },
});

export function publicUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

export function deleteFile(filename) {
  if (!filename) return;
  const full = path.join(uploadDir, path.basename(filename));
  if (fs.existsSync(full)) fs.unlinkSync(full);
}
