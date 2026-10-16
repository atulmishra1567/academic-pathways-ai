import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["login", "signup", "forgot"]).optional() }),
  head: () => ({
    meta: [
      { title: "Sign in — ScholarScout" },
      { name: "description", content: "Log in or create your ScholarScout student account." },
      { property: "og:title", content: "Sign in — ScholarScout" },
      { property: "og:description", content: "Access your personalised opportunity dashboard." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const pwSchema = z.string().min(8, "At least 8 characters").max(72);

function AuthPage() {
  const { mode = "login" } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const em = emailSchema.safeParse(email);
    if (!em.success) return setErr(em.error.issues[0]?.message ?? "Invalid email");
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(em.data, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setSent("If an account exists, a reset link is on its way to your inbox.");
        return;
      }
      const pw = pwSchema.safeParse(password);
      if (!pw.success) return setErr(pw.error.issues[0]?.message ?? "Invalid password");
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: em.data, password: pw.data, options: { emailRedirectTo: `${window.location.origin}/onboarding`, data: { full_name: name.trim().slice(0, 100) } } });
        if (error) throw error;
        if (!data.session) setSent("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: em.data, password: pw.data });
        if (error) throw error;
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google sign-in failed");
  };

  const title = mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Welcome back";

  return (
    <div className="hero-wash flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card-surface w-full max-w-md p-8">
        <Link to="/" className="flex justify-center"><Logo className="h-14" /></Link>
        <h1 className="mt-6 text-center text-2xl font-bold text-primary">{title}</h1>
        {sent ? (
          <div className="mt-6 rounded-lg bg-success-soft p-4 text-sm text-success">{sent}</div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {mode === "signup" && (
              <div><Label htmlFor="name">Full name (optional)</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></div>
            )}
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between"><Label htmlFor="pw">Password</Label>{mode === "login" && <Link to="/auth" search={{ mode: "forgot" }} className="text-xs text-primary hover:underline">Forgot password?</Link>}</div>
                <Input id="pw" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            )}
            {err && <p className="rounded-md bg-danger-soft p-2 text-sm text-destructive" role="alert">{err}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "signup" ? "Sign Up" : mode === "forgot" ? "Send reset link" : "Login"}</Button>
          </form>
        )}
        {mode !== "forgot" && !sent && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>
            <Button variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
          </>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? <>Already have an account? <Link to="/auth" className="font-semibold text-primary">Login</Link></> : mode === "forgot" ? <Link to="/auth" className="font-semibold text-primary">Back to login</Link> : <>New to ScholarScout? <Link to="/auth" search={{ mode: "signup" }} className="font-semibold text-primary">Sign up</Link></>}
        </p>
      </div>
    </div>
  );
}
