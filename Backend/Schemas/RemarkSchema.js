import mongoose from 'mongoose';

const schema = mongoose.Schema({
  RemarkDescription: {
    type: String,
    required: true
  },
  Rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  UpdatedAt: {
    type: Date,  // Changed from `String` to `Date`
    default: Date.now  // Automatically assign current timestamp
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  }
})

export default mongoose.model('remarks', schema)
