import mongoose from 'mongoose';

const schema = mongoose.Schema({
  RemarkDescription: String,
  Rating: Number,
  UpdatedAt: String,
  UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
  },
  ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
  }
})

export default mongoose.model('remarks', schema)
