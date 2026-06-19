import mandeWebm from '../assets/clips/mande.webm';
import mandeH264 from '../assets/clips/mande-h264.mp4';
import introWebm from '../assets/clips/intro.webm';
import introH264 from '../assets/clips/intro-h264.mp4';

export const mandeFilm = {
  title: 'Mandé Oyapock',
  webm: mandeWebm,
  h264: mandeH264,
} as const;

export const heroIntro = {
  title: 'Hero Intro',
  webm: introWebm,
  h264: introH264,
} as const;
