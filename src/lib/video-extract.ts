// Simple regex-based extractors for demo purposes
// In a real app, this would likely call a backend service or a robust specialized library

export interface VideoInfo {
  platform: 'youtube' | 'bilibili' | 'twitter' | 'tiktok' | 'instagram' | 'other';
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
}

export function detectPlatform(url: string): VideoInfo['platform'] {
  if (url.match(/(?:youtube\.com|youtu\.be)/)) return 'youtube';
  if (url.match(/bilibili\.com/)) return 'bilibili';
  if (url.match(/twitter\.com|x\.com/)) return 'twitter';
  if (url.match(/tiktok\.com/)) return 'tiktok';
  if (url.match(/instagram\.com/)) return 'instagram';
  return 'other';
}

export function extractVideoInfo(url: string): VideoInfo {
  const platform = detectPlatform(url);
  let id = '';
  let thumbnail = '';

  switch (platform) {
    case 'youtube':
      const ytMatch = url.match(/(?:v=|youtu\.be\/)([^&?]+)/);
      id = ytMatch ? ytMatch[1] : '';
      if (id) thumbnail = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
      break;
    case 'bilibili':
      const bMatch = url.match(/BV[a-zA-Z0-9]+/);
      id = bMatch ? bMatch[0] : '';
      break;
    case 'twitter':
      const tMatch = url.match(/status\/(\d+)/);
      id = tMatch ? tMatch[1] : '';
      break;
    default:
      id = url;
  }

  return {
    platform,
    id,
    url,
    thumbnail,
    title: `Video from ${platform} (${id})`
  };
}
