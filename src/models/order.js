import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  email: {
    type: String,
    index: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  list: [{
    type: Schema.Types.ObjectId, ref: 'Products',
  }],
  price: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  stripe_token: {
    type: String,
  },
  stripe_charge: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'orders', strict: true });

export default mongoose.model('Order', OrderSchema);