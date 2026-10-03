// Simple Cloudinary unsigned upload helper
// Fill these with your Cloudinary details
export const CLOUDINARY_CLOUD_NAME = 'dwfewacob';
export const CLOUDINARY_UPLOAD_PRESET = 'website_uploads';

// The image host accepts files up to 10MB. Larger photos stay at high quality
// and are scaled down only as far as needed to fit that limit.
const HOST_LIMIT = 9.5 * 1024 * 1024;
const HIGH_QUALITY = 0.92;

function isRasterImage(file) {
  return Boolean(file) && (file.type?.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i.test(file.name || ''));
}

function encodeHighQuality(bitmap, scale) {
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', HIGH_QUALITY));
}

export async function prepareImageForUpload(file) {
  if (!isRasterImage(file) || file.size <= HOST_LIMIT || typeof document === 'undefined') {
    return file;
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    const mb = Math.ceil(file.size / (1024 * 1024));
    throw new Error(`${file.name} is ${mb}MB. The image host only accepts 10MB, and this photo could not be prepared. Save it as a JPG and try again.`);
  }

  // Keep the original pixel size first. Scale down in small steps only if the
  // high-quality copy is still over the host limit.
  let scale = 1;
  let blob = await encodeHighQuality(bitmap, scale);
  while (blob && blob.size > HOST_LIMIT && scale > 0.5) {
    scale = Math.round((scale - 0.05) * 100) / 100;
    blob = await encodeHighQuality(bitmap, scale);
  }
  if (typeof bitmap.close === 'function') bitmap.close();

  if (!blob || blob.size > HOST_LIMIT) {
    throw new Error(`${file.name} is still over 10MB at high quality, so it could not be uploaded.`);
  }

  const base = (file.name || 'photo').replace(/\.[^.]+$/, '');
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
}

export async function uploadImageToCloudinary(file) {
  const prepared = await prepareImageForUpload(file);
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET ||
      CLOUDINARY_CLOUD_NAME.startsWith('REPLACE') || CLOUDINARY_UPLOAD_PRESET.startsWith('REPLACE')) {
    throw new Error('Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in src/utils/cloudinary.js');
  }

  // Use 'auto' so Cloudinary detects image/video automatically
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append('file', prepared);
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


