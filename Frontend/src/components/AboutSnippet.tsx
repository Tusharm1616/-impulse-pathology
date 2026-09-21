// src/components/AboutSnippet.tsx
import Link from "next/link";
import Image from "next/image";

export default function AboutSnippet() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10">
        
        {/* Left: Image */}
        <div className="lg:w-1/2">
          <Image
            src="/lab-photo.jpg" // replace with real lab image
            alt="Impulse Pathology Lab"
            width={500}
            height={350}
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Right: Text */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            About Impulse Pathology Lab
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            At Impulse Pathology Lab, we are committed to providing accurate and 
            reliable diagnostic services. With state-of-the-art technology and 
            experienced professionals, we ensure timely results and patient care 
            you can trust.
          </p>
          <Link
            href="/about"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
    