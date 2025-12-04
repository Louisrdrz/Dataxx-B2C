import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceById } from '@/hooks/useWorkspace';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { withAuth } from '@/lib/firebase/withAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { User, Workspace, SponsorSearch, SponsorRecommendation as SponsorRec } from '@/types/firestore';
import { 
  createSponsorSearch, 
  subscribeToWorkspaceSponsorSearches,
  updateSponsorContactStatus,
  addSponsorNote,
  deleteSponsorSearch
} from '@/lib/firebase/sponsorSearches';
import { canPerformSponsorSearch } from '@/lib/firebase/userSubscriptions';
import { Search, Crown, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface SponsorRecommendation {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  matchScore: number;
  matchReasons: string[];
  estimatedBudget: string;
  contactStrategy: string;
  website?: string;
  linkedIn?: string;
  keyContacts?: string[];
  pastSponsorships?: string[];
  valuesAlignment: string[];
  potentialActivations: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'title' | 'official' | 'technical' | 'media' | 'local' | 'startup';
  contactStatus?: 'not_contacted' | 'contacted' | 'in_discussion' | 'accepted' | 'rejected';
  notes?: string;
}

interface GlobalInsights {
  marketAnalysis: string;
  bestApproachTiming: string;
  negotiationTips: string[];
  redFlags: string[];
}

interface SponsorsPageProps {
  user: FirebaseUser;
  userData: User | null;
}

const SPONSOR_TYPES = [
  { value: 'title', label: '🏆 Sponsor Titre', description: 'Sponsor principal avec naming rights' },
  { value: 'official', label: '✅ Sponsor Officiel', description: 'Partenaire officiel majeur' },
  { value: 'technical', label: '⚙️ Partenaire Technique', description: 'Équipementier, matériel' },
  { value: 'media', label: '📺 Partenaire Média', description: 'Couverture médiatique' },
  { value: 'local', label: '📍 Sponsor Local', description: 'Entreprises locales/régionales' },
  { value: 'startup', label: '🚀 Startup Partenaire', description: 'Startups innovantes' },
];

const INDUSTRIES = [
  'Sport & Fitness',
  'Banque & Assurance',
  'Automobile',
  'Télécommunications',
  'Grande Distribution',
  'Alimentation & Boissons',
  'Mode & Lifestyle',
  'Technologie',
  'Énergie',
  'Santé & Bien-être',
  'Immobilier',
  'Transport & Mobilité',
];

const BUDGET_RANGES = [
  '< 5 000€',
  '5 000€ - 15 000€',
  '15 000€ - 50 000€',
  '50 000€ - 100 000€',
  '100 000€ - 500 000€',
  '> 500 000€',
];

function SponsorsPage({ user, userData }: SponsorsPageProps) {
  const router = useRouter();
  const { id: workspaceId } = router.query;
  
  const { workspace, isLoading: workspaceLoading } = useWorkspaceById(
    typeof workspaceId === 'string' ? workspaceId : undefined
  );

  // Abonnement utilisateur
  const {
    activeSubscription,
    hasActiveSubscription,
    isOneShot,
    isBasic,
    isPro,
    searchesPerMonth,
    searchesUsed,
    remainingSearches,
    loading: subscriptionLoading,
    canSearch: checkCanSearch,
    refresh: refreshSubscription,
  } = useUserSubscription(user?.uid);

  // États du formulaire
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState('');
  const [audienceSize, setAudienceSize] = useState('');
  const [mediaExposure, setMediaExposure] = useState('');
  const [specificNeeds, setSpecificNeeds] = useState('');

  // États des résultats
  const [recommendations, setRecommendations] = useState<SponsorRecommendation[]>([]);
  const [globalInsights, setGlobalInsights] = useState<GlobalInsights | null>(null);
  const [error, setError] = useState('');
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  
  // Historique des recherches
  const [searchHistory, setSearchHistory] = useState<SponsorSearch[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorRecommendation | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'priority' | 'budget'>('score');

  // Animation des résultats
  const [visibleCards, setVisibleCards] = useState<number>(0);

  // S'abonner aux recherches en temps réel et charger la dernière automatiquement
  useEffect(() => {
    if (!workspaceId || typeof workspaceId !== 'string') return;
    
    setLoadingHistory(true);
    
    const unsubscribe = subscribeToWorkspaceSponsorSearches(workspaceId, (searches) => {
      setSearchHistory(searches);
      setLoadingHistory(false);
      
      // Charger automatiquement la dernière recherche au premier chargement seulement
      if (!hasAutoLoaded && searches.length > 0) {
        const lastSearch = searches[0]; // La plus récente (triée par date desc)
        setRecommendations(lastSearch.recommendations as SponsorRecommendation[]);
        setGlobalInsights(lastSearch.globalInsights || null);
        setCurrentSearchId(lastSearch.id);
        setEventName(lastSearch.eventName);
        setEventDate(lastSearch.eventDate || '');
        setEventDescription(lastSearch.eventDescription);
        setTargetBudget(lastSearch.targetBudget);
        setSelectedTypes(lastSearch.sponsorTypes);
        setSelectedIndustries(lastSearch.industries || []);
        setValues(lastSearch.values || []);
        setAudienceSize(lastSearch.audienceSize || '');
        setMediaExposure(lastSearch.mediaExposure || '');
        setSpecificNeeds(lastSearch.specificNeeds || '');
        setStep('results');
        setVisibleCards(lastSearch.recommendations.length);
        setHasAutoLoaded(true);
      }
    });
    
    return () => unsubscribe();
  }, [workspaceId, hasAutoLoaded]);

  useEffect(() => {
    if (step === 'results' && recommendations.length > 0) {
      const timer = setInterval(() => {
        setVisibleCards((prev) => {
          if (prev >= recommendations.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [step, recommendations.length]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = (value: string) => {
    setValues(values.filter((v) => v !== value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName || !eventDescription || !targetBudget || selectedTypes.length === 0) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier les crédits de recherche avant de continuer
    if (!user?.uid) {
      setError('Vous devez être connecté pour effectuer une recherche');
      return;
    }

    const canSearchResult = await checkCanSearch();
    if (!canSearchResult.canSearch) {
      setError(canSearchResult.reason || 'Vous n\'avez pas de crédits de recherche disponibles. Veuillez souscrire à un abonnement.');
      router.push('/subscription');
      return;
    }

    setError('');
    setStep('loading');
    setVisibleCards(0);

    try {
      const response = await fetch('/api/recommend-sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceData: {
            name: workspace?.name,
            description: workspace?.description,
            type: workspace?.type,
            enrichedData: workspace?.enrichedData,
          },
          sponsorNeeds: {
            eventName,
            eventDate,
            eventDescription,
            targetBudget,
            sponsorTypes: selectedTypes,
            industries: selectedIndustries,
            values,
            audienceSize,
            mediaExposure,
            specificNeeds,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des recommandations');
      }

      const data = await response.json();
      const recs = data.recommendations || [];
      setRecommendations(recs);
      setGlobalInsights(data.globalInsights || null);
      
      // Sauvegarder dans Firestore
      if (recs.length > 0 && typeof workspaceId === 'string') {
        try {
          const searchId = await createSponsorSearch(workspaceId, user.uid, {
            eventName,
            eventDate,
            eventDescription,
            targetBudget,
            sponsorTypes: selectedTypes,
            industries: selectedIndustries,
            values,
            audienceSize,
            mediaExposure,
            specificNeeds,
            recommendations: recs,
            globalInsights: data.globalInsights,
          });
          setCurrentSearchId(searchId);
          console.log('Recherche sauvegardée avec ID:', searchId);

          // Enregistrer l'utilisation du crédit de recherche
          try {
            const { consumeSearchCredit } = await import('@/lib/firebase/userSubscriptions');
            const result = await consumeSearchCredit(
              user.uid,
              workspaceId,
              searchId,
              eventName,
              recs.length
            );
            if (result.success) {
              console.log('✅ Crédit de recherche utilisé avec succès');
              // Rafraîchir l'abonnement pour mettre à jour les compteurs
              await refreshSubscription();
            } else {
              console.error('❌ Erreur lors de l\'enregistrement du crédit:', result.error);
            }
          } catch (creditError) {
            console.error('❌ Erreur lors de l\'enregistrement du crédit:', creditError);
            // Continue anyway, la recherche est créée
          }
        } catch (saveError) {
          console.error('Erreur lors de la sauvegarde:', saveError);
          // Continue anyway, les résultats sont affichés
        }
      }
      
      setStep('results');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Une erreur est survenue');
      setStep('form');
    }
  };
  
  // Charger une recherche précédente
  const loadPreviousSearch = (search: SponsorSearch) => {
    setRecommendations(search.recommendations as SponsorRecommendation[]);
    setGlobalInsights(search.globalInsights || null);
    setCurrentSearchId(search.id);
    setEventName(search.eventName);
    setShowHistory(false);
    setStep('results');
    setVisibleCards(search.recommendations.length);
  };
  
  // Mettre à jour le statut d'un sponsor
  const handleUpdateContactStatus = async (
    sponsorId: string, 
    status: 'not_contacted' | 'contacted' | 'in_discussion' | 'accepted' | 'rejected'
  ) => {
    if (!currentSearchId) return;
    
    try {
      await updateSponsorContactStatus(currentSearchId, sponsorId, status);
      // Mettre à jour localement
      setRecommendations(prev => prev.map(r => 
        r.id === sponsorId ? { ...r, contactStatus: status } : r
      ));
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

  const filteredRecommendations = recommendations
    .filter((r) => filterPriority === 'all' || r.priority === filterPriority)
    .filter((r) => filterCategory === 'all' || r.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-emerald-500 to-green-600';
      case 'medium': return 'from-amber-500 to-orange-500';
      case 'low': return 'from-slate-400 to-slate-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: '🔥 Haute priorité' };
      case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-800', label: '⚡ Priorité moyenne' };
      case 'low': return { bg: 'bg-slate-100', text: 'text-slate-700', label: '📋 Priorité basse' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', label: priority };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'title': return '🏆';
      case 'official': return '✅';
      case 'technical': return '⚙️';
      case 'media': return '📺';
      case 'local': return '📍';
      case 'startup': return '🚀';
      default: return '🤝';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-slate-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-slate-400 to-slate-500';
  };

  if (workspaceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20 blur-xl animate-pulse"></div>
          </div>
          <p className="mt-6 text-purple-200 text-xl font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 text-center max-w-md">
          <h3 className="text-2xl font-bold text-white mb-4">Workspace introuvable</h3>
          <button
            onClick={() => router.push('/my-workspaces')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all"
          >
            Retour aux workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Recommandations Sponsors - {workspace.name} | Dataxx</title>
        <meta name="description" content="Trouvez les sponsors parfaits pour votre projet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href={`/workspace/${workspaceId}`}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour
                </Link>
                <div className="h-6 w-px bg-white/20"></div>
                <h1 className="text-xl font-bold text-white">{workspace.name}</h1>
              </div>
              <div className="flex items-center gap-3">
                {/* Affichage de l'abonnement */}
                {!subscriptionLoading && (
                  <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                    hasActiveSubscription 
                      ? isPro ? 'bg-amber-500/20 border border-amber-400/30 text-amber-200' 
                        : isBasic ? 'bg-violet-500/20 border border-violet-400/30 text-violet-200'
                        : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-200'
                      : 'bg-slate-500/20 border border-slate-400/30 text-slate-300'
                  }`}>
                    {hasActiveSubscription ? (
                      <>
                        {isPro ? <Crown className="w-4 h-4" /> :
                         isBasic ? <Sparkles className="w-4 h-4" /> :
                         <Zap className="w-4 h-4" />}
                        <span className="text-sm font-semibold">
                          {activeSubscription?.planName}
                        </span>
                        <div className="h-4 w-px bg-white/30 mx-1"></div>
                        <Search className="w-4 h-4" />
                        <span className="text-sm">
                          {remainingSearches}
                          {activeSubscription?.isRecurring && `/${searchesPerMonth}`}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Aucun abonnement</span>
                        <button
                          onClick={() => router.push('/subscription')}
                          className="ml-2 text-xs underline hover:no-underline"
                        >
                          Souscrire
                        </button>
                      </>
                    )}
                  </div>
                )}
                {searchHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      showHistory 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Historique ({searchHistory.length})
                  </button>
                )}
                {step === 'results' && (
                  <button
                    onClick={() => {
                      setStep('form');
                      setRecommendations([]);
                      setGlobalInsights(null);
                      setCurrentSearchId(null);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Nouvelle recherche
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
              <span className="animate-pulse">✨</span>
              <span className="text-purple-200 text-sm font-medium">Powered by AI</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4">
              Sponsor Finder
            </h1>
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
              Découvrez les sponsors parfaits pour votre projet grâce à notre IA avancée
            </p>
          </div>

          {/* Indicateur de recherche sauvegardée */}
          {step === 'results' && currentSearchId && (
            <div className="mb-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/30 rounded-xl">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-200 font-medium">
                    ✅ Recherche sauvegardée : <span className="text-white font-bold">{eventName}</span>
                  </p>
                  <p className="text-emerald-300/70 text-sm">
                    Les modifications de statut sont enregistrées automatiquement dans Firestore
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 rounded-lg text-xs font-medium">
                  ID: {currentSearchId.slice(0, 8)}...
                </span>
              </div>
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Historique des recherches
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {loadingHistory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-white/60 mt-2">Chargement...</p>
                </div>
              ) : searchHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">Aucune recherche précédente</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {searchHistory.map((search) => (
                    <div
                      key={search.id}
                      className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
                      onClick={() => loadPreviousSearch(search)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                            {search.eventName}
                          </h3>
                          <p className="text-white/60 text-sm mt-1 line-clamp-2">
                            {search.eventDescription}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="text-purple-300">
                              {search.totalRecommendations} sponsors
                            </span>
                            <span className="text-emerald-300">
                              {search.highPriorityCount} haute priorité
                            </span>
                            <span className="text-blue-300">
                              {search.averageMatchScore}% match moyen
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-white/40 text-xs">
                            {search.createdAt?.toDate?.().toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-white/40 text-xs">
                            {search.createdAt?.toDate?.().toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              loadPreviousSearch(search);
                            }}
                            className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors"
                          >
                            Charger →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl flex items-center gap-3 max-w-3xl mx-auto">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <>
              {/* Alerte crédits insuffisants */}
              {!subscriptionLoading && !hasActiveSubscription && (
                <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                    <div>
                      <p className="text-amber-200 font-bold text-lg mb-1">Aucun abonnement actif</p>
                      <p className="text-amber-300/80 text-sm">
                        Vous devez souscrire à un abonnement pour effectuer des recherches de sponsors.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/subscription')}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                  >
                    Souscrire maintenant
                  </button>
                </div>
              )}
              {!subscriptionLoading && hasActiveSubscription && remainingSearches === 0 && (
                <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-red-200 font-bold text-lg mb-1">Crédits épuisés</p>
                      <p className="text-red-300/80 text-sm">
                        Vous avez utilisé toutes vos recherches ce mois-ci ({searchesUsed}/{searchesPerMonth}).
                        {activeSubscription?.isRecurring ? ' Elles seront réinitialisées le mois prochain.' : ''}
                      </p>
                    </div>
                  </div>
                  {activeSubscription?.isRecurring && (
                    <button
                      onClick={() => router.push('/subscription')}
                      className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                    >
                      Passer au plan supérieur
                    </button>
                  )}
                </div>
              )}
              {!subscriptionLoading && hasActiveSubscription && remainingSearches > 0 && (
                <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/30 rounded-xl">
                    <Search className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-200 font-semibold">
                      {remainingSearches} recherche{remainingSearches > 1 ? 's' : ''} disponible{remainingSearches > 1 ? 's' : ''}
                      {activeSubscription?.isRecurring && ` (${searchesUsed}/${searchesPerMonth} utilisées ce mois)`}
                    </p>
                    <p className="text-emerald-300/70 text-sm">
                      Plan {activeSubscription?.planName}
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
              {/* Workspace Summary */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="p-2 bg-purple-500/20 rounded-xl">📊</span>
                  Données de votre workspace
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-300 text-sm mb-1">Nom</p>
                    <p className="text-white font-semibold">{workspace.name}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-300 text-sm mb-1">Type</p>
                    <p className="text-white font-semibold capitalize">{workspace.type || 'Non défini'}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-300 text-sm mb-1">Données enrichies</p>
                    <p className="text-white font-semibold">
                      {workspace.enrichedData ? '✅ Disponibles' : '❌ Non disponibles'}
                    </p>
                  </div>
                </div>
                {workspace.description && (
                  <p className="mt-4 text-purple-200/80 text-sm">{workspace.description}</p>
                )}
              </div>

              {/* Event Details */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="p-2 bg-pink-500/20 rounded-xl">🎯</span>
                  Votre événement / projet
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Nom de l'événement *
                    </label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="Ex: T24 - Triathlon 24h"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Date de l'événement
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Description de l'événement *
                    </label>
                    <textarea
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Décrivez votre événement, son objectif, son audience cible..."
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sponsor Needs */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="p-2 bg-blue-500/20 rounded-xl">💰</span>
                  Vos besoins en sponsoring
                </h2>
                
                {/* Budget */}
                <div className="mb-6">
                  <label className="block text-purple-200 text-sm font-medium mb-3">
                    Budget cible recherché *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BUDGET_RANGES.map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setTargetBudget(budget)}
                        className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                          targetBudget === budget
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sponsor Types */}
                <div className="mb-6">
                  <label className="block text-purple-200 text-sm font-medium mb-3">
                    Types de sponsors recherchés *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {SPONSOR_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeToggle(type.value)}
                        className={`p-4 rounded-xl border transition-all text-left ${
                          selectedTypes.includes(type.value)
                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{type.label}</p>
                            <p className="text-white/60 text-sm">{type.description}</p>
                          </div>
                          {selectedTypes.includes(type.value) && (
                            <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div className="mb-6">
                  <label className="block text-purple-200 text-sm font-medium mb-3">
                    Industries ciblées (optionnel)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => handleIndustryToggle(industry)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedIndustries.includes(industry)
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Values */}
                <div className="mb-6">
                  <label className="block text-purple-200 text-sm font-medium mb-3">
                    Valeurs importantes pour vous (optionnel)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                      placeholder="Ex: Innovation, Durabilité, Performance..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={addValue}
                      className="px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                  {values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white rounded-full text-sm"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeValue(value)}
                            className="hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Taille de l'audience estimée
                    </label>
                    <input
                      type="text"
                      value={audienceSize}
                      onChange={(e) => setAudienceSize(e.target.value)}
                      placeholder="Ex: 5000 spectateurs, 100k sur les réseaux..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Exposition médiatique prévue
                    </label>
                    <input
                      type="text"
                      value={mediaExposure}
                      onChange={(e) => setMediaExposure(e.target.value)}
                      placeholder="Ex: Presse locale, TV régionale, Instagram..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Besoins spécifiques (optionnel)
                    </label>
                    <textarea
                      value={specificNeeds}
                      onChange={(e) => setSpecificNeeds(e.target.value)}
                      placeholder="Précisez vos besoins particuliers : matériel, logistique, contreparties spéciales..."
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={subscriptionLoading || !hasActiveSubscription || remainingSearches === 0}
                className={`w-full py-5 font-bold text-xl rounded-2xl shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 group ${
                  subscriptionLoading || !hasActiveSubscription || remainingSearches === 0
                    ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 hover:bg-pos-100 text-white shadow-purple-500/30 hover:shadow-purple-500/50'
                }`}
              >
                <span className="text-2xl group-hover:animate-bounce">🚀</span>
                {subscriptionLoading ? 'Chargement...' :
                 !hasActiveSubscription ? 'Souscrire à un abonnement' :
                 remainingSearches === 0 ? 'Crédits épuisés' :
                 `Générer mes recommandations personnalisées (${remainingSearches} crédit${remainingSearches > 1 ? 's' : ''} restant${remainingSearches > 1 ? 's' : ''})`}
                {!(subscriptionLoading || !hasActiveSubscription || remainingSearches === 0) && (
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </form>
            </>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="text-5xl animate-pulse">🔍</span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Analyse en cours...</h2>
              <p className="text-purple-200 text-lg mb-8">
                Notre IA analyse votre profil et recherche les sponsors les plus pertinents
              </p>
              <div className="space-y-4 text-left max-w-md mx-auto">
                {[
                  'Analyse des données du workspace',
                  'Identification des critères de matching',
                  'Recherche des sponsors compatibles',
                  'Calcul des scores de pertinence',
                  'Génération des stratégies de contact',
                ].map((text, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                      idx <= Math.floor(Date.now() / 1000) % 5
                        ? 'bg-white/10 text-white'
                        : 'text-white/40'
                    }`}
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      idx <= Math.floor(Date.now() / 1000) % 5
                        ? 'bg-purple-500'
                        : 'bg-white/20'
                    }`}>
                      {idx <= Math.floor(Date.now() / 1000) % 5 ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                      )}
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && (
            <div className="space-y-8">
              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {recommendations.length}
                  </p>
                  <p className="text-purple-200 text-sm mt-1">Sponsors trouvés</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                    {recommendations.filter((r) => r.priority === 'high').length}
                  </p>
                  <p className="text-purple-200 text-sm mt-1">Haute priorité</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {Math.round(recommendations.reduce((acc, r) => acc + r.matchScore, 0) / recommendations.length || 0)}%
                  </p>
                  <p className="text-purple-200 text-sm mt-1">Score moyen</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    {new Set(recommendations.map((r) => r.industry)).size}
                  </p>
                  <p className="text-purple-200 text-sm mt-1">Industries</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200 text-sm">Priorité:</span>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">Toutes</option>
                      <option value="high">Haute</option>
                      <option value="medium">Moyenne</option>
                      <option value="low">Basse</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200 text-sm">Catégorie:</span>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">Toutes</option>
                      <option value="title">Titre</option>
                      <option value="official">Officiel</option>
                      <option value="technical">Technique</option>
                      <option value="media">Média</option>
                      <option value="local">Local</option>
                      <option value="startup">Startup</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200 text-sm">Trier par:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="score">Score</option>
                      <option value="priority">Priorité</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((sponsor, idx) => {
                  const priority = getPriorityBadge(sponsor.priority);
                  const isVisible = idx < visibleCards;

                  return (
                    <div
                      key={sponsor.id}
                      className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-500 cursor-pointer group ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${idx * 50}ms` }}
                      onClick={() => setSelectedSponsor(sponsor)}
                    >
                      {/* Score Header */}
                      <div className={`bg-gradient-to-r ${getScoreGradient(sponsor.matchScore)} p-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getCategoryIcon(sponsor.category)}</span>
                            <span className="text-white/90 text-sm font-medium capitalize">
                              {sponsor.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-white">{sponsor.matchScore}%</p>
                            <p className="text-white/70 text-xs">match</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                              {sponsor.name}
                            </h3>
                            <p className="text-purple-300 text-sm">{sponsor.industry}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${priority.bg} ${priority.text}`}>
                              {priority.label}
                            </span>
                            {sponsor.contactStatus && sponsor.contactStatus !== 'not_contacted' && (
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                sponsor.contactStatus === 'contacted' ? 'bg-blue-500/30 text-blue-200' :
                                sponsor.contactStatus === 'in_discussion' ? 'bg-amber-500/30 text-amber-200' :
                                sponsor.contactStatus === 'accepted' ? 'bg-emerald-500/30 text-emerald-200' :
                                sponsor.contactStatus === 'rejected' ? 'bg-red-500/30 text-red-200' :
                                'bg-slate-500/30 text-slate-200'
                              }`}>
                                {sponsor.contactStatus === 'contacted' ? '📧 Contacté' :
                                 sponsor.contactStatus === 'in_discussion' ? '💬 Discussion' :
                                 sponsor.contactStatus === 'accepted' ? '✅ Accepté' :
                                 sponsor.contactStatus === 'rejected' ? '❌ Refusé' : ''}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-purple-200 text-sm font-medium mb-2">Budget estimé</p>
                          <p className="text-white font-bold">{sponsor.estimatedBudget}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-purple-200 text-sm font-medium mb-2">Raisons du match</p>
                          <ul className="space-y-1">
                            {sponsor.matchReasons.slice(0, 3).map((reason, i) => (
                              <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {sponsor.valuesAlignment.slice(0, 3).map((value, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs"
                            >
                              {value}
                            </span>
                          ))}
                        </div>

                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-purple-500/30">
                          <span>Voir les détails</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Global Insights */}
              {globalInsights && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-3 bg-purple-500/20 rounded-xl">💡</span>
                    Insights & Conseils stratégiques
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">📊 Analyse du marché</h3>
                      <p className="text-white/80">{globalInsights.marketAnalysis}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">⏰ Meilleur timing</h3>
                      <p className="text-white/80">{globalInsights.bestApproachTiming}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">✅ Conseils de négociation</h3>
                      <ul className="space-y-2">
                        {globalInsights.negotiationTips.map((tip, i) => (
                          <li key={i} className="text-white/80 flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-200 mb-3">⚠️ Points d'attention</h3>
                      <ul className="space-y-2">
                        {globalInsights.redFlags.map((flag, i) => (
                          <li key={i} className="text-white/80 flex items-start gap-2">
                            <span className="text-amber-400">!</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Sponsor Detail Modal */}
        {selectedSponsor && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSponsor(null)}
          >
            <div
              className="bg-slate-900 rounded-3xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${getScoreGradient(selectedSponsor.matchScore)} p-6 sticky top-0`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getCategoryIcon(selectedSponsor.category)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedSponsor.name}</h2>
                      <p className="text-white/80">{selectedSponsor.industry}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-black text-white">{selectedSponsor.matchScore}%</p>
                    <p className="text-white/70">matching</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Priority & Budget */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-300 text-sm mb-1">Priorité</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getPriorityBadge(selectedSponsor.priority).bg} ${getPriorityBadge(selectedSponsor.priority).text}`}>
                      {getPriorityBadge(selectedSponsor.priority).label}
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-300 text-sm mb-1">Budget estimé</p>
                    <p className="text-white text-xl font-bold">{selectedSponsor.estimatedBudget}</p>
                  </div>
                </div>

                {/* Match Reasons */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">🎯 Pourquoi ce sponsor ?</h3>
                  <ul className="space-y-2">
                    {selectedSponsor.matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                        <span className="text-purple-400 text-xl">✓</span>
                        <span className="text-white/90">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Strategy */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-white mb-3">📧 Stratégie de contact recommandée</h3>
                  <p className="text-white/90 leading-relaxed">{selectedSponsor.contactStrategy}</p>
                </div>

                {/* Values & Activations */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">💎 Valeurs alignées</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSponsor.valuesAlignment.map((value, i) => (
                        <span key={i} className="px-3 py-1.5 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">🎪 Activations potentielles</h3>
                    <ul className="space-y-2">
                      {selectedSponsor.potentialActivations.map((activation, i) => (
                        <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="text-pink-400">→</span>
                          <span>{activation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Past Sponsorships */}
                {selectedSponsor.pastSponsorships && selectedSponsor.pastSponsorships.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">📜 Historique de sponsoring</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSponsor.pastSponsorships.map((past, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg text-sm">
                          {past}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statut de contact */}
                {currentSearchId && (
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-3">📞 Statut de contact</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'not_contacted', label: '⏳ Non contacté', color: 'bg-slate-500/30 text-slate-200' },
                        { value: 'contacted', label: '📧 Contacté', color: 'bg-blue-500/30 text-blue-200' },
                        { value: 'in_discussion', label: '💬 En discussion', color: 'bg-amber-500/30 text-amber-200' },
                        { value: 'accepted', label: '✅ Accepté', color: 'bg-emerald-500/30 text-emerald-200' },
                        { value: 'rejected', label: '❌ Refusé', color: 'bg-red-500/30 text-red-200' },
                      ].map((status) => (
                        <button
                          key={status.value}
                          onClick={() => handleUpdateContactStatus(
                            selectedSponsor.id, 
                            status.value as any
                          )}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedSponsor.contactStatus === status.value
                              ? status.color + ' ring-2 ring-white/50'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  {selectedSponsor.website && (
                    <a
                      href={selectedSponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visiter le site
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedSponsor(null)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% auto;
        }
        .bg-pos-100:hover {
          background-position: 100% center;
        }
      `}</style>
    </>
  );
}

export default withAuth(SponsorsPage);

