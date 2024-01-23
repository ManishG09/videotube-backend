
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description){
        throw new ApiError(400, "All Fields are necessary")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalpath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath){
        throw new ApiError(400, "Video file is required")
    }
    if(!thumbnailLocalpath){
        throw new ApiError(400, "thumbnail file is required")
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalpath)

    const video = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration: uploadedVideo.duration
    })

    return res.status(201).json(new ApiResponse(200, video, "Video is Published succesfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log(videoId)
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(400," Video Id not found")
    }
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video  not found");
    }
    
    res.status(200).json( new ApiResponse(200, video, "Video fetched"))



})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params
    const { title , description} = req.body 
    if(!videoId){
        throw new ApiError(400,'Video id is not provided')
    }
    if(!title || !description){
        throw new ApiError(400,'All fields are required')
    }
    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail file is missing")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail.url){
        throw new ApiError(400,"Error while uploading on thumbnail")
    }
    const video = await Video.findByIdAndUpdate( videoId, {
        $set : {
            title,
            description,
            thumbnail: thumbnail.url
        }
    },
    {new:true}).select("-password")

    return res.status(200).json(new ApiResponse(200, video, "Video updated succesfully"))
})


const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400, "Video id is not provided")
    }
    const video = await Video.findByIdAndDelete(videoId)

    if(!video){
        throw new ApiError(400, "Video not found")
    }
    res.status(200).json(new ApiResponse(200, video, "Viedo is succesfully deleted"))
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}