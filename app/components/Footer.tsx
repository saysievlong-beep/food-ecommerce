import Link from "next/link";
import { Utensils, Heart, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & About */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Utensils size={16} />
              </span>
              <span>Tasty<span className="text-emerald-600">Byte</span></span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Freshly crafted meals from the finest local kitchens and organic farms, delivered hot and fast to your doorstep.
            </p>
          </div>

          {/* Quick Menu Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Popular Dishes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/food" className="hover:text-emerald-600 transition-colors">
                  Artisan Woodfire Pizza
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-emerald-600 transition-colors">
                  Double Wagyu Burgers
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-emerald-600 transition-colors">
                  Torched Salmon Sushi
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-emerald-600 transition-colors">
                  Organic Green Bowls
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Orders &amp; Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/Orders" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors flex items-center gap-1">
                  <span>My Orders &amp; Bills</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/Orders" className="hover:text-emerald-600 transition-colors">
                  Track Delivery Status
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="hover:text-emerald-600 transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/Blog" className="hover:text-emerald-600 transition-colors">
                  Foodie Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Friendly Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-600 shrink-0" />
                <span>+1 (800) 827-8929</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-600 shrink-0" />
                <span>hello@tastybyte.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-emerald-600 shrink-0" />
                <span>Open Daily: 8:00 AM – 11:30 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-600 shrink-0" />
                <span>123 Gourmet Ave, Foodie District</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} TastyByte. Made with{" "}
            <Heart size={13} className="fill-red-500 text-red-500 inline" /> for food lovers.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#instagram"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#facebook"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="#twitter"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Twitter"
            >
              <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-emerald-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
