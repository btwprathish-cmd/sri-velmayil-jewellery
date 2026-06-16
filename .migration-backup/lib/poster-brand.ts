import { BRAND } from "@/utils/brand";

export interface PosterBrandSettings {
  logo: string;
  phone: string;
  address: string;
  hallmarkImage: string;
  hallmarkLabel: string;
}

export const DEFAULT_POSTER_BRAND: PosterBrandSettings = {
  logo: BRAND.logo,
  phone: BRAND.phone,
  address: BRAND.address,
  hallmarkImage: "/images/poster-assets/bis-huid-badge.svg",
  hallmarkLabel: BRAND.hallmark,
};
