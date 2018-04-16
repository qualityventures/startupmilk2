import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  url: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  files: [

  ],
  images: [

  ],
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'products', strict: true });


ProductsSchema.methods.updateVisibility = function() {
  this.visible = !(this.deleted || !this.images.length || !this.files.length);
};

export default mongoose.model('Products', ProductsSchema);