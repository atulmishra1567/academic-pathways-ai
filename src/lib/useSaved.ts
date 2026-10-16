import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export function useSaved() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const q = useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_opportunities").select("opportunity_id").eq("user_id", user!.id);
      if (error) throw error;
      return new Set(data.map((d) => d.opportunity_id));
    },
  });
  const toggle = async (oppId: string) => {
    if (!user) {
      toast("Sign in to save opportunities");
      navigate({ to: "/auth" });
      return undefined;
    }
    const isSaved = q.data?.has(oppId);
    const { error } = isSaved
      ? await supabase.from("saved_opportunities").delete().eq("user_id", user.id).eq("opportunity_id", oppId)
      : await supabase.from("saved_opportunities").insert({ user_id: user.id, opportunity_id: oppId });
    if (error) { toast.error("Couldn't update saved list"); return undefined; }
    toast.success(isSaved ? "Removed from saved" : "Saved — find it in your tracker");
    qc.invalidateQueries({ queryKey: ["saved"] });
    qc.invalidateQueries({ queryKey: ["tracker"] });
    return undefined;
  };
  return { saved: q.data ?? new Set<string>(), toggle };
}
