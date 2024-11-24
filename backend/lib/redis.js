import Redis from "ioredis"
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.JWT_ACCESS_TOKEN_SECRET || !process.env.JWT_REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets are missing. Please set them in your .env file.");
}
if (!process.env.UPSTASH_REDIS_URL) {
    throw new Error("Redis URL is missing. Please set UPSTASH_REDIS_URL in your .env file.");
}

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
