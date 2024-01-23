import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT } from '../middlewares/auth.midlleware.js';
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/").get(verifyJWT , getAllVideos)
router.route("/publish").post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );
router.route("/c/:videoId").get(verifyJWT, getVideoById)
router.route("/delete/:videoId").delete(verifyJWT,deleteVideo)
router.route("/update/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router