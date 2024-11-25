import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found in the database.",
      });
    }

    // Return products with a success message
    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products. Please try again later.",
      error: error.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // Check Redis cache for featured products
    const cachedFeaturedProducts = await redis.get("featuredProducts");

    if (cachedFeaturedProducts) {
      return res.status(200).json({
        success: true,
        message: "Featured products fetched successfully from cache.",
        products: JSON.parse(cachedFeaturedProducts),
      });
    }

    // Fetch featured products from MongoDB if not in cache
    // .lean() is gonna return a plain javascript object instad of a mongodb document, which is good for perfomance
    const featuredProducts = await Product.find({ isFeatured: true }).lean();

    // If no featured products are found, return a 404 response
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured products found.",
      });
    }

    // Store featured products in Redis for faster future access
    await redis.set(
      "featuredProducts",
      JSON.stringify(featuredProducts),
      "EX",
      3600 // Cache expires in 1 hour
    );

    res.status(200).json({
      success: true,
      message: "Featured products fetched successfully from the database.",
      products: featuredProducts,
    });
  } catch (error) {
    console.error("Error in featured products controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products. Please try again later.",
      error: error.message,
    });
  }
};


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount = 0,
      category,
      brand,
      stock,
      images,
    } = req.body;

    let uploadedImage = null;

    // Upload image to Cloudinary if provided
    if (images) {
      const cloudinaryResponse = await cloudinary.uploader.upload(images, {
        folder: 'products',
      });
      uploadedImage = cloudinaryResponse.secure_url;
    }

    // Create a new product in the database
    const product = await Product.create({
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      images: uploadedImage || '', // Set image URL or fallback to empty string
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create product. Please try again later.',
      error: error.message,
    });
  }
};
