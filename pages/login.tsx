import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { signInWithEmail, signInWithGoogle, resetPassword } from "@/lib/firebase/auth";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await signInWithEmail(email, password);
      // Rediriger vers onboarding qui vérifiera si l'utilisateur a un workspace
      router.push("/onboarding");
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err);
      
      if (err.code === "auth/user-not-found") {
        setError("Aucun compte trouvé avec cette adresse email");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect");
      } else if (err.code === "auth/invalid-email") {
        setError("Adresse email invalide");
      } else if (err.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Veuillez réessayer plus tard");
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signInWithGoogle();
      // Rediriger vers onboarding qui vérifiera si l'utilisateur a un workspace
      router.push("/onboarding");
    } catch (err: any) {
      console.error("Erreur lors de la connexion Google:", err);
      setError("Une erreur est survenue lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation:", err);
      setError("Une erreur est survenue lors de la réinitialisation du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Se connecter - Dataxx</title>
        <meta name="description" content="Connectez-vous à votre compte Dataxx" />
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
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary mb-2">Se connecter</h1>
                <p className="text-gray-600">Accédez à votre compte Dataxx</p>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Se connecter avec Google
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
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {resetEmailSent && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  Un email de réinitialisation a été envoyé à {email}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Pas encore de compte ?{" "}
                  <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                    Créer un compte
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

export default LoginPage;
