import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function RegisterPage() {
  return (
    <Layout>
      <Head>
        <title>Créer un compte – Dataxx</title>
      </Head>
      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary-600" />
            <h1 className="mt-4 text-2xl font-bold">Créer un compte</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              "Rejoignez Dataxx pour aider les sportifs à trouver des sponsors, financer leur carrière et les accompagner dans leurs objectifs."
            </p>
          </div>

          <form className="card p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nom" name="lastName" placeholder="Dupont" />
              <Input label="Prénom" name="firstName" placeholder="Alice" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Date de naissance" name="birthDate" type="date" />
              <Input label="Adresse mail" name="email" type="email" placeholder="prenom.nom@email.com" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Mot de passe" name="password" type="password" placeholder="••••••••" />
              <Input label="Vérification du mot de passe" name="passwordConfirm" type="password" placeholder="••••••••" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Sport pratiqué" name="sport" placeholder="Athlétisme, Tennis, ..." />
              <Input label="Depuis combien de temps" name="experience" placeholder="10 ans, depuis 2015, ..." />
            </div>

            <Input label="Palmarès" name="awards" placeholder="Championnat régional 2023, Top 10 national..." />
            <Input label="Liens utiles (réseaux, site, etc.)" name="links" placeholder="https://instagram.com/..., https://site.com" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Prochaine échéance sportive" name="nextEvent" placeholder="Marathon de Paris, 12/04/2026" />
              <Input label="Type de sponsors recherchés" name="sponsorTypes" placeholder="Équipementiers, Nutrition, Banques..." />
            </div>
            <Input label="Montant cible recherché" name="targetAmount" type="number" placeholder="5000" />

            <Button type="submit" className="w-full">Créer mon compte</Button>
            <div className="text-center text-sm text-gray-600">
              Déjà un compte ? <Link href="/login" className="text-primary-600 hover:underline">Se connecter</Link>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}


