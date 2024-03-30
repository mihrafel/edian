/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { v2 as cloudinary } from 'cloudinary';
import config from '../../../config';
import { CloudinaryUploadFile } from './product.interfaces';

import { Request } from 'express';
import multer from 'multer';
import { z } from 'zod';

type MulterRequest = Request & { files: Express.Multer.File[] };

const storage = multer.memoryStorage();

const fileFilter = (
  req: MulterRequest,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const maxFiles = 4;
  if (req.files.length > maxFiles) {
    console.log(req.files.length);
    // throw new Error(`Max files ${maxFiles}`);
    callback(
      new Error(`Number of ${maxFiles} files exceeds the limit`) as any,
      false
    );
    // Indicate that there's an error, but pass null as the first argument
    // callback(null, false);
  } else {
    // Continue with the default behavior
    callback(null, true);
  }
};

export const configureProductImagesUpload = () =>
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 4,
    },
  }).array('productImages', 4);

export const configureShopperImagesUpload = () =>
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 2, // Adjust the limit for the number of files to 2
    },
  }).fields([
    { name: 'picture', maxCount: 1 },
    { name: 'tradeLicensePicture', maxCount: 1 },
  ]);
export const configureEmployeeImagesUpload = () =>
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 1, // Adjust the limit for the number of files to 2
    },
  }).fields([{ name: 'nidImage', maxCount: 1 }]);

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions

export const cloudinaryUploadFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number(),
});

export const validateCloudinaryUploadFile = (
  file: CloudinaryUploadFile
): void => {
  // Validate the file against the schema
  cloudinaryUploadFileSchema.parse(file);

  // Validate the file mimetype
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Only JPG, PNG, and WEBP are allowed.`);
  }
};

export const uploadToCloudinary = async (
  files: CloudinaryUploadFile[]
): Promise<{ public_id: string; secure_url: string }[]> => {
  // Validate each file before processing
  files.forEach(validateCloudinaryUploadFile);

  const uploadPromises = files.map(file => {
    return new Promise<{ public_id: string; secure_url: string }>(
      (resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: 'product-images' },
          (error, result: any) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
              });
            }
          }
        );

        upload_stream.end(file.buffer);
      }
    );
  });

  try {
    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  } catch (error) {
    throw new Error(
      `Failed to upload images to Cloudinary: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

export const deleteCloudinaryFiles = async (
  files: CloudinaryUploadFile[]
): Promise<void> => {
  const deletePromises = files.map(file => {
    if (!file.public_id) {
      // Skip files without public_id
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      // Use the Cloudinary API to delete the file by its public ID
      const publicId: string | undefined = file.public_id; // Allow undefined
      if (publicId === undefined) {
        // Skip files with undefined public_id
        return resolve();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cloudinary.uploader.destroy(publicId, (error: any, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  try {
    await Promise.all(deletePromises);
  } catch (error: any) {
    throw new Error(`Error deleting Cloudinary files ${error}`);
  }
};

//file excel

const fileExcelFilter = (
  req: MulterRequest,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const maxFiles = 1;

  // Check if req.files is defined, and use its length or default to 1
  const numFiles = req.files ? req.files.length : 1;

  if (numFiles > maxFiles) {
    console.log(numFiles);
    callback(
      new Error(`Number of files exceeds the limit (${maxFiles})`) as any,
      false
    );
  } else {
    callback(null, true);
  }
};
export const validateCloudinaryFile = (file: CloudinaryUploadFile): void => {
  // Validate the file against the schema
  cloudinaryUploadFileSchema.parse(file);

  // Validate the file mimetype
  const allowedFileTypes = ['application/vnd.ms-excel', 'text/csv'];
  if (!allowedFileTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only CSV and Excel files are allowed.');
  }
};
export const configureProductFileUpload = () =>
  multer({
    storage: storage,
    fileFilter: fileExcelFilter,
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 1,
    },
  }).single('file');

export const uploadFileToCloudinary = async (
  file: CloudinaryUploadFile
): Promise<{ public_id: string; secure_url: string }> => {
  return new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: 'product-files', resource_type: 'raw' }, // Set resource_type to 'raw'
        (error, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          }
        }
      );

      upload_stream.end(file.buffer);
    }
  );
};

// Function to delete an Excel file from Cloudinary
export const deleteExcelFromCloudinary = async (
  publicId: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
