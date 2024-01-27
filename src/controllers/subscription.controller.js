import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;  // Assuming you have the user ID from the authenticated user

    // Validate that channelId is provided
    if (!channelId) {
        throw new ApiError(400, 'Channel Id is required');
    }

    try {
        // Check if the user is already subscribed to the channel
        const existingSubscription = await Subscription.findOne({
            subscriber: subscriberId,
            channel: channelId,
        });

        if (existingSubscription) {
            // User is already subscribed, so unsubscribe
            await Subscription.findByIdAndDelete(existingSubscription._id);
            res.status(200).json(new ApiResponse(200, null, 'Unsubscribed successfully'));
        } else {
            // User is not subscribed, so subscribe
            const newSubscription = new Subscription({
                subscriber: subscriberId,
                channel: channelId,
            });

            await newSubscription.save();
            res.status(200).json(new ApiResponse(200, newSubscription, 'Subscribed successfully'));
        }
    } catch (error) {
        // Handle any errors that occur during the database operations
        console.error(error);  // Log the error for debugging
        throw new ApiError(500, 'Internal Server Error');
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(400," Channedl Id is required")
    }
    try {
        // Use MongoDB query to find subscribers for the given channel
        const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username avatar');

        // Return the list of subscribers
        res.status(200).json(new ApiResponse(200, subscribers, 'Subscribers fetched successfully'));
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error(error);  // Log the error for debugging
        throw new ApiError(500, 'Internal Server Error');
    }


})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
       // Validate that subscriberId is provided
       if (!subscriberId) {
        throw new ApiError(400, 'Subscriber Id is required');
    }

    try {
        // Use MongoDB query to find channels subscribed by the given user
        const subscribedChannels = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'username avatar');

        // Return the list of subscribed channels
        res.status(200).json(new ApiResponse(200, subscribedChannels, 'Subscribed channels fetched successfully'));
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error(error);  // Log the error for debugging
        throw new ApiError(500, 'Internal Server Error');
    }
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}