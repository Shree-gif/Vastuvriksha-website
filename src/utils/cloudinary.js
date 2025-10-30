// Simple Cloudinary unsigned upload helper
// Fill these with your Cloudinary details
export const CLOUDINARY_CLOUD_NAME = 'dwfewacob';
export const CLOUDINARY_UPLOAD_PRESET = 'website_uploads';

export async function uploadImageToCloudinary(file) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET ||
      CLOUDINARY_CLOUD_NAME.startsWith('REPLACE') || CLOUDINARY_UPLOAD_PRESET.startsWith('REPLACE')) {
    throw new Error('Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in src/utils/cloudinary.js');
  }

  // Use 'auto' so Cloudinary detects image/video automatically
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  // json.secure_url is the public HTTPS URL
  return json.secure_url;
}


