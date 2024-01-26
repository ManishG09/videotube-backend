import mongoose from "mongoose"
import {Like} from "../models/like.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id
    //TODO: toggle like on video

    if(!videoId){
        throw new ApiError(400, " Video Id not provide")
    }
    const isLiked = await Like.exists({video: videoId, likedBy: userId})

    if(isLiked){
        await Like.findOneAndDelete({video: videoId , likedBy: userId})
    }else {
        const like = new Like({video: videoId , likedBy: userId})
        await like.save()
    }
    res.status(200).json(new ApiResponse(200, video, 'Like status toggled successfully'))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const {commentId} = req.params
    //TODO: toggle like on comment

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const isLiked = await Like.exists({comment: commentId, likedBy: userId})

    if(isLiked){
        await Like.findOneAndDelete({comment: commentId, likedBy: userId})
    }else {
        const like = new Like({comment: commentId, likedBy: userId})
        await like.save()
    }
    res.status(200).json(new ApiResponse(200, comment, 'Like status toggled successfully'))
 

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet
    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const isLiked = await Like.exists({tweet: tweetId, likedBy: userId})

    if(isLiked){
        await Like.findOneAndDelete({tweet: tweetId, likedBy: userId})
    }else {
        const like = new Like({tweet: tweetId, likedBy: userId})
        await like.save()
    }
    res.status(200).json(new ApiResponse(200, tweet, 'Like status toggled successfully'))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id

    if(!userId){
        throw new ApiError(400, " User Id not provide")
    }
    const isLiked = await Like.find({ likedBy: userId})

    const videoIds = isLiked.map((entry) => entry.video )

    const likedVideo = await Video.find({_id : {in : videoIds}})

    res.status(200).json(new ApiResponse(200, likedVideo, 'Like status toggled successfully'))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}