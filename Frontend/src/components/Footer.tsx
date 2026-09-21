import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-brand-primary/10 bg-brand-neutral text-brand-textB">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-semibold">IP</div>
              <span className="text-brand-textH text-lg font-display font-bold">Impulse Pathology</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Leading pathology lab providing accurate diagnostic services with state-of-the-art technology and experienced professionals in Pune.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="tel:+919373253743" className="hover:text-brand-accent transition-colors block font-medium">📞 +91 93732 53743</a>
              {/* TODO: confirm real business email */}
              <a href="mailto:info@impulselab.com" className="hover:text-brand-accent transition-colors block font-medium">✉️ info@impulselab.com</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Impulse+Pathology+Lab+Hinjawadi" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors block leading-relaxed">📍 Laxmi Chowk, Marunji Road, near Gurukrupa Hospital, Hinjawadi Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057</a>
            </div>
          </div>

          <div>
            <h3 className="text-brand-textH font-display font-semibold">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Blood Tests</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Health Packages</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Radiology</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Pathology</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-textH font-display font-semibold">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/book" className="hover:text-brand-accent transition-colors">Book a Test</Link></li>
              <li><Link href="/reports" className="hover:text-brand-accent transition-colors">Download Reports</Link></li>
              <li><Link href="/labs" className="hover:text-brand-accent transition-colors">Find Lab</Link></li>
              <li><Link href="/support" className="hover:text-brand-accent transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-textH font-display font-semibold">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-brand-accent transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-primary/10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="text-center">Copyright © {year} Impulse Pathology Lab. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}