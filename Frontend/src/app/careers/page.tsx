import { LAB_EMAIL, LAB_EMAIL_MAILTO } from "@/lib/siteConfig";

export default function CareersPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 font-display">Careers</h1>
      <p className="text-gray-600 max-w-lg leading-relaxed">
        We are always looking for talented individuals to join our team. Our career portal is currently under construction. Please check back later or email your resume to{" "}
        <a href={LAB_EMAIL_MAILTO} className="text-[#009B72] font-semibold underline hover:text-[#0E3A45] transition-colors">
          {LAB_EMAIL}
        </a>.
      </p>
    </div>
  );
}
