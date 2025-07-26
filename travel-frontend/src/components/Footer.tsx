import { MapPin, Heart, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto bg-card border-t border-border bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                TravelTracker
              </span>
            </div>
            <p className="text-muted-foreground">
              Track your adventures and discover new destinations around the
              world.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/bucket-list"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bucket List
                </a>
              </li>
              <li>
                <a
                  href="/visited"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Visited Places
                </a>
              </li>
              <li>
                <a
                  href="/to-visit"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  To Visit
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-4 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <Heart className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">
              Made with love for travelers
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              © 2025 TravelTracker. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
