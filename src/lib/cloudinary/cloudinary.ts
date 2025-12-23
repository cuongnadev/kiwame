import { v2 as cloudinary } from 'cloudinary';
import { kiwameConfig } from '@/config/kiwame.config';
export function createCloudinary(){
    cloudinary.config({
        cloud_name: kiwameConfig.cloudinaryCloudName,
        api_key: kiwameConfig.cloudinaryApiKey,
        api_secret: kiwameConfig.cloudinaryApiSecret,
        secure: true,
    })
    return cloudinary
}