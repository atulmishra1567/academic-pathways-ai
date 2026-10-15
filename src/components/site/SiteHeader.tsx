import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Opportunities" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="ScholarScout home">
          <Logo className="h-9" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Button variant="ghost" onClick={signOut}>Sign out</Button>
              <Button asChild><Link to="/dashboard">Dashboard</Link></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Login</Link></Button>
              <Button asChild><Link to="/auth" search={{ mode: "signup" }}>Sign Up</Link></Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="border-t bg-background px-4 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              {n.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            {user ? (
              <Button asChild className="flex-1"><Link to="/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <Button variant="secondary" asChild className="flex-1"><Link to="/auth">Login</Link></Button>
                <Button asChild className="flex-1"><Link to="/auth" search={{ mode: "signup" }}>Sign Up</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
