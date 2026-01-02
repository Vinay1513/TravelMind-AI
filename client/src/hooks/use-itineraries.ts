import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertItinerary } from "@shared/schema";

// Helper type since generate input isn't exported directly
type GenerateItineraryInput = {
  city: string;
  days: number;
  preferences?: string;
};

export function useItineraries() {
  return useQuery({
    queryKey: [api.itineraries.list.path],
    queryFn: async () => {
      const res = await fetch(api.itineraries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch itineraries");
      return api.itineraries.list.responses[200].parse(await res.json());
    },
  });
}

export function useItinerary(id: number) {
  return useQuery({
    queryKey: [api.itineraries.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.itineraries.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch itinerary");
      return api.itineraries.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateItinerary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertItinerary) => {
      const res = await fetch(api.itineraries.create.path, {
        method: api.itineraries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create itinerary");
      return api.itineraries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.itineraries.list.path] }),
  });
}

export function useGenerateItinerary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateItineraryInput) => {
      const res = await fetch(api.itineraries.generate.path, {
        method: api.itineraries.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate itinerary");
      return api.itineraries.generate.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.itineraries.list.path] }),
  });
}
