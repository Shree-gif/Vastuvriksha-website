function mediaSrc(item) {
  return typeof item === 'string' ? item : (item?.src || '');
}

function mediaOrder(item, index) {
  if (typeof item === 'string') return index + 1;
  const order = Number(item?.order);
  return Number.isFinite(order) ? order : index + 1;
}

export function combinedGallery(images, videos) {
  const imageItems = (Array.isArray(images) ? images : []).map((item, listIndex) => ({
    kind: 'image',
    src: mediaSrc(item),
    order: mediaOrder(item, listIndex),
    listIndex
  }));
  const videoItems = (Array.isArray(videos) ? videos : []).map((item, listIndex) => ({
    kind: 'video',
    src: mediaSrc(item),
    order: mediaOrder(item, listIndex),
    listIndex
  }));
  const imageOrders = new Set(imageItems.map((item) => item.order));
  const sharesOrder = videoItems.some((item) => imageOrders.has(item.order));
  const byOrder = (list) => list.slice().sort((a, b) => a.order - b.order || a.listIndex - b.listIndex);
  if (sharesOrder || imageItems.length === 0 || videoItems.length === 0) {
    return [...byOrder(imageItems), ...byOrder(videoItems)];
  }
  return [...imageItems, ...videoItems].sort((a, b) => a.order - b.order || a.listIndex - b.listIndex);
}

export function applyGalleryOrder(items) {
  const images = [];
  const videos = [];
  items.forEach((item, index) => {
    const entry = { src: item.src || '', order: index + 1 };
    if (item.kind === 'video') videos.push(entry);
    else images.push(entry);
  });
  return { images, videos };
}

export function moveGalleryItem(images, videos, from, to) {
  const items = combinedGallery(images, videos);
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return null;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return applyGalleryOrder(next);
}

export function removeGalleryItem(images, videos, index) {
  const items = combinedGallery(images, videos);
  if (index < 0 || index >= items.length) return null;
  const next = items.filter((_, itemIndex) => itemIndex !== index);
  return applyGalleryOrder(next);
}

export function updateGallerySrc(images, videos, index, src) {
  const items = combinedGallery(images, videos);
  if (!items[index]) return null;
  const next = items.map((item, itemIndex) => (itemIndex === index ? { ...item, src } : item));
  return applyGalleryOrder(next);
}

export function appendGalleryItems(images, videos, kind, urls) {
  const items = combinedGallery(images, videos);
  urls.forEach((src) => items.push({ kind, src }));
  return applyGalleryOrder(items);
}

export function publicMediaList(project) {
  const images = Array.isArray(project?.images) && project.images.length > 0
    ? project.images
    : (project?.image ? [project.image] : []);
  return combinedGallery(images, project?.videos).map((item) => item.src).filter(Boolean);
}
