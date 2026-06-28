import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_NAME, CLOUDINARY_API, CLOUDINARY_API_SECRET } from './secret.js';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads an image (file path, base64 data URI, or remote URL) to Cloudinary.
 * @param {string} file - The file path, base64 data URI, or remote URL
 * @param {object} options - Additional Cloudinary upload options
 * @returns {Promise<object>} Upload result containing url and public_id (image_id)
 */
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

/**
 * Uploads an image buffer directly using upload_stream.
 * @param {Buffer} buffer - File buffer
 * @param {object} options - Additional Cloudinary upload options
 * @returns {Promise<object>} Upload result containing url and public_id (image_id)
 */
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

/**
 * Deletes an image from Cloudinary using its public_id (image_id).
 * @param {string} imageId - The public_id of the image to delete
 * @returns {Promise<object>} Delete result
 */
export const deleteImage = (imageId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imageId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default cloudinary;
