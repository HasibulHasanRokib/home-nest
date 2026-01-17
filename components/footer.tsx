import { Home, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/30 ">
      <div className="mx-auto bg-white px-8 py-12">
        <img
          src="/ssLcommerz_banner-1.png"
          alt="SSLcommerz banner"
          className="hidden h-auto w-full object-cover md:flex"
        />
        <img
          src="/ssLcommerz_banner-2.png"
          alt="SSLcommerz banner"
          className="h-auto w-full object-cover md:hidden"
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">HomeNest</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Making house rentals simple, secure, and stress-free for everyone.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Safety
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:hello@homenest.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  homenest@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +880 1700-000000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HomeNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
