import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Validate productId
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Check if product already exists in the user's cart
    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // Increment quantity if the product is already in the cart
      existingItem.quantity += 1;
    } else {
      // Add new product to the cart
      user.cartItems.push({ productId, quantity: 1 });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart. Please try again later.",
      error: error.message,
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;

    if (!user.cartItems || user.cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty.",
        cartItems: [],
      });
    }
    const products = await Product.find({_id:{$in:req.user.cartItems}})

    // add quantity for each product
    const cartItems = products.map(product => {
        const item = req.user.cartItems.find(cartItem => cartItem.id === product.id)
        return {...product.toJSON(), quantity: item.quantity}
    })

    res.status(200).json({
      success: true,
      message: "Cart products fetched successfully.",
      cartItems
    });
  } catch (error) {
    console.error("Error in getCartProducts:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart products.",
      error: error.message,
    });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Filter out the product to be removed
    user.cartItems = user.cartItems.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully.",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Error in removeAllFromCart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart.",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // Extract productId from route parameters
    const { quantity } = req.body; // Extract quantity from the request body
    const user = req.user; // Get the logged-in user from middleware

    // Ensure quantity is provided and valid
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity. It must be at least 1.",
      });
    }

    // Find the product in the user's cart
    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        res.status(200).json({
          success: true,
          message: "Cart quantity updated successfully.",
          cartItems: user.cartItems,
        });
      }
    } else {
      // Update quantity or remove the product if quantity is 0
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Cart quantity updated successfully.",
        cartItems: user.cartItems,
      });
    }
  } catch (error) {
    console.error("Error in updateQuantity:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update cart quantity.",
      error: error.message,
    });
  }
};
