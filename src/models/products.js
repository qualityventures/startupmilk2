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
  desc_raw: {
    type: String,
    trim: true,
  },
  desc_html: {
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

ProductsSchema.methods.toClientJSON = function() {
  const files = {};
  const downloads = [];

  this.files.forEach((file) => {
    if (!file.types) {
      return;
    }

    downloads.push({
      name: file.name,
      file_id: file.file_id,
      types: file.types,
    });

    file.types.forEach((type) => {
      files[type] = true;
    });
  });

  let image = null;
  let animation = null;

  if (this.images.length) {
    image = this.images[0].preview;

    if (this.images[0].animated) {
      animation = this.images[0].full;
    }
  }

  return {
    id: this._id,
    image,
    animation,
    images: this.images,
    url: this.url,
    name: this.name,
    desc: this.desc_html || this.desc_raw || this.desc,
    price: this.price,
    files: Object.keys(files),
    downloads,
  };
};

ProductsSchema.methods.updateVisibility = function() {
  this.visible = !(this.deleted || !this.images.length || !this.files.length);
};

export default mongoose.model('Products', ProductsSchema);
