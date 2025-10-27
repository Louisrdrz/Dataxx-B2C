# Dataxx – Guide rapide (non-tech)

Base actuelle du site: dossier `meet-exact-clone/` (commit de référence: 95956c0).

## Démarrer en local

```bash
cd meet-exact-clone
npm install
npm run dev
# Ouvrir l'URL affichée (ex: http://localhost:5173)
```

## Déployer (Vercel)
- Projet relié au repo GitHub sur la branche `main`.
- Après un commit sur `main`, Vercel build et déploie automatiquement.
- En cas de problème de cache, dans Vercel > Deployments > Redeploy > cocher "Clear build cache".

## Où modifier le contenu (sections principales)
Toutes les sections sont dans `meet-exact-clone/src/components/`.
- `Header.tsx` : barre de navigation et bouton “Demander une démo”.
- `HeroSection.tsx` : grand titre d’accueil et CTA.
- `TrustedBySection.tsx` : logos partenaires visibles sous le hero.
- `SupportersMarqueeSection.tsx` : bandeau défilant (si présent).
- `HowItWorksSection.tsx` : section “Comment ça marche” (cartes, radar, jauge…).
- `BenefitsSection.tsx` : bénéfices produit.
- `PositioningSection.tsx` : positionnement / promesse.
- `ProblemSection.tsx` : le problème adressé.
- `SolutionSection.tsx` : la solution proposée.
- `IAAgentsSection.tsx` : agents IA.
- `LeadFormSection.tsx` : formulaire de prise de contact.
- `FoundersSection.tsx` : présentation fondateurs.
- `AllInOneSection.tsx` : section récap si utilisée.
- `DataxxSlices.tsx` : éléments visuels/fondateurs + bandeaux.
- `Footer.tsx` : pied de page.

Pages (routing): `meet-exact-clone/src/pages/`
- `Index.tsx` : page d’accueil (importe les sections).
- `Legal.tsx` : mentions légales.
- `DemoStandalone.tsx` : page de démo dédiée.

## Textes et images
- Textes: directement dans les fichiers de section ci‑dessus.
- Images: `meet-exact-clone/src/assets/` (logos, photos…). Pour remplacer une image, garder le même nom de fichier ou mettre à jour l’import dans le composant.

## Styles & configuration
- Tailwind: `meet-exact-clone/tailwind.config.js`
- Styles globaux: `meet-exact-clone/src/index.css`
- Build Vite: `meet-exact-clone/vite.config.ts`
- TypeScript: `meet-exact-clone/tsconfig*.json`
- Vercel: `meet-exact-clone/vercel.json` (build/rewrites)

## Bonnes pratiques d’édition
- Faire une modification à la fois, puis “Aperçu en local”.
- Commit sur `main` pour déployer.
- En cas d’erreur de build sur Vercel, lancer un Redeploy avec “Clear build cache”.

---
Besoin d’aide pour une section précise ? Cherchez son fichier dans `src/components/` et modifiez uniquement les textes/visuels souhaités.
