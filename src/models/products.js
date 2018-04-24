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

ProductsSchema.methods.toJSON = function() {
  const files = {};

  this.files.forEach((file) => {
    files[file.type] = true;
  });

  return {
    id: this._id,
    image: this.images[0] || null,
    url: this.url,
    name: this.name,
    price: this.price,
    files: Object.keys(files),
  };
};

ProductsSchema.methods.updateVisibility = function() {
  this.visible = !(this.deleted || !this.images.length || !this.files.length);
};

export default mongoose.model('Products', ProductsSchema);