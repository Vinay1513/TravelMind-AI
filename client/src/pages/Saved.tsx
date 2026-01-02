import { Navigation } from "@/components/Navigation";
import { AIChatWidget } from "@/components/AIChatWidget";
import { useItineraries } from "@/hooks/use-itineraries";
import { Loader2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Saved() {
  const { data: itineraries, isLoading } = useItineraries();

  return (
    <div className="min-h-screen bg-secondary/30 pb-20 md:pb-0">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Saved Itineraries</h1>
        <p className="text-muted-foreground mb-12">Your collection of future adventures.</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : !itineraries || itineraries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No itineraries yet</h3>
            <p className="text-muted-foreground mb-8">Start exploring cities to create your first plan.</p>
            <Link href="/" className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <MapPin className="w-5 h-5" />
                    <span className="font-bold">{itinerary.destination}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {new Date(itinerary.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  Custom AI-generated travel plan for {itinerary.destination}.
                </p>

                <Link href={`/city/${encodeURIComponent(itinerary.destination)}`} className="w-full flex items-center justify-center px-4 py-2 rounded-lg border border-primary/20 text-primary font-medium hover:bg-primary/5 transition-colors">
                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <AIChatWidget />
    </div>
  );
}
