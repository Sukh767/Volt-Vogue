import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Get analytics data
export const getAnalyticsData = async () => {
  try {
    const totalUsers = await User.countDocuments(); // Count total users
    const totalProducts = await Product.countDocuments(); // Count total products

    // Aggregate sales and revenue data
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null, // Group all orders together
          totalSales: { $sum: 1 }, // Total sales count
          totalRevenue: { $sum: "$totalAmount" }, // Total revenue sum
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    return {
      totalUsers,
      totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);
    throw new Error("Failed to fetch analytics data");
  }
};

// Get daily sales data
export const getDailySalesData = async (startDate, endDate) => {
    try {
      const dailySalesData = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate), // Filter by start date
              $lte: new Date(endDate), // Filter by end date
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
            sales: { $sum: 1 }, // Count sales
            revenue: { $sum: "$totalAmount" }, // Sum total revenue
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date (ascending)
        },
      ]);
  
      // Generate an array of dates between startDate and endDate
      const dateArray = getDatesInRange(startDate, endDate);
  
      // Map the dateArray to include daily sales and revenue
      const result = dateArray.map((date) => {
        const foundData = dailySalesData.find((item) => item._id === date);
  
        return {
          date,
          sales: foundData?.sales || 0,
          revenue: foundData?.revenue || 0,
        };
      });
  
      return result;
    } catch (error) {
      console.error("Error fetching daily sales data:", error.message);
      throw new Error("Failed to fetch daily sales data");
    }
  };
  
  // Helper function to generate a list of dates in a range
  function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
    }
  
    return dates;
  }
  
