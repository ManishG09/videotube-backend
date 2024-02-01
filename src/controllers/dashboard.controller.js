import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    try{
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?.id
    const videoStats = await Video.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: null,
                totalVideoViews: { $sum: "$views" }, // Replace with the actual field name
                totalVideos: { $sum: 1 } // Assuming each document represents a video
            }
        }
    ]); 
    const subscriptionStats = await Subscription.aggregate([
        {
            $match: {
                channel: userId
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: { $sum: 1 }
            }
        }
    ]);

    // Aggregating like statistics
    const likeStats = await Like.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        }
    ]);

    // Combine the aggregated statistics from different models
    const combinedStats = {
        totalVideoViews: videoStats.length > 0 ? videoStats[0].totalVideoViews : 0,
        totalSubscribers: subscriptionStats.length > 0 ? subscriptionStats[0].totalSubscribers : 0,
        totalVideos: videoStats.length > 0 ? videoStats[0].totalVideos : 0,
        totalLikes: likeStats.length > 0 ? likeStats[0].totalLikes : 0
    };

    // Respond with the retrieved channel statistics
    res.status(200).json(combinedStats);
} catch (error) {
    // Handle errors and send an appropriate response
    res.status(error.statusCode || 500).json({
        error: error.message || "Internal Server Error"
    });
}
});



const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }