import React, { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'

const Category = () => {
    const {fetchProductsByCategory, products} = useProductStore()
    
    useEffect(()=>{
        fetchProductsByCategory('T-shirts')
    },[fetchProductsByCategory])

    console.log(products)
  return (
    <div>Category</div>
  )
}

export default Category