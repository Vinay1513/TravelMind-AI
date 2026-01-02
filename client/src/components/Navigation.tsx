import { Link, useLocation } from "wouter";
import { Compass, MessageSquare, Map, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Compass, label: "Explore" },
    { href: "/saved", icon: Heart, label: "Saved" },
    { href: "/chat", icon: MessageSquare, label: "AI Assistant" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto glass-panel border-t md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:justify-start md:space-x-8 h-16 items-center">
          <div className="hidden md:flex items-center mr-8">
            <Map className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-display font-bold text-foreground">WanderLust</span>
          </div>

          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col md:flex-row items-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("h-6 w-6 md:h-5 md:w-5", isActive ? "fill-current" : "")} />
                  <span className="text-xs md:text-sm font-medium mt-1 md:mt-0 md:ml-2">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
