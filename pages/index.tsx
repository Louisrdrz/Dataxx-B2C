import Head from 'next/head';
import Header from "@/components/Header";
import HeroHeader from "@/components/HeroHeader";
import HowItWorksSection from "@/components/HowItWorksSection";
import PositioningSection from "@/components/PositioningSection";
import WhyDataxxSection from "@/components/WhyDataxxSection";
import TrustedBySection from "@/components/TrustedBySection";
import DataxxSlices from "@/components/DataxxSlices";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/hooks/useLanguage";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <>
      <Head>
        <title>Dataxx – La Plateforme IA qui réinvente le sponsoring sportif</title>
        <meta name="description" content="Dataxx aide les acteurs du sport à identifier, qualifier et signer plus de sponsors grâce à l'IA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div id="top" className="min-h-screen relative overflow-hidden overflow-x-hidden">
        {/* Fond global unique pour toute la page (désactivé en mobile) */}
        <div className="hidden sm:block sm:fixed sm:inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-transparent to-transparent"></div>
        {/* Blobs animés globaux (désactivés en mobile) */}
        <div className="hidden sm:block pointer-events-none sm:fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-fuchsia-400/30 via-purple-400/20 to-transparent blur-3xl animate-blob" />
          <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-400/25 via-sky-400/20 to-transparent blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[260px] rounded-[999px] bg-gradient-to-t from-rose-300/20 to-transparent blur-2xl animate-fadeIn" />
        </div>
        
        <div className="relative z-10">
          <Header />
          {/* Hero avec design ancien site mais contenu actuel */}
          <HeroHeader
            badge={t('hero.badge')}
            titleTarget={t('hero.title')}
            titleBetter=""
            titleActivate=""
            titleMore1=""
            titleEarn={t('hero.title-sportif')}
            titleMore2={t('hero.title-sportif-end')}
            subtitle=""
            description={t('hero.description')}
            primaryCta={t('hero.cta-primary')}
            secondaryCta={t('hero.cta-secondary')}
            secondaryHref="#features"
          />
          {/* Confiance juste sous les CTA */}
          <Reveal>
            <TrustedBySection />
          </Reveal>
          {/* Parcours classique ensuite */}
          <Reveal>
            <HowItWorksSection />
          </Reveal>
          {/* Tag 'BÉNÉFICES' au-dessus de Pourquoi choisir Dataxx */}
          <div id="benefices" className="max-w-7xl mx-auto px-6 scroll-mt-36 mt-4 sm:mt-6">
            <div className="text-center mb-2">
              <div className="text-primary tracking-widest text-sm sm:text-base md:text-lg font-semibold uppercase">{t('benefits.title')}</div>
            </div>
          </div>
          <Reveal>
            <WhyDataxxSection />
          </Reveal>
          {/* Section comparaison masquée sur mobile */}
          <div className="hidden sm:block">
            <PositioningSection />
          </div>
          {/* Tag 'ÉQUIPE' au-dessus des fondateurs */}
          <div id="equipe" className="max-w-7xl mx-auto px-6 scroll-mt-36 mt-4 sm:mt-6">
            <div className="text-center mb-2">
              <div className="text-primary tracking-widest text-sm sm:text-base md:text-lg font-semibold uppercase">{t('team.title')}</div>
            </div>
          </div>
          {/* Sections importées de l'ancien site (ajoutées tout en bas) */}
          <Reveal>
            <DataxxSlices />
          </Reveal>
          <Footer />
        </div>
        
        {/* Styles pour les animations */}
        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate3d(0,0,0) scale(1); }
            33% { transform: translate3d(30px,-20px,0) scale(1.05); }
            66% { transform: translate3d(-20px,20px,0) scale(0.98); }
          }
          .animate-blob { animation: blob 18s ease-in-out infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          @keyframes fadeInSoft { from { opacity: 0; } to { opacity: 1; } }
          .animate-fadeIn { animation: fadeInSoft 1.4s ease-in forwards; }
        `}</style>
      </div>
    </>
  );
}
