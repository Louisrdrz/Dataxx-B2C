import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login attempt:", { email, password });
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
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
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  Se connecter
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
