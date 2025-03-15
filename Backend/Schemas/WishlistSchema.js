import mongoose from 'mongoose';

const schema = mongoose.Schema({
  ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
  },
  UserId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
  }
})

export default mongoose.model('wishlists', schema)
