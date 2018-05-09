import mongoose from 'mongoose';
import './products.js';

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  list: [{
    type: Schema.Types.ObjectId,
    ref: 'Products',
  }],
}, { collection: 'carts', strict: true });

CartSchema.methods.toJSON = function() {
  return {
    total: this.getPrice(),
    products: this.list.map((product) => {
      return product.toJSON();
    }),
  };
};

CartSchema.methods.getPrice = function() {
  let total = 0;

  this.list.forEach((product) => {
    total += product.price;
  });

  return Math.floor(total * 100) / 100;
};

export default mongoose.model('Cart', CartSchema);
