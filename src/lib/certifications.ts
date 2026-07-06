import aiManagerCert from '../assets/certifications/Ai Manager.png';
import cyberCert from '../assets/certifications/cyber certi.png';
import webDevCert from '../assets/certifications/web dev.png';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  completed: string;
  detail: string;
  image: string;
  accentClass: string;
  borderColor: string;
}

export const certifications: Certification[] = [
  {
    id: 'ai_manager',
    title: 'KI Manager',
    issuer: 'Cert-IT · AI Hub Startplatz, Köln',
    completed: 'Dec 2025',
    detail: 'Certified AI Manager — strategy, governance, and applied AI operations.',
    image: aiManagerCert,
    accentClass: 'text-cyber',
    borderColor: 'border-cyber/30',
  },
  {
    id: 'cyber_analyst',
    title: 'Cyber Security Analyst',
    issuer: 'Masterschool · Berlin',
    completed: 'Feb 2025',
    detail: 'Cybersecurity School — Security Operations Center Analysis, 1,440 teaching hours, AZAV certified.',
    image: cyberCert,
    accentClass: 'text-film',
    borderColor: 'border-film/30',
  },
  {
    id: 'web_developer',
    title: 'Web & Software Developer',
    issuer: 'Digital Career Institute · Berlin',
    completed: 'Sep 2022',
    detail: 'Full-stack web development — React, Node.js, REST APIs, MongoDB, and agile delivery.',
    image: webDevCert,
    accentClass: 'text-dev',
    borderColor: 'border-dev/30',
  },
];
