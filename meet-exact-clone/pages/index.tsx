import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { LinkButton } from '@/components/Button';

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>Dataxx – Plateforme pour sportifs</title>
        <meta name="description" content="Dataxx aide les sportifs à identifier, qualifier et signer plus de sponsors grâce à l’IA." />
      </Head>

      {/* Hero */}
      <section className="container-page pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Dataxx aide les sportifs à identifier, qualifier et signer plus de sponsors grâce à l’IA
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Une plateforme conçue pour vous accompagner dans la recherche de partenaires, la mise en valeur de votre parcours et l’activation de vos opportunités.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <LinkButton href="/login">Se connecter</LinkButton>
              <Link href="#pourquoi" className="btn-secondary">En savoir plus</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 opacity-90" />
          </div>
        </div>
      </section>

      {/* Pourquoi choisir Dataxx */}
      <section id="pourquoi" className="container-page py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Pourquoi choisir Dataxx</h2>
          <p className="text-gray-600 mt-2">Gagnez du temps, structurez votre démarche, optimisez vos chances.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Prospection intelligente</h3>
            <p className="text-sm text-gray-600">Ciblez les entreprises pertinentes selon votre sport, votre localisation et vos objectifs.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Qualification rapide</h3>
            <p className="text-sm text-gray-600">Scorez les prospects selon leur historique, affinités et budget potentiel.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Activation et suivi</h3>
            <p className="text-sm text-gray-600">Gérez vos prises de contact, relances et accords en un seul endroit.</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <LinkButton href="/login">Se connecter</LinkButton>
        </div>
      </section>

      {/* Fonctionnement */}
      <section id="fonctionnement" className="container-page py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="card p-6">
              <div className="text-primary-600 font-semibold">Étape {step}</div>
              <h3 className="mt-2 font-semibold">{step === 1 ? 'Créez votre profil' : step === 2 ? 'Ciblez et qualifiez' : 'Contactez et signez'}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {step === 1 && 'Mettez en avant votre parcours, palmarès et objectifs.'}
                {step === 2 && 'Listez des sponsors potentiels et priorisez grâce à l’IA.'}
                {step === 3 && 'Suivez vos échanges et concrétisez vos partenariats.'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}


