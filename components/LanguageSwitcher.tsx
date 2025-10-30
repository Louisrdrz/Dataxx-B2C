import { useLanguage } from '@/hooks/useLanguage';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center bg-gray-100 rounded-full p-1">
      {/* Bouton FR */}
      <button
        onClick={() => setLanguage('fr')}
        className={`relative z-10 px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
          language === 'fr'
            ? 'bg-white text-gray-900 border-2 border-gray-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        FR
      </button>
      
      {/* Bouton EN */}
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-white text-gray-900 border-2 border-gray-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
