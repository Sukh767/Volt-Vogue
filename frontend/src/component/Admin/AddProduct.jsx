import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from 'lucide-react';
import { useProductStore } from "../../stores/useProductStore";

export default function Component() {
  const { createProduct, loading } = useProductStore()
  const [image, setImage] = useState([]);
  const categories = [
    "Jeans",
    "T-shirts",
    "Shoes",
    "Glasses",
    "Jackets",
    "Suits",
    "Bags",
    "Smart phones",
  ];
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: 'T-shirt', //By-default category t-shirt
    brand: '',
    stock: '',
    isFeatured: false,
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  const removeImage = (index) => {
    setImage(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

  const formData = new FormData();
  Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
  Array.from(image).forEach(file => formData.append('images', file));

    
    console.log('add product',formData)
    try {
      await createProduct(formData);
      //Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: 'T-shirt',
        brand: '',
        stock: '',
        isFeatured: false,
      });
      setImage([]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>
      <form onSubmit={submitHandler} className="space-y-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={onChangeHandler}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={onChangeHandler}
            rows={3}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={onChangeHandler}
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={onChangeHandler}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-300">
            Product Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={newProduct.brand}
            onChange={onChangeHandler}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-300">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={newProduct.stock}
            onChange={onChangeHandler}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-300">
            Discount on product
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={newProduct.discount}
            onChange={onChangeHandler}
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <div className="mt-2">
            <div className="flex items-center mb-2">
              <input
                type="file"
                id="image"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={(e) => setImage(Array.from(e.target.files))}
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center"
              >
                <Upload className="h-5 w-5 inline-block mr-2" />
                Upload Images
              </label>
              {image.length > 0 && (
                <span className="ml-3 text-sm text-gray-400">
                  {image.length} image(s) selected
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {image.map((file, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border rounded overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-bl"
                    onClick={() => removeImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Loading...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}