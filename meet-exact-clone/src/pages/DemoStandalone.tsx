import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Loader2 } from "lucide-react";
import { sendDemoRequest, type DemoRequestData } from "../services/emailService";
import Header from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";

const founders = [
  { name: "Clément Authier", role: "CEO & Co-founder", image: "/lovable-uploads/clem.jpeg", linkedin: "https://www.linkedin.com/in/clément-authier-3a8a75206/" },
  { name: "Martin Masseline", role: "COO & Co-founder", image: "/lovable-uploads/martin.jpeg", linkedin: "https://www.linkedin.com/in/martin-masseline-5282a01ba/" },
  { name: "Louis Rodriguez", role: "CTO & Co-founder", image: "/lovable-uploads/louis.jpeg", linkedin: "https://www.linkedin.com/in/louis-rodriguez1/" },
];

export default function DemoStandalone() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", company: "", phone: "", message: ""
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      setError(t('demo.form.error.required'));
      return;
    }
    setIsLoading(true);
    try {
      await sendDemoRequest(formData as DemoRequestData);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('demo.form.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">{t('demo.success.title')}</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              {t('demo.success.message')}
            </p>
            <a href="/" className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-md">
              {t('demo.success.cta')}
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white flex flex-col">
      <Header />
      <div className="w-full px-4 sm:px-12 py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-transparent to-transparent"></div>

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-3 sm:mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{t('demo.title')}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-justify md:text-justify text-slate-600 mb-8 sm:mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            {t('demo.description')}
          </p>

          <div className="flex flex-col lg:grid lg:grid-cols-[42%_58%] gap-6 sm:gap-10 items-start lg:items-stretch w-full max-w-7xl mx-auto">
            {/* Colonne gauche */}
            <div className="h-full flex flex-col justify-between gap-4 sm:gap-6 w-full">
              {/* Carte infos contact */}
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">{t('demo.contact.title')}</h2>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-slate-700 text-base sm:text-lg">
                  <div className="bg-slate-100 p-2 sm:p-3 rounded-lg"><Mail className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" /></div>
                  <a href="mailto:contact@dataxx.fr" className="hover:text-slate-900 transition-colors duration-200 text-sm sm:text-base">{t('demo.contact.email')}</a>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-slate-700 text-base sm:text-lg">
                  <div className="bg-slate-100 p-2 sm:p-3 rounded-lg"><Phone className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" /></div>
                  <a href="tel:+33783339293" className="hover:text-slate-900 transition-colors duration-200 text-sm sm:text-base">{t('demo.contact.phone')}</a>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-slate-700 text-base sm:text-lg">
                  <div className="bg-slate-100 p-2 sm:p-3 rounded-lg"><MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" /></div>
                  <span className="text-sm sm:text-base">{t('demo.contact.location')}</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-slate-700 text-base sm:text-lg">
                  <div className="bg-slate-100 p-2 sm:p-3 rounded-lg"><Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" /></div>
                  <a href="https://www.linkedin.com/company/dataxx-ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors duration-200 text-sm sm:text-base">{t('demo.contact.linkedin')}</a>
                </div>
              </div>

              {/* Carte fondateurs */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">Rencontrez nos fondateurs</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-x-8 px-2">
                  {founders.map((f) => (
                    <div key={f.name} className="flex flex-col items-center group">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-slate-900 font-bold text-sm sm:text-base mb-1 sm:mb-2 whitespace-nowrap text-center group-hover:text-slate-700 transition-colors duration-200">{f.name}</div>
                      <div className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center">{f.role}</div>
                      <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 p-1.5 sm:p-2 bg-slate-50 rounded-full hover:shadow-lg transition-all duration-200">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite: Formulaire */}
            <div className="h-full relative rounded-2xl p-5 sm:p-8 flex flex-col justify-start shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden w-full">
              {/* Fond gris profond identique au bouton */}
              <div className="absolute inset-0 bg-[#0b1220]"></div>

              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{t('demo.form.title')}</h2>

                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-sm">{error}</div>}

                <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">{t('demo.form.firstName')}</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} required
                      className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-500 text-sm sm:text-base transition-all duration-200 hover:bg-white"
                      placeholder={t('demo.form.firstNamePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">{t('demo.form.lastName')}</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} required
                      className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-500 text-sm sm:text-base transition-all duration-200 hover:bg-white"
                      placeholder={t('demo.form.lastNamePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">{t('demo.form.email')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-500 text-sm sm:text-base transition-all duration-200 hover:bg-white"
                      placeholder={t('demo.form.emailPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">{t('demo.form.company')}</label>
                    <input name="company" value={formData.company} onChange={handleInputChange} required
                      className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-500 text-sm sm:text-base transition-all duration-200 hover:bg-white"
                      placeholder={t('demo.form.companyPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">{t('demo.form.phone')}</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-500 text-sm sm:text-base transition-all duration-200 hover:bg-white"
                      placeholder={t('demo.form.phonePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-semibold text-sm sm:text-base">{t('demo.form.message')}</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={3}
                      className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-500 text-sm sm:text-base transition-all duration-200 hover:bg-white resize-none min-h-[84px]"
                      placeholder={t('demo.form.messagePlaceholder')} />
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-lg sm:text-xl py-3.5 sm:py-5 px-6 sm:px-8 rounded-xl mt-4 sm:mt-6 w-full shadow-xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                    {isLoading ? (<span className="inline-flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('demo.form.loading')}</span>) : t('demo.form.submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


