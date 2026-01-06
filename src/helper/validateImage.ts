export function validateImage(
  file: File,
  field: string,
  types = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"],
  maxSize = 5 * 1024 * 1024
) {
  if (!types.includes(file.type)) {
    return {
      [field]: [`Invalid file type (${file.type}). Only JPEG, PNG, WEBP, JPG and GIF are allowed.`],
    };
  }

  if (file.size > maxSize) {
    return {
      [field]: ["File size exceeds the 5MB limit."],
    };
  }

  return null;
}
