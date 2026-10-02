export const IMAGES = {
  ouaga: "/images/hero-ouagadougou.jpg",
  campus: "/images/hero-campus.jpg",
  boardroom: "/images/hero-boardroom.jpg",
  desk: "/images/about-desk.jpg",
  classroom: "/images/education-classroom.jpg",
  training: "/images/training-workshop.jpg",
  edtech: "/images/edtech-students.jpg",
  infrastructure: "/images/invest-infrastructure.jpg",
  office: "/images/contact-office.jpg",
} as const;

export const HERO_SLIDE_IMAGES = [IMAGES.ouaga, IMAGES.campus, IMAGES.boardroom] as const;

export const EXPERTISE_IMAGES = [
  IMAGES.desk,
  IMAGES.boardroom,
  IMAGES.infrastructure,
  IMAGES.training,
] as const;

export const OPPORTUNITY_IMAGES = [
  IMAGES.classroom,
  IMAGES.campus,
  IMAGES.training,
  IMAGES.edtech,
  IMAGES.infrastructure,
] as const;

export function insightCover(category: string) {
  switch (category) {
    case "Education":
      return IMAGES.classroom;
    case "Investment":
      return IMAGES.infrastructure;
    case "Market Intelligence":
      return IMAGES.desk;
    case "Burkina Faso":
      return IMAGES.ouaga;
    default:
      return IMAGES.boardroom;
  }
}
