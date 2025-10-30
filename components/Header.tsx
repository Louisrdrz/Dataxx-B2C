import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-transparent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-white/95 border border-gray-200">
        {/* Logo */}
        <Link href="/#top" className="flex items-center">
          <Image src="/logo.png" alt="Dataxx" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 mr-2 rounded-full" />
          <span className="text-lg sm:text-xl font-bold text-secondary">Dataxx</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <a href="/#partenariat" className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm lg:text-base">{t('nav.partenariat')}</a>
          <a href="/#comment" className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm lg:text-base">{t('nav.comment-ca-marche')}</a>
          <a href="/#benefices" className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm lg:text-base">{t('nav.benefices')}</a>
          <a href="/#equipe" className="text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm lg:text-base">{t('nav.equipe')}</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Menu mobile button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/demo" className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-300 font-medium border-0 rounded-md inline-flex items-center justify-center">
            <span className="hidden sm:inline">{t('nav.demander-demo')}</span>
            <span className="sm:hidden">Démo</span>
          </Link>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl mx-4 mt-2 shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            <a 
              href="/#partenariat" 
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.partenariat')}
            </a>
            <a 
              href="/#comment" 
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.comment-ca-marche')}
            </a>
            <a 
              href="/#benefices" 
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.benefices')}
            </a>
            <a 
              href="/#equipe" 
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.equipe')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;