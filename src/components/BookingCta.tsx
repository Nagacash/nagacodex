import { homepageOffer } from '../content/homepageOffer';
import sound from '../lib/sound';

type BookingCtaProps = {
  className?: string;
  fullWidth?: boolean;
};

/**
 * Renders a booking CTA only when bookingUrl is confirmed.
 * Otherwise shows a disabled control with no fake link.
 */
export function BookingCta({ className = '', fullWidth = false }: BookingCtaProps) {
  const base =
    `inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-lg font-display font-extrabold text-[11px] tracking-widest uppercase transition-colors ${
      fullWidth ? 'w-full' : ''
    } ${className}`;

  if (homepageOffer.bookingUrl) {
    return (
      <a
        href={homepageOffer.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sound.playClick()}
        className={`${base} bg-cyber text-[#050C17] hover:bg-[#00DD77] active:scale-[0.99] cursor-pointer`}
      >
        Book a project fit call →
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Booking link coming soon"
      className={`${base} bg-cyber/40 text-[#050C17]/70 cursor-not-allowed`}
    >
      Book a project fit call →
    </button>
  );
}
