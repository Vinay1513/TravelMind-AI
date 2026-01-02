import { Link } from "wouter";
import { Star } from "lucide-react";

interface CityCardProps {
  name: string;
  image: string;
  rating?: number;
  description: string;
}

export function CityCard({ name, image, rating = 4.8, description }: CityCardProps) {
  return (
    <Link href={`/city/${encodeURIComponent(name)}`}>
      <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-2xl font-display font-bold">{name}</h3>
            <div className="flex items-center bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-accent fill-accent mr-1" />
              <span className="text-sm font-bold">{rating}</span>
            </div>
          </div>
          <p className="text-sm text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
