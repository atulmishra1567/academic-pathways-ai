import logo from "@/assets/scholarscout-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src={logo.url} alt="ScholarScout" className={cn("h-10 w-auto select-none", className)} draggable={false} />;
}
