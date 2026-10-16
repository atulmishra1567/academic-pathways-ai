import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — ScholarScout" },
      { name: "description", content: "Choose a new password for your ScholarScout account." },
      { property: "og:title", content: "Reset password — ScholarScout" },
      { property: "og:description", content: "Set a new password." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setErr("At least 8 characters");
    if (pw !== pw2) return setErr("Passwords don't match");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return setErr(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };
  return (
    <div className="hero-wash flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card-surface w-full max-w-md space-y-4 p-8">
        <Link to="/" className="flex justify-center"><Logo className="h-12" /></Link>
        <h1 className="text-center text-2xl font-bold text-primary">Set a new password</h1>
        <div><Label htmlFor="p1">New password</Label><Input id="p1" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div><Label htmlFor="p2">Confirm password</Label><Input id="p2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        {err && <p className="rounded-md bg-danger-soft p-2 text-sm text-destructive">{err}</p>}
        <Button type="submit" className="w-full">Update password</Button>
      </form>
    </div>
  );
}
