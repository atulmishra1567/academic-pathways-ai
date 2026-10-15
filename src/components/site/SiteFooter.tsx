import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="h-10" />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Discover Opportunities. Unlock Your Future.</p>
          <p className="mt-4 max-w-md text-xs text-muted-foreground">
            ScholarScout helps you discover and assess opportunities. It does not guarantee eligibility, awards or selection — always confirm details on the official source.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/explore" className="hover:text-primary">Opportunities</Link></li>
            <li><Link to="/discover" className="hover:text-primary">Live discovery</Link></li>
            <li><Link to="/how-it-works" className="hover:text-primary">How it works</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About & trust</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} ScholarScout · Prototype</div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
