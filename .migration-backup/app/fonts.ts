import { Inter, Playfair_Display, Cinzel, Poppins } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});
