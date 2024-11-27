import { uploadOnCloudinary } from '../lib/cloudinary.js'
import { redis } from '../lib/redis.js';
import Product from '../models/product.model.js';
import updateFeaturedProductCache from '../services/cache.service.js';

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: 'No products found in the database.',
      });
    }

    // Return products with a success message
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully.',
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products. Please try again later.',
      error: error.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // Check Redis cache for featured products
    const cachedFeaturedProducts = await redis.get('featuredProducts');

    if (cachedFeaturedProducts) {
      return res.status(200).json({
        success: true,
        message: 'Featured products fetched successfully from cache.',
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
        message: 'No featured products found.',
      });
    }

    // Store featured products in Redis for faster future access
    await redis.set(
      'featuredProducts',
      JSON.stringify(featuredProducts),
      'EX',
      3600 // Cache expires in 1 hour
    );

    res.status(200).json({
      success: true,
      message: 'Featured products fetched successfully from the database.',
      products: featuredProducts,
    });
  } catch (error) {
    console.error('Error in featured products controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products. Please try again later.',
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
      isFeatured = false,
    } = req.body;

    // console.log('Request body:', req.body);
    // console.log('Uploaded files:', req.files);

    if (!name || !description || !price || !category || !brand || !stock) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required.',
      });
    }

    let imageLocalPath = req.files.images;
    let imageArray = [];

    for (let i = 0; i < imageLocalPath.length; i++) {
      const imageLinks = imageLocalPath[i]?.path;
      // console.log('Image path:', imageLinks);
    
      const result = await uploadOnCloudinary(imageLinks);
      if (result) {
        imageArray.push({
          public_id: result.public_id, // Map public_id to publicId
          url: result.secure_url || result.url, // Use secure_url if available
        });
      } else {
        console.error(`Failed to upload image at index ${i}`);
      }
    }    

    if (imageArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to upload images to Cloudinary.',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      images: imageArray,
      isFeatured,
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

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Extract productId from the route parameters

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.images) {
      const publicId = product.images.split('/').pop().split('.')[0]; //this will get the id of the image

      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log('deleted image from the cloudinary');
      } catch (error) {
        console.log('delete product controller', error);
      }
    }

    // Delete the product from the database
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product. Please try again later.',
      error: error.message,
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    // Fetch 5 random products using MongoDB's $sample aggregation stage
    const recommendedProducts = await Product.aggregate([
      { $sample: { size: 5 } }, // Select 5 random documents
      {
        $project:{
          _id:1,
          name:1,
          description:1,
          images:1,
          price:1,
        }
      }
    ]);

    // Check if any products are returned
    if (recommendedProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No recommended products found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recommended products fetched successfully',
      data: recommendedProducts,
    });
  } catch (error) {
    console.error('Error fetching recommended products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommended products. Please try again later.',
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate the category parameter
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrog',
      });
    }

    // Fetch products by category
    const products = await Product.find({ category }).lean();

    // Check if products exist
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found for the category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Products for category '${category}' fetched successfully.`,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category. Please try again later.',
      error: error.message,
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Extract productId from the route parameters

    // Validate the productId parameter
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Toggle the isFeatured field
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    // Update the featured product cache
    await updateFeaturedProductCache();

    res.status(200).json({
      success: true,
      message: 'Product featured status toggled successfully.',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error in toggleFeaturedProduct:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status. Please try again later.',
      error: error.message,
    });
  }
};
