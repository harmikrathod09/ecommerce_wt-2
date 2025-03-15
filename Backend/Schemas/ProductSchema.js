import mongoose from 'mongoose';

const schema = mongoose.Schema({
    ProductImage:String,
    ProductName: String,
    ProductDescription:String,
    ProductPrice:Number,
    ProductQuantity:Number,
    ProductDiscount:Number,
    ProductPurchaseCount:Number,
    CategoryID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories"
    } 
})

export default mongoose.model("products",schema);