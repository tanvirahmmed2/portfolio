import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_NAME, CLOUDINARY_API, CLOUDINARY_API_SECRET } from './secret.js';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});


export const uploadImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, {
      folder: 'portfolio',
      ...options
    }, (error, result) => {
      if (error) return reject(error);
      resolve({
        url: result.secure_url,
        image_id: result.public_id
      });
    });
  });
};


export const uploadImageBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio',
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          image_id: result.public_id
        });
      }
    );
    uploadStream.end(buffer);
  });
};


export const deleteImage = (imageId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imageId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default cloudinary;
