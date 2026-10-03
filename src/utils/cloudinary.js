// Simple Cloudinary unsigned upload helper
// Fill these with your Cloudinary details
export const CLOUDINARY_CLOUD_NAME = 'dwfewacob';
export const CLOUDINARY_UPLOAD_PRESET = 'website_uploads';

// The image host accepts files up to 10MB. Larger photos stay at high quality
// and are scaled down only as far as needed to fit that limit.
const HOST_LIMIT = 9.5 * 1024 * 1024;
const HIGH_QUALITY = 0.92;
// Cloudinary stores videos up to 100MB. Stay a little under that after preparation.
const VIDEO_HOST_LIMIT = 95 * 1024 * 1024;

function isRasterImage(file) {
  return Boolean(file) && (file.type?.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i.test(file.name || ''));
}

function isVideoFile(file) {
  return Boolean(file) && (file.type?.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg|mkv)$/i.test(file.name || ''));
}

function evenSize(value) {
  return Math.max(2, Math.round(value / 2) * 2);
}

function preferredVideoBitrate(height) {
  if (height >= 1800) return 18000000;
  if (height >= 1000) return 8000000;
  if (height >= 700) return 5000000;
  return 2500000;
}

function heightForBitrate(bitsPerSecond) {
  if (bitsPerSecond >= 16000000) return 2160;
  if (bitsPerSecond >= 8000000) return 1080;
  if (bitsPerSecond >= 4500000) return 720;
  if (bitsPerSecond >= 2000000) return 480;
  return 360;
}

function planVideoEncode(width, height, duration) {
  const audioBits = 192000;
  const budget = Math.floor((VIDEO_HOST_LIMIT * 8) / Math.max(duration, 0.1)) - audioBits;
  const fullQuality = preferredVideoBitrate(height);
  if (budget >= fullQuality) {
    return { width: evenSize(width), height: evenSize(height), videoBitsPerSecond: fullQuality };
  }
  const fittedHeight = Math.min(height, heightForBitrate(budget));
  const scale = fittedHeight / height;
  const outHeight = evenSize(height * scale);
  const outWidth = evenSize(width * scale);
  return {
    width: outWidth,
    height: outHeight,
    videoBitsPerSecond: Math.max(800000, Math.min(budget, preferredVideoBitrate(outHeight)))
  };
}

function pickRecorderType() {
  const types = [
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];
  return types.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || '';
}

function loadVideoElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    video.onloadedmetadata = () => resolve({ video, url });
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name} could not be read for a high-quality copy.`));
    };
  });
}

function recordHighQualityVideo(video, plan, mimeType, duration) {
  let stop = () => {};
  const done = new Promise((resolve, reject) => {
    if (typeof video.captureStream !== 'function') {
      reject(new Error('This browser cannot prepare a smaller high-quality video copy.'));
      return;
    }

    let stream;
    let audioSource = null;
    let frame = 0;
    const stopDrawing = () => {
      if (frame) cancelAnimationFrame(frame);
    };

    if (plan.width === evenSize(video.videoWidth) && plan.height === evenSize(video.videoHeight)) {
      stream = video.captureStream();
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = plan.width;
      canvas.height = plan.height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      stream = canvas.captureStream(30);
      audioSource = video.captureStream();
      audioSource.getAudioTracks().forEach((track) => stream.addTrack(track));
      const draw = () => {
        if (video.ended) return;
        ctx.drawImage(video, 0, 0, plan.width, plan.height);
        frame = requestAnimationFrame(draw);
      };
      draw();
    }

    let recorder;
    try {
      recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: plan.videoBitsPerSecond,
        audioBitsPerSecond: 192000
      });
    } catch {
      try {
        recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: plan.videoBitsPerSecond
        });
      } catch {
        stopDrawing();
        stream.getTracks().forEach((track) => track.stop());
        audioSource?.getTracks().forEach((track) => track.stop());
        reject(new Error('The high-quality video copy could not be prepared.'));
        return;
      }
    }

    const chunks = [];
    const finish = () => {
      clearTimeout(limit);
      stopDrawing();
      stream.getTracks().forEach((track) => track.stop());
      audioSource?.getTracks().forEach((track) => track.stop());
    };
    const limit = setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
    }, Math.ceil(duration * 1000) + 2500);

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size) chunks.push(event.data);
    };
    recorder.onerror = () => {
      finish();
      reject(new Error('The high-quality video copy could not be prepared.'));
    };
    recorder.onstop = () => {
      finish();
      resolve(new Blob(chunks, { type: recorder.mimeType || mimeType }));
    };
    video.onended = () => {
      if (recorder.state !== 'inactive') recorder.stop();
    };
    stop = () => {
      if (recorder.state !== 'inactive') recorder.stop();
    };
    recorder.start(1000);
  });
  done.cancel = stop;
  return done;
}

export async function prepareVideoForUpload(file) {
  if (!isVideoFile(file) || file.size <= VIDEO_HOST_LIMIT || typeof document === 'undefined') {
    return file;
  }
  if (typeof MediaRecorder === 'undefined') {
    throw new Error(`${file.name} is over 100MB, and this browser cannot prepare a smaller high-quality copy.`);
  }

  const mimeType = pickRecorderType();
  if (!mimeType) {
    throw new Error(`${file.name} is over 100MB, and this browser cannot prepare a smaller high-quality copy.`);
  }

  const { video, url } = await loadVideoElement(file);
  try {
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(`${file.name} could not be prepared because its length could not be read.`);
    }
    const plan = planVideoEncode(video.videoWidth || 1280, video.videoHeight || 720, duration);
    video.currentTime = 0;
    const recording = recordHighQualityVideo(video, plan, mimeType, duration);
    try {
      await video.play();
    } catch {
      recording.cancel?.();
      throw new Error(`${file.name} could not be prepared because playback failed.`);
    }
    const blob = await recording;
    if (!blob || blob.size < 1024 || blob.size > 100 * 1024 * 1024) {
      throw new Error(`${file.name} is still over 100MB at high quality, so it could not be uploaded.`);
    }
    const ext = (blob.type || mimeType).includes('mp4') ? 'mp4' : 'webm';
    const base = (file.name || 'video').replace(/\.[^.]+$/, '');
    return new File([blob], `${base}.${ext}`, { type: blob.type || mimeType });
  } finally {
    video.pause();
    URL.revokeObjectURL(url);
  }
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
  const prepared = isVideoFile(file)
    ? await prepareVideoForUpload(file)
    : await prepareImageForUpload(file);
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


