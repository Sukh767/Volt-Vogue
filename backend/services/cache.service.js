import { redis } from "../lib/redis.js"
import Product from "../models/product.model.js"

async function updateFeaturedProductCache(){
    try {
        // .lean() is gonna return a plain javascript object instad of a mongodb document, which is good for perfomance
        const featuredProducts = await Product.find({isFeatured: true}).lean()
        await redis.set('featuredProducts', JSON.stringify(featuredProducts), 'EX', 60*60*1000)
    } catch (error) {
        console.log('error in update cache function', error)
    }
}

export default updateFeaturedProductCache