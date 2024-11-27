import { create } from 'zustand'
import toast from 'react-hot-toast'
import axiosInstance from '../lib/axios';
import axios from 'axios';


export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    setProducts:(products) => set({products}),

    createProduct: async (formData) => {
        set({ loading: true });
        try {                
            const response = await axiosInstance.post('/products/create-product', formData);
    
            set((prevState) => ({
                products: [...prevState.products, response.data.product],
                loading: false,
            }));
            toast.success('Product created successfully');
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || 'Error creating product');
        }
    },
    fetchAllProduct:async()=>{
        set({loading: true})
        try {
            const response = await axiosInstance('/products')
            set({products: response.data.products, loading: false})
        } catch (error) {
            set({error: 'Failed load product', loading: false})
            console.log(error)
            toast.error('Failed to load data, try again later')
        }
    },    
    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
          await axiosInstance.delete(`/products/${productId}`); // Ensure DELETE method is used
          set((prevProducts) => ({
            products: prevProducts.products.filter((product) => product._id !== productId),
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          console.error("Error deleting product:", error?.response?.data?.message || error.message);
          toast.error("Failed to delete product. Please try again later.");
        }
      },
      
      toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
          const response = await axiosInstance.patch(`/products/${productId}`); // Adjust endpoint if needed
          set((prevProducts) => ({
            products: prevProducts.products.map((product) =>
              product._id === productId
                ? { ...product, isFeatured: response.data.isFeatured }
                : product
            ),
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          console.error("Error toggling featured status:", error?.response?.data?.message || error.message);
          toast.error("Failed to update product featured status. Please try again later.");
        }
      },
      
      fetchProductsByCategory: async(category) => {
        set({loading: true})
        try {
            const response = await axiosInstance.get(`/products/category/${category}`)
            set({ products: response.data.data, loading: false})
        } catch (error) {
            set({ loading: false });
          console.error("Error fetch category data:", error?.response?.data?.message || error.message);
          toast.error("Failed to load data. Please try again later.");
        }
      }
}))