import { useParams } from "wouter";
import { useCitySearch } from "@/hooks/use-travel";
import { Navigation } from "@/components/Navigation";
import { AIChatWidget } from "@/components/AIChatWidget";
import { Loader2, Cloud, Wind, Thermometer, MapPin, Star, Calendar } from "lucide-react";
import { useState } from "react";
import { useGenerateItinerary } from "@/hooks/use-itineraries";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CityDetails() {
  const { name = "" } = useParams();
  const { data, isLoading, error } = useCitySearch(decodeURIComponent(name));
  const [activeTab, setActiveTab] = useState<"overview" | "attractions" | "itinerary">("overview");
  
  // Itinerary generation state
  const [days, setDays] = useState(3);
  const { mutate: generateItinerary, isPending: isGenerating } = useGenerateItinerary();
  const { toast } = useToast();
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

  const handleGenerate = () => {
    generateItinerary(
      { city: name, days },
      {
        onSuccess: (data) => {
          setGeneratedItinerary(data.content);
          toast({
            title: "Itinerary Generated!",
            description: `Your ${days}-day trip to ${name} is ready.`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to generate itinerary. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Exploring {name}...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Could not find {name}</h2>
        <p className="text-muted-foreground mb-6">Try searching for a major city like "Paris" or "Tokyo"</p>
        <Navigation />
      </div>
    );
  }

  // Fallback hero image if API doesn't provide one
  const heroImage = data.attractions?.[0]?.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 md:pb-0">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[500px] w-full">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex items-center space-x-2 text-white/80 mb-2 uppercase tracking-wider text-sm font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Explore Destination</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">{name}</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl line-clamp-2 md:line-clamp-none">
              {data.summary}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative -mt-10 z-10">
        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-2 mb-8 flex space-x-2 overflow-x-auto">
          {["overview", "attractions", "itinerary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-6 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-200 capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
                  <h3 className="text-2xl font-display font-bold mb-4">About {name}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{data.summary}</p>
                </div>
                
                {/* Weather Widget */}
                {data.weather && (
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-8 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <Cloud className="mr-2 h-6 w-6" /> Current Weather
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                        <Thermometer className="h-8 w-8 mx-auto mb-2" />
                        <span className="block text-2xl font-bold">{Math.round(data.weather.temp)}°C</span>
                        <span className="text-sm opacity-90">Temperature</span>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                        <Wind className="h-8 w-8 mx-auto mb-2" />
                        <span className="block text-2xl font-bold">{data.weather.wind_speed} km/h</span>
                        <span className="text-sm opacity-90">Wind</span>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                        <Cloud className="h-8 w-8 mx-auto mb-2" />
                        <span className="block text-2xl font-bold capitalize">{data.weather.description}</span>
                        <span className="text-sm opacity-90">Condition</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                  <h3 className="font-bold text-lg mb-4">Quick Facts</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span>Coordinates</span>
                      <span className="font-mono text-xs">{data.coordinates.lat.toFixed(2)}, {data.coordinates.lon.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span>Country</span>
                      <span>Unknown</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attractions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.attractions.map((attraction: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={attraction.image || "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop"} 
                      alt={attraction.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold flex items-center shadow-sm">
                      <Star className="w-3 h-3 text-accent fill-accent mr-1" />
                      {attraction.rating || 4.5}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{attraction.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {attraction.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="space-y-8">
              {!generatedItinerary ? (
                <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg border border-border max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Create Your Perfect Trip</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Let our AI craft a personalized day-by-day itinerary based on your preferences.
                  </p>
                  
                  <div className="max-w-xs mx-auto mb-8">
                    <label className="block text-sm font-medium mb-2 text-left">How many days?</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="14" 
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="font-bold text-xl min-w-[3ch]">{days}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 day</span>
                      <span>14 days</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Generating Plan...
                      </span>
                    ) : (
                      "Generate AI Itinerary"
                    )}
                  </button>
                </div>
              ) : (
                <div className="grid gap-8">
                  {/* Assuming the backend returns a structure we can map. 
                      If it's a raw string, we'd render it differently. 
                      Since schema says 'json', assuming structured. */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
                     <h3 className="text-2xl font-display font-bold mb-6">Your Custom Itinerary</h3>
                     {/* Simplified rendering of JSON content - adapt based on actual AI structure */}
                     <pre className="whitespace-pre-wrap font-sans text-muted-foreground bg-muted/30 p-6 rounded-xl overflow-x-auto">
                       {JSON.stringify(generatedItinerary, null, 2)}
                     </pre>
                     
                     <div className="mt-8 flex justify-end">
                       <button 
                         onClick={() => setGeneratedItinerary(null)}
                         className="text-primary hover:underline font-medium"
                       >
                         Create New Plan
                       </button>
                     </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      <AIChatWidget />
    </div>
  );
}
