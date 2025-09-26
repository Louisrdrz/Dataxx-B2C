import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full px-6 py-6 bg-white relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between border border-gray-200 rounded-full px-6 py-3 shadow-sm">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="16" fill="hsl(var(--primary))" />
                <path d="M12 10 L20 16 L12 22 Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold text-secondary">
              Dataxx
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#partenariat" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">
            partenariat
          </a>
          <a href="#comment" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">
            comment ça marche
          </a>
          <a href="#benefices" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">
            bénéfices
          </a>
          <a href="#equipe" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">
            équipe
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <a href="#contact" className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Demander une démo
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;