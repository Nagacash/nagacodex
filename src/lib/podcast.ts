/** Replace with your featured Woodland360 YouTube video ID (from youtube.com/watch?v=THIS_PART) */
export const woodland360FeaturedVideoId = 'kFymYp734yk';

export const woodland360 = {
  name: 'Woodland360',
  tagline: 'Urban culture // Hamburg frequency',
  description:
    'Conversations on counter-culture, tech, and city life in Hamburg. Recorded in the round, mixed for late-night listening.',
  youtubeChannelUrl: 'https://www.youtube.com/@Woodland360',
  youtubeVideoId: woodland360FeaturedVideoId,
  accent: '#D4A843',
} as const;

export function woodland360EmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}
