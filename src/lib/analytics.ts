/**
 * Plausible analytics wrapper — safe no-op when the script is absent.
 *
 * The Plausible snippet is loaded defer in index.html for the
 * `nagacodex.cloud` domain. `window.plausible` may be undefined when the
 * script has not yet loaded or is blocked, so every call goes through an
 * optional call that never throws.
 */

/** Canonical event names used across the homepage. */
export const ANALYTICS_EVENTS = {
  heroBookingCtaClicked: 'hero_booking_cta_clicked',
  heroWorkCtaClicked: 'hero_work_cta_clicked',
  serviceCtaClicked: 'service_cta_clicked',
  caseStudyClicked: 'case_study_clicked',
  bookingCtaClicked: 'booking_cta_clicked',
  projectBriefSubmitted: 'project_brief_submitted',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Fire-and-forget event tracking. Missing `window.plausible` is fine — the
 * call is a no-op and never throws in that case.
 */
export function trackEvent(event: AnalyticsEvent | string, props?: Record<string, unknown>): void {
  (window as unknown as { plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void }).plausible?.(
    event,
    props ? { props } : undefined,
  );
}