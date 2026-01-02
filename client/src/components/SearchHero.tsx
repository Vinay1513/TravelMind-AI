import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export function SearchHero() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/city/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden rounded-b-3xl shadow-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* landscape photo from unsplash */}
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
          alt="Travel Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-display font-bold text-white mb-6 drop-shadow-lg"
        >
          Discover Your Next Adventure
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light"
        >
          AI-powered itineraries, hidden gems, and local secrets at your fingertips.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-14 py-4 md:py-5 rounded-full border-none bg-white/95 backdrop-blur-sm text-lg shadow-xl focus:ring-4 focus:ring-primary/20 placeholder:text-muted-foreground transition-all duration-300"
              placeholder="Where do you want to go?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-primary/50"
            >
              <Search className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Explore</span>
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
