import { serviceData, type Service } from "@/data/servicesData";

export type TestCard = {
  slug: string;
  title: string;
  price?: number;
  obs?: number;
  hours?: number;
  imageUrl?: string;
};

export type TestDetail = {
  title: string;
  price?: number;
  observationsCount?: number;
  tatHours?: number;
  sampleRequired?: string;
  preparation?: string;
  gender?: string;
  ageGroup?: string;
  collectionAt?: string;
  bannerUrl?: string;
  overview?: string;
  whatIs?: string;
  components?: string[];
  indications?: string[];
  purpose?: string[];
};

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Flatten all subTests from serviceData into a single map keyed by slug
const allTests = Object.values(serviceData).flatMap((svc) =>
  svc.subTests.map((st) => ({
    category: svc.slug,
    name: st.name,
    price: st.price,
    preparation: st.preparation,
    slug: st.slug || toSlug(st.name),
    isPopular: Boolean(st.isPopular),
    sampleRequired: st.sampleRequired,
    observationsCount: st.observationsCount,
    tatHours: st.tatHours,
    overview: st.overview,
    whatIs: st.whatIs,
    components: st.components,
    indications: st.indications,
    purpose: st.purpose,
    bannerUrl: st.bannerUrl,
    gender: st.gender,
    ageGroup: st.ageGroup,
    collectionAt: st.collectionAt,
  }))
);

export const testsBySlug: Record<string, TestDetail> = allTests.reduce((acc, t) => {
  const parent = Object.values(serviceData).find((s) => s.slug === t.category);
  acc[t.slug] = {
    title: t.name,
    price: t.price,
    preparation: t.preparation,
    observationsCount: t.observationsCount,
    tatHours: t.tatHours,
    sampleRequired: t.sampleRequired || (t.category === "biochemistry" ? "Serum" : t.category === "clinical-path" ? "Urine/ Stool (as applicable)" : undefined),
    gender: t.gender || "Male & Female",
    ageGroup: t.ageGroup || "0 - 99 Years",
    collectionAt: t.collectionAt || "Home & Lab",
    overview: t.overview || parent?.description,
    whatIs: t.whatIs,
    components: t.components,
    indications: t.indications,
    purpose: t.purpose,
    bannerUrl: t.bannerUrl,
  };
  return acc;
}, {} as Record<string, TestDetail>);

// Build popular list from isPopular flag; fallback to first 4
let popularTests: TestCard[] = allTests
  .filter((t) => t.isPopular)
  .map((t) => ({ slug: t.slug, title: t.name, price: t.price }))
  .slice(0, 8);

if (popularTests.length === 0) {
  popularTests = allTests.slice(0, 4).map((t) => ({ slug: t.slug, title: t.name, price: t.price }));
}

export { popularTests };
