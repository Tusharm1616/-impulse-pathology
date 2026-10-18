import {
  LAB_EMAIL,
  LAB_EMAIL_MAILTO,
  LAB_PHONE_DISPLAY,
  LAB_PHONE_TEL,
} from "@/lib/siteConfig";

export default function SupportPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 font-display">Help & Support</h1>
      <p className="text-gray-600 max-w-lg leading-relaxed">
        Our support center is currently being updated. For immediate assistance, please contact us at{" "}
        <a href={LAB_EMAIL_MAILTO} className="text-[#009B72] font-semibold underline hover:text-[#0E3A45] transition-colors">
          {LAB_EMAIL}
        </a>{" "}
        or call{" "}
        <a href={LAB_PHONE_TEL} className="text-[#009B72] font-semibold underline hover:text-[#0E3A45] transition-colors">
          {LAB_PHONE_DISPLAY}
        </a>.
      </p>
    </div>
  );
}
