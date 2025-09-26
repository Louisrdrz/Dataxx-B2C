import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-primary">meet</span>
            <span className="text-secondary">sponsors</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
            blog
          </a>
          <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
            pricing
          </a>
          <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
            what's new?
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-secondary hover:text-primary">
            Connexion
          </Button>
          <Button className="btn-meetsponsors">
            Trouvez des Sponsors
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;