import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Product name must not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      validate: {
        validator: (value) => value > 0,
        message: "Price must be greater than zero",
      },
    },
    discount: {
      type: Number,
      default: 0, // Percentage discount (e.g., 10 for 10%)
      min: [0, "Discount cannot be less than 0"],
      max: [100, "Discount cannot exceed 100"],
    },
    category: {
      type: String,
      enum: [
        "Shirt",
        "Jeans",
        "T-shirts",
        "Shoes",
        "Glasses",
        "Jackets",
        "Suits",
        "Bags",
        "Smart phones",
      ],
      required: [true, "Product category is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be less than zero"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [0, "Rating cannot be less than 0"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
