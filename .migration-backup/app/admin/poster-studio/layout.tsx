import { cinzel, poppins } from "@/app/fonts";

export const metadata = {
  title: "Poster Studio | Admin — Sri Velmayil Jewellery",
  robots: { index: false, follow: false },
};

export default function AdminPosterStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cinzel.variable} ${poppins.variable}`}>
      {children}
    </div>
  );
}
