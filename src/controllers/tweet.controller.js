import mongoose from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId = req.user._id
    if(!userId){
        throw new ApiError(400, "User ID is missing")
    }
    const owner = await User.findById(userId)

    if (!owner) {
        throw new ApiError(400, "User not found");
    }

    const tweet = new Tweet({
        content,
        owner
    })
    res.status(200).json(new ApiResponse(200, tweet, "Tweet Created succefully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id
    if(!userId){
        throw new ApiError(400, "User ID is missing")
    }
    const owner = await User.findById(userId)

    if (!owner) {
        throw new ApiError(400, "User not found");
    }
    const tweets = await Tweet.find({owner})

    const tweetIds = tweets.map((tweet) => tweet._id)

    res.status(200).json(new ApiResponse(200, tweetIds, "Tweet Created succefully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "Tweet ID is missing")
    }
    const tweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set:{
            content,
            owner : req.user._id
        }
    }, { new: true })
    if(!tweet){
        throw new ApiError(400, "Tweet not found")
    }
    res.status(200).json(new ApiResponse(200, tweet, "Tweet Created succefully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "Tweet ID is missing")
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(400, "Tweet not found")
    }
    res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted succefully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}