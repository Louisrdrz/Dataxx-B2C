import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-transparent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 py-3 bg-white/95 border border-gray-200">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Dataxx" className="w-8 h-8 mr-2 rounded-full" />
          <span className="text-xl font-bold text-secondary">Dataxx</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#partenariat" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">partenariat</a>
          <a href="#comment" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">comment ça marche</a>
          <a href="#benefices" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">bénéfices</a>
          <a href="#equipe" className="text-secondary hover:text-primary transition-colors duration-200 font-medium">équipe</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <a href="#contact" className="bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 font-medium border-0 rounded-md inline-flex items-center justify-center">
            Demander une démo
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;