/**
 * Homepage offer flags. Unresolved values stay null/false so UI can hide blocks
 * instead of inventing copy or showing placeholders.
 */
export type HomepageOfferConfig = {
  bookingUrl: string | null;
  callDurationMinutes: number | null;
  deliveryBusinessDays: number | null;
  priceEur: number | null;
  showTaxWording: boolean;
  includePostHandoverSupport: boolean;
  includeHostingExclusionLine: boolean;
};

export const homepageOffer: HomepageOfferConfig = {
  bookingUrl: null,
  callDurationMinutes: null,
  deliveryBusinessDays: null,
  priceEur: null,
  showTaxWording: false,
  includePostHandoverSupport: false,
  includeHostingExclusionLine: false,
};

/** Section index of #offer after homepage reorder (hero=0, offer=1). */
export const OFFER_SECTION_INDEX = 1;

/** Section index of case studies. */
export const CASE_STUDIES_SECTION_INDEX = 2;

/** Contact section index after adding offer + case studies. */
export const CONTACT_SECTION_INDEX = 9;

/** Work grid section index (was 2, now 4). */
export const WORK_SECTION_INDEX = 4;
