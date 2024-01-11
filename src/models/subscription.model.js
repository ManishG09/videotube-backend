import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    subcriber:{
        type: mongoose.Schema.Types.ObjectId,  // Who is subscribing
        ref: "User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,  // chennel that got subscribed
        ref: "User"
    }
},{timestamps:true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)