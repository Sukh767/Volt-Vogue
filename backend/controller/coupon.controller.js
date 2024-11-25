import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    // Find an active coupon for the logged-in user
    const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "No active coupon found for the user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Active coupon retrieved successfully.",
      coupon,
    });
  } catch (error) {
    console.error("Error in getCoupon:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve coupon.",
      error: error.message,
    });
  }
};

export const validateCoupon = async (req,res)=>{
    try {
        const { code } = req.body

        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true})
        
        if(!coupon){
            return res.status(404).json({success: false, message: 'Coupon not found'})
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save()
            return res.status(404).json({
                success: false, 
                message: 'Coupon exired'
            })
        }

        res.status(200).json({
            success: true,
            message: 'coupon is valid',
            discountPercentage: coupon.discountPercentage,
        })
    } catch (error) {
        console.log('Error in validateCoupon', error)
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}