import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
 // Apply verifyJWT middleware to all routes in this file


router.route("/c/:channelId").get(verifyJWT,getSubscribedChannels)
router.route("/c/:channelId").post(verifyJWT,toggleSubscription);
router.route("/u/:subscriberId").get(verifyJWT,getUserChannelSubscribers);

export default router