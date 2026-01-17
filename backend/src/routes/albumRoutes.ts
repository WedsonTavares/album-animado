import { Router } from "express";
import {
  createAlbum,
  deleteAlbum,
  getAlbum,
  listAlbums,
  updateAlbum,
  toggleShareAlbum,
  getPublicAlbum,
} from "../controllers/albumController";
import { addPhotos } from "../controllers/photoController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../config/upload";

const router = Router();

// Public route - no auth required
router.get("/public/albums/:token", getPublicAlbum);

// Protected routes
router.use(authMiddleware);

router.get("/", listAlbums);
router.post("/", createAlbum);
router.get("/:id", getAlbum);
router.put("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);
router.post("/:id/share", toggleShareAlbum);
router.post("/:albumId/photos", upload.array("files", 10), addPhotos);

export default router;
