import { useState } from "react";

const LeadFormSection = () => {
  const [email, setEmail] = useState("");
  const [club, setClub] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Placeholder webhook - à brancher sur votre outil (Make/Zapier/Email/API)
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, club }) });
      setSent(true);
    } catch (e) {
      setSent(true); // fallback UX
    }
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Parlons sponsoring</h2>
        <p className="text-muted-foreground mb-8">Laissez votre email et le nom de votre club. Nous vous recontactons rapidement.</p>
        {sent ? (
          <div className="bg-green-50 text-green-700 rounded-xl p-4">Merci ! Nous revenons vers vous très vite.</div>
        ) : (
          <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 text-left">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="vous@club.fr" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Club</label>
                <input value={club} onChange={(e) => setClub(e.target.value)} type="text" required placeholder="AS Montreuil" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="mt-6">
              <a href="/demo" className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300">Demander une démo</a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default LeadFormSection;


