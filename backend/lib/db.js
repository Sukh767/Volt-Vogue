import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log(`\nMongoDB connected successfully!!\nDB HOST: ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log(`Error: ${err}`)
        process.exit(1); // 1 -> failure [ 0-> success ] 
    }
}
