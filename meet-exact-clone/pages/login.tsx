import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/Input';
import { Button, LinkButton } from '@/components/Button';

export default function LoginPage() {
  return (
    <Layout>
      <Head>
        <title>Se connecter – Dataxx</title>
      </Head>
      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary-600" />
            <h1 className="mt-4 text-2xl font-bold">Se connecter</h1>
            <p className="text-gray-600">Accédez à votre espace sportif.</p>
          </div>

          <form className="card p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Adresse mail" name="email" type="email" placeholder="prenom.nom@email.com" autoComplete="email" />
            <Input label="Mot de passe" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
            <Button type="submit" className="w-full">Se connecter</Button>
            <div className="text-center text-sm text-gray-600">
              Pas encore de compte ? <Link href="/register" className="text-primary-600 hover:underline">Créer un compte</Link>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}


