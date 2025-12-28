import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: any) {}

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'bflexi',
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  async uploadFromUrl(imageUrl: string, folder?: string): Promise<any> {
    return cloudinary.uploader.upload(imageUrl, {
      folder: folder || 'bflexi',
    });
  }

  // Generate optimized image URL
  getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    const transformation: any = {};
    if (width) transformation.width = width;
    if (height) transformation.height = height;
    transformation.quality = 'auto';
    transformation.fetch_format = 'auto';

    return cloudinary.url(publicId, { transformation });
  }
}