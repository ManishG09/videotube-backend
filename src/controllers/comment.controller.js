import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from '../models/video.model'

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400, "Video Id are required");
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Video not found");
    }
    const skip = (page - 1) * limit;

    const videoComments = await Comment.find({ video: videoId }).skip(skip).limit(limit);

    res.status(200).json(new ApiResponse(200, videoComments, 'Comments retrieved successfully'));
});



const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if (!content || !videoId) {
        throw new ApiError(400, "Content and Video Id are required");
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }
    const comment = new Comment({
        content,
        video: videoId,
        owner: req.user._id
    })

    await comment.save()

    res.status(200).json(new ApiResponse(200, comment,'Comment added succesfully'))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentId} = req.params

    if (!content || !commentId) {
        throw new ApiError(400, "Content and Comment Id are required");
    }

    const comment = await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content,
        }
    }, { new: true } )

    res.status(200).json(new ApiResponse(200, comment, 'Comment deleted successfully'))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if (!commentId) {
        throw new ApiError(400,"Comment Id are required");
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    res.status(200).json(200, deletedComment,'Comment deleted succesfully')

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }