export type Offer = {
  slug: string;
  title: string;
  price: number;
  mrp: number;
  includes: string;
  tag: string;
  start: string; // display date
  end: string;   // display date
  description?: string;
  tests?: string[];
  poster?: string; // path under public/
  posterServices?: string[]; // services as printed on the poster
};

export const offers: Offer[] = [
  {
    slug: "full-body-checkup",
    title: "Full Body Checkup",
    price: 1499,
    mrp: 2499,
    includes: "65+ tests",
    tag: "Best Seller",
    start: "1 Oct 2025",
    end: "31 Oct 2025",
    description: "Comprehensive health screening covering key organ functions.",
    tests: ["CBC", "LFT", "KFT", "Lipid Profile", "Thyroid (TSH)", "Fasting Glucose"],
    poster: "/posters/full-body-checkup.jpg",
    posterServices: [
      "CBC (Complete Blood Count)",
      "LFT (Liver Function Test)",
      "RFT (Kidney Function Test)",
      "Lipid Profile",
      "Thyroid Profile (TFT)",
      "HBA1C (Glycated Hemoglobin)",
      "Vitamin B12, Vitamin D3",
      "Iron Studies",
      "Electrolytes",
      "Calcium",
      "Urine R-M (Routine & Microscopy)",
    ],
  },
  {
    slug: "diabetes-package",
    title: "Diabetes Package",
    price: 1199,
    mrp: 2100,
    includes: "Diabetic Profile • 33 parameters",
    tag: "Popular",
    start: "1 Oct 2025",
    end: "31 Oct 2025",
    description: "Monitoring and screening for diabetes and glucose control.",
    tests: ["HbA1c", "Fasting Blood Sugar (FBS)", "Post Prandial Blood Sugar (PPBS)"],
    poster: "/posters/diabetes-package.jpg",
    posterServices: [
      "BSL Fasting - PP (2)",
      "HBA1C (2)",
      "Lipid Profile (7)",
      "Kidney Profile (4)",
      "Urine Routine (18)",
    ],
  },
];
