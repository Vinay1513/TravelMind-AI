import { SearchHero } from "@/components/SearchHero";
import { CityCard } from "@/components/CityCard";
import { Navigation } from "@/components/Navigation";
import { AIChatWidget } from "@/components/AIChatWidget";
import { motion } from "framer-motion";

const POPULAR_CITIES = [
  {
    name: "Paris",
    // Paris street cafe
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    description: "The City of Light awaits with iconic landmarks and exquisite cuisine.",
  },
  {
    name: "Tokyo",
    // Tokyo neon night
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop",
    description: "A dazzling blend of ultra-modern neon and traditional temples.",
  },
  {
    name: "New York",
    // NYC skyline
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    description: "The city that never sleeps, offering endless energy and diversity.",
  },
  {
    name: "Bali",
    // Bali rice terrace
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop",
    description: "Tropical paradise with lush landscapes and spiritual serenity.",
  },
  {
    name: "Rome",
    // Colosseum
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop",
    description: "Walk through history in the Eternal City of art and architecture.",
  },
  {
    name: "Santorini",
    // Greek islands
    image: "https://images.unsplash.com/photo-1613395877344-13d4c79e42d0?q=80&w=2148&auto=format&fit=crop",
    description: "Iconic white buildings and breathtaking sunsets over the Aegean.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary/30 pb-20 md:pb-0">
      <Navigation />
      
      <main className="md:pt-16">
        <SearchHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Popular Destinations</h2>
              <p className="text-muted-foreground mt-2">Curated selection of world-class travel spots</p>
            </div>
            {/* Decorative element */}
            <div className="hidden md:block h-px flex-1 bg-border ml-8 mr-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POPULAR_CITIES.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CityCard {...city} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
