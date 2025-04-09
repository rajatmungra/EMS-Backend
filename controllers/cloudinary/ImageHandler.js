import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const publicId = `user_${req.user.id}_${uuidv4()}`;
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      public_id: publicId,
      folder: 'ems_uploads',
      overwrite: false,
      resource_type: 'auto'
    });

    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'No publicId provided' });
    }

    // Verify the image belongs to the requesting user
    // if (!publicId.startsWith(`user_${req.user.id}_`)) {
    //   return res.status(403).json({ error: 'Unauthorized to delete this image' });
    // }

    const result = await cloudinary.v2.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Image deletion failed' });
  }
};
