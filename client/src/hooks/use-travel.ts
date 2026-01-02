import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useCitySearch(city: string) {
  return useQuery({
    queryKey: [api.travel.search.path, city],
    queryFn: async () => {
      if (!city) return null;
      const url = buildUrl(api.travel.search.path);
      // Pass city as query param since GET requests don't have body
      const res = await fetch(`${url}?city=${encodeURIComponent(city)}`, { 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to fetch city data");
      return api.travel.search.responses[200].parse(await res.json());
    },
    enabled: !!city,
  });
}
