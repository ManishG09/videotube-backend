import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
 // Apply verifyJWT middleware to all routes in this file

router.route("/").post(verifyJWT,createTweet);
router.route("/user/:userId").get(verifyJWT,getUserTweets);
router.route("/:tweetId").patch(verifyJWT,updateTweet)
router.route("/delete/:tweetId").delete(verifyJWT,deleteTweet);

export default router