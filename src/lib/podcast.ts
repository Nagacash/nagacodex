/** Lyn T on Woodland 360. Part 1 stays the default player. */
export const woodland360Episodes = [
  {
    id: 'kFymYp734yk',
    label: 'Part 1',
    title: "Lyn T: Born in Liberia & Raised a Diplomat's Son, The Untold Story (Part 1)",
  },
  {
    id: 'qJ9Ev0X5D2g',
    label: 'Part 2',
    title: 'Woodland 360 - Podcast: Lyn T (2nd Part)',
  },
] as const;

export const woodland360FeaturedVideoId = woodland360Episodes[0].id;

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
