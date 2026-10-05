export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const CONTACT = {
  email: "tinbobangba@gmail.com",
  phone: "+33 7 55 82 16 84",
  phoneHref: "tel:+33755821684",
} as const;

export function formatDate(locale: string, iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export const REQUEST_TYPES = [
  "Investment opportunity",
  "Strategic advisory",
  "Market intelligence",
  "Partnership",
  "Education project",
  "Other",
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];

export const MEETING_FORMATS = ["visio", "phone", "in-person"] as const;
export type MeetingFormat = (typeof MEETING_FORMATS)[number];

export const MEETING_PERIODS = ["this-week", "two-weeks", "month", "flexible"] as const;
export type MeetingPeriod = (typeof MEETING_PERIODS)[number];

export const PARTNER_KINDS = ["institution", "operator", "education", "investor", "local", "other"] as const;
export type PartnerKind = (typeof PARTNER_KINDS)[number];

export const INVESTOR_PROFILES = ["individual", "family-office", "fund", "institution", "corporate"] as const;
export type InvestorProfile = (typeof INVESTOR_PROFILES)[number];

export const INVESTOR_INTERESTS = ["education", "mixed", "explore"] as const;
export type InvestorInterest = (typeof INVESTOR_INTERESTS)[number];

export const REQUEST_TYPE_PARAMS: Record<string, RequestType> = {
  investment: "Investment opportunity",
  advisory: "Strategic advisory",
  intelligence: "Market intelligence",
  partnership: "Partnership",
  education: "Education project",
  other: "Other",
};

export const INSIGHT_CATEGORIES = [
  "Market Intelligence",
  "Education",
  "Investment",
  "Strategy",
  "Burkina Faso",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];
