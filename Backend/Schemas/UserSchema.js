import mongoose from 'mongoose';

const schema = mongoose.Schema({
    UserProfileImage: String,
    UserName: String,
    UserEmail: String,
    UserPassword:String,
    UserContact: Number,
    UserAddress: String,
    UserCity:String,
    UserState:String,
    UserCountry:String,
    UserPincode:Number,
})

export default mongoose.model("users",schema);