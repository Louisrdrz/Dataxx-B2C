import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { createOrUpdateUserDocument } from "@/lib/firebase/users";

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setLoading(true);
    
    try {
      // Créer l'utilisateur avec Firebase Auth
      const displayName = `${formData.firstName} ${formData.lastName}`;
      const userCredential = await signUpWithEmail(
        formData.email,
        formData.password,
        displayName
      );
      
      // Créer le document utilisateur dans Firestore avec les données supplémentaires
      await createOrUpdateUserDocument(userCredential.user, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      // Rediriger vers la création de workspace
      router.push("/create-workspace");
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      
      // Gérer les erreurs Firebase
      if (err.code === "auth/email-already-in-use") {
        setError("Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser un autre email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Adresse email invalide");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe est trop faible");
      } else if (err.code === "invalid-argument") {
        setError("Erreur lors de la création du profil. Veuillez réessayer.");
      } else {
        setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    
    try {
      const userCredential = await signInWithGoogle();
      await createOrUpdateUserDocument(userCredential.user);
      // Rediriger vers la création de workspace
      router.push("/create-workspace");
    } catch (err: any) {
      console.error("Erreur lors de la connexion Google:", err);
      setError("Une erreur est survenue lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
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

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                S'inscrire avec Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Ou avec votre email</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Création en cours..." : "Créer mon compte"}
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
