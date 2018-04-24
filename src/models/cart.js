import mongoose from 'mongoose';
import './products.js';

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  list: [{
    type: Schema.Types.ObjectId, ref: 'Products',
  }],
}, { collection: 'carts', strict: true });

CartSchema.methods.toJSON = function() {
  return this.list.map((product) => {
    return product.toJSON();
  });
};

export default mongoose.model('Cart', CartSchema);