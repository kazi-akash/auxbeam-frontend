const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Convert Laravel storage path to full URL
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) {
    return '/images/placeholder.png'; // Default placeholder
  }

  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Construct full URL
  return `${API_URL}/${cleanPath}`;
}

/**
 * Get optimized image URL with size parameters
 */
export function getOptimizedImageUrl(
  path: string | null | undefined,
  width?: number,
  height?: number
): string {
  const baseUrl = getImageUrl(path);
  
  if (!width && !height) return baseUrl;
  
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  return `${baseUrl}?${params.toString()}`;
}
