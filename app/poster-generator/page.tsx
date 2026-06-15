import PosterStudio from "@/components/PosterStudio";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function PosterGeneratorPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ name: "Poster Generator", href: "/poster-generator" }]} />
      </div>
      <PosterStudio />
    </>
  );
}
