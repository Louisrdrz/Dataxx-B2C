import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Legal = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-transparent">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6">Mentions légales</h1>
          <div className="space-y-6 text-slate-700 leading-relaxed bg-white/70 rounded-2xl border border-gray-200 shadow-sm p-6">
            <p>Éditeur du site: <strong>Dataxx</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Forme: Société par actions simplifiée (SAS)</li>
              <li>RCS: 989 277 108 Paris</li>
              <li>Siège social: 4 Impasse Reille, 75014 Paris, France</li>
              <li>Représentant légal: Direction Dataxx</li>
              <li>Contact: <a className="underline" href="mailto:contact@dataxx.fr">contact@dataxx.fr</a></li>
            </ul>
            <p>Hébergement: plateforme cloud européenne.</p>
            <p>Propriété intellectuelle: l’ensemble des contenus de ce site est protégé. Toute reproduction ou diffusion non autorisée est interdite.</p>
            <p>Données personnelles: toute demande d’accès, rectification ou suppression peut être adressée à <a className="underline" href="mailto:contact@dataxx.fr">contact@dataxx.fr</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;


