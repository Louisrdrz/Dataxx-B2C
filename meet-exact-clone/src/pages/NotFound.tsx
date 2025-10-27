import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const NotFound = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">Désolé, cette page n'existe pas.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
