import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    ProductItems: [{
        ProductID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        ProductQuantity: Number
    }],
    TotalAmount: {
        type: Number,
        required: true
    },
    OrderDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('orders', orderSchema);
