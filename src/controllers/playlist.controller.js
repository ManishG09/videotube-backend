import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description){
        throw new ApiError(400,"All fields are required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })
   
    res.status(200).json(ApiResponse(200, playlist,"Playlist is created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId){
        throw new ApiError(400, "User id is not provide")
    }

    const playlist = await Playlist.find({owner : userId})

    res.status(200).json(ApiResponse(200, playlist,"Playlist fetched "))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400, "plylist id is required")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist id not found");
    }

    res.status(200).json(ApiResponse(200, playlist,"Playlist fetched "))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!videoId || !playlistId ){
        throw new ApiError(400, "Both videoId and playlistId are required")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $addToSet:{
            videos: videoId
        }
    },{new:true})
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    res.status(200).json(ApiResponse(200, playlist,"Video added to playlist sucessfull "))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!videoId || !playlistId ){
        throw new ApiError(400, "Both videoId and playlistId are required")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{
            videos: videoId
        }
    },{new:true})
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    res.status(200).json(ApiResponse(200, playlist,"Video removed from playlist sucessfully "))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new ApiError(400, "plylist id is required")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }


    res.status(200).json(ApiResponse(200, playlist,"Playlist deleted Successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!playlistId){
        throw new ApiError(400, "plylist id is required")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set:{
            description,
            name
        }
    },{ new: true })
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }


    res.status(200).json(ApiResponse(200, playlist,"Playlist updated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}