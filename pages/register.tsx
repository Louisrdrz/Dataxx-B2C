import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
    sport: "",
    sportDuration: "",
    achievements: "",
    links: "",
    nextEvent: "",
    sponsorType: "",
    targetAmount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    // TODO: Implement registration logic
    console.log("Registration data:", formData);
  };

  return (
    <>
      <Head>
        <title>Créer un compte - Dataxx</title>
        <meta name="description" content="Rejoignez Dataxx et trouvez vos sponsors" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-fuchsia-50">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="flex items-center w-fit">
              <Image src="/logo.png" alt="Dataxx" width={32} height={32} className="w-8 h-8 mr-2 rounded-full" />
              <span className="text-xl font-bold text-secondary">Dataxx</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary mb-3">Créer un compte</h1>
                <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
                  Rejoignez Dataxx pour aider les sportifs à trouver des sponsors, 
                  financer leur carrière et les accompagner dans leurs objectifs.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row: Nom & Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="Dupont"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="Jean"
                    />
                  </div>
                </div>

                {/* Date de naissance */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Row: Mot de passe & Confirmation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Vérification du mot de passe *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Informations sportives</h3>

                {/* Row: Sport & Durée */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
                      Sport pratiqué *
                    </label>
                    <input
                      type="text"
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="Ex: Tennis, Football, Natation..."
                    />
                  </div>
                  <div>
                    <label htmlFor="sportDuration" className="block text-sm font-medium text-gray-700 mb-2">
                      Depuis combien de temps *
                    </label>
                    <input
                      type="text"
                      id="sportDuration"
                      name="sportDuration"
                      value={formData.sportDuration}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      placeholder="Ex: 5 ans, 10 ans..."
                    />
                  </div>
                </div>

                {/* Palmarès */}
                <div>
                  <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-2">
                    Palmarès *
                  </label>
                  <textarea
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Décrivez vos principales réalisations sportives..."
                  />
                </div>

                {/* Liens utiles */}
                <div>
                  <label htmlFor="links" className="block text-sm font-medium text-gray-700 mb-2">
                    Liens utiles (réseaux sociaux, site web, etc.) *
                  </label>
                  <textarea
                    id="links"
                    name="links"
                    value={formData.links}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Instagram: @votre_compte&#10;Site web: www.votre-site.com&#10;LinkedIn: ..."
                  />
                </div>

                {/* Prochaine échéance */}
                <div>
                  <label htmlFor="nextEvent" className="block text-sm font-medium text-gray-700 mb-2">
                    Prochaine échéance sportive *
                  </label>
                  <input
                    type="text"
                    id="nextEvent"
                    name="nextEvent"
                    value={formData.nextEvent}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="Ex: Championnat national en juin 2025"
                  />
                </div>

                {/* Type de sponsors */}
                <div>
                  <label htmlFor="sponsorType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type de sponsors recherchés *
                  </label>
                  <input
                    type="text"
                    id="sponsorType"
                    name="sponsorType"
                    value={formData.sponsorType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="Ex: Équipementier, nutrition, technologie..."
                  />
                </div>

                {/* Montant cible */}
                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Montant cible recherché *
                  </label>
                  <input
                    type="text"
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="Ex: 10 000€, 25 000€..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-8"
                >
                  Créer mon compte
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RegisterPage;
