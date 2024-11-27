import { create } from 'zustand'
import toast from 'react-hot-toast'
import axiosInstance from '../lib/axios';


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
    }    
}))