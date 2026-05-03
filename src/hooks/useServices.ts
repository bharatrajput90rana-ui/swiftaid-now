import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useServices(category?: string) {
  return useQuery({
    queryKey: ["services", category],
    queryFn: async () => {
      let query = supabase.from("services").select("*").eq("is_active", true);
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      const { data, error } = await query.order("is_emergency", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, services(*), providers(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
