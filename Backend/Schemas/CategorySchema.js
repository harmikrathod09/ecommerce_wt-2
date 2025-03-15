import mongoose from 'mongoose';

const schema = mongoose.Schema({
    CategoryImage:String,
    CategoryName: String,
})

export default mongoose.model("categories",schema);