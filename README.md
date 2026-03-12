# SOYUZ BC North America — Master Platform

> Design reference: https://soyuzhockey.com/  
> Stack: Next.js 14 · TypeScript · Tailwind CSS · Supabase · Stripe · Vercel

---

## Architecture des branches

| Branche | Description |
|---|---|
| `main` | Production stable |
| `develop` | Intégration de toutes les features |
| `feature/storefront` | Site vitrine public (miroir soyuzhockey.com) |
| `feature/b2b` | Portail B2B revendeurs |
| `feature/affiliate` | Système d'affiliation & liens trackés |
| `feature/admin` | Dashboard admin (prix, stock, commandes) |
| `feature/api` | Routes API Erplain sync & webhooks |

---

## Structure du projet

```
soyuz-app-dashboard/
├── apps/
│   ├── web/                    # Storefront public (Next.js)
│   │   ├── app/
│   │   │   ├── (storefront)/   # Pages publiques
│   │   │   ├── (b2b)/          # Portail revendeurs
│   │   │   ├── (affiliate)/    # Dashboard affiliés
│   │   │   └── (admin)/        # Dashboard admin
│   │   ├── components/
│   │   │   ├── ui/             # Composants réutilisables
│   │   │   ├── storefront/     # Hero, ProductCard, Cart
│   │   │   ├── b2b/            # Login B2B, commandes en gros
│   │   │   ├── affiliate/      # Stats, liens, commissions
│   │   │   └── admin/          # Tables produits, prix, stock
│   │   ├── lib/
│   │   │   ├── supabase.ts     # Client Supabase
│   │   │   ├── erplain.ts      # API Erplain sync
│   │   │   ├── stripe.ts       # Paiements Stripe
│   │   │   └── inventory.ts    # Logique inventaire centralisé
│   │   └── public/
│   │       └── assets/         # Logos, images batons
├── supabase/
│   ├── migrations/             # SQL schema
│   └── seed.sql                # Données initiales
├── docs/
│   ├── MASTER_PLAN.md          # Ce fichier
│   └── ENV_SETUP.md            # Variables d'environnement
└── README.md
```

---

## MASTER PLAN — Task List

### PHASE 1 — Setup & Infrastructure
- [ ] Cloner le repo localement
- [ ] Initialiser Next.js 14 avec TypeScript + Tailwind CSS
- [ ] Configurer Supabase (projet gratuit)
- [ ] Créer le schema SQL (produits, variants, stock, orders, affiliates, users)
- [ ] Configurer les variables d'environnement (.env.local)
- [ ] Déployer sur Vercel (domaine gratuit .vercel.app)

### PHASE 2 — Storefront Public (Miroir soyuzhockey.com)
- [ ] Hero section — fond carbone, texte blanc, CTA SHOP ALL
- [ ] Section Collections (batons par modèle)
- [ ] Page produit avec variants (flex, main, lie, côté)
- [ ] Panier + checkout Stripe
- [ ] Version mobile 100% optimisée
- [ ] Version desktop optimisée à l'achat
- [ ] SEO de base (meta tags, og images)

### PHASE 3 — Inventaire Centralisé
- [ ] Sync API Erplain → Supabase (webhook ou cron)
- [ ] Table `products` avec variants et prix
- [ ] Stock temps réel partagé entre storefront + B2B
- [ ] Admin peut modifier les prix → Stripe s'update automatiquement

### PHASE 4 — Portail B2B
- [ ] Authentification revendeurs (email + mot de passe)
- [ ] Approbation manuelle par admin
- [ ] Prix de gros séparés des prix publics
- [ ] Formulaire de commande B2B
- [ ] Historique des commandes
- [ ] Email automatique à la création de compte

### PHASE 5 — Système d'Affiliation
- [ ] Génération de liens uniques par affilié
- [ ] Tracking des clics et conversions
- [ ] Dashboard affilié (stats, commissions, retraits)
- [ ] Commission configurable par admin (%)
- [ ] Paiement commission via Stripe Connect

### PHASE 6 — Dashboard Admin
- [ ] Vue d'ensemble (ventes, stock, affiliés actifs)
- [ ] Modifier prix produits → update Stripe en temps réel
- [ ] Gestion des commandes (fulfillment)
- [ ] Approuver/rejeter comptes B2B et affiliés
- [ ] Sync manuelle Erplain si besoin

### PHASE 7 — Canaux de vente sociaux
- [ ] Facebook Shop → pointer vers le storefront
- [ ] Instagram Shopping → pointer vers le storefront
- [ ] TikTok Shop → pointer vers le storefront
- [ ] Liens Storefront comme source unique de vérité

### PHASE 8 — Tests & Lancement
- [ ] Tests end-to-end (Playwright)
- [ ] Test paiement Stripe (mode test → production)
- [ ] Test sync inventaire Erplain
- [ ] Revue mobile + desktop
- [ ] Mise en production

---

## Variables d'environnement requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Erplain
ERPLAIN_API_KEY=
ERPLAIN_SUBDOMAIN=soyuz-hockey

# App
NEXT_PUBLIC_APP_URL=https://soyuz-app-dashboard.vercel.app
ADMIN_EMAIL=
```

---

## Comment cloner et démarrer localement

```bash
# 1. Cloner le repo
git clone https://github.com/danduclos420/soyuz-app-dashboard.git
cd soyuz-app-dashboard

# 2. Installer les dépendances
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# 4. Démarrer en développement
npm run dev

# Ouvrir http://localhost:3000
```

---

## Branches — workflow Git

```bash
# Travailler sur une feature
git checkout develop
git checkout -b feature/storefront

# Après le travail
git add .
git commit -m "feat: hero section storefront"
git push origin feature/storefront

# Merger dans develop quand prêt
git checkout develop
git merge feature/storefront
```

---

*Dernière mise à jour: 2026 — SOYUZ BC North America*

---

## Section B2B — Spec Storefront

### Objectif
Ajouter une section visible sur le storefront public qui invite les revendeurs/boutiques à s'inscrire au programme B2B.
Lorsqu'un visiteur clique sur le CTA, il est redirigé vers le portail d'inscription Erplain.

### Comportement attendu
- **Lien de redirection :** `https://soyuz-hockey.erplain.app/b2b/login`
- **Cible :** `_blank` (ouvre dans un nouvel onglet)
- **Placement :** Section dédiée sur la page d'accueil, après les collections

### Design de la section
```
[FOND CARBONE FONCÉ / GRADIENT NOIR]

TITLE:  "DEVENEZ REVENDEUR SOYUZ BC"
SUBTITLE: "Accédez à nos prix de gros et commandez directement via notre portail B2B."

[LISTE D'AVANTAGES]
✔ Prix exclusifs revendeurs
✔ Inventaire en temps réel
✔ Commandes simplifiées
✔ Support dédié

[BOUTON CTA] "ACCEDER AU PORTAIL B2B" → https://soyuz-hockey.erplain.app/b2b/login
```

### Code composant (Next.js / Tailwind)
```tsx
// components/storefront/B2BSection.tsx
export default function B2BSection() {
  return (
    <section className="bg-[#0D0D0D] py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-4">
          Devenez Revendeur SOYUZ BC
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Accédez à nos prix de gros et commandez directement via notre portail B2B.
        </p>
        <ul className="text-left inline-block text-gray-300 mb-10 space-y-2">
          <li>✔ Prix exclusifs revendeurs</li>
          <li>✔ Inventaire en temps réel</li>
          <li>✔ Commandes simplifiées</li>
          <li>✔ Support dédié</li>
        </ul>
        <div>
          <a
            href="https://soyuz-hockey.erplain.app/b2b/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-200 transition"
          >
            Accéder au Portail B2B
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Intégration dans la page d'accueil
```tsx
// app/page.tsx
import B2BSection from "@/components/storefront/B2BSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CollectionsSection />
      <B2BSection />  {/* <- Ajouter ici */}
      <Footer />
    </main>
  );
}
```

### Navigation (optionnel)
Ajouter un lien "B2B" dans la barre de navigation principale qui fait un scroll vers la section ou redirige directement vers le portail.

```tsx
<a
  href="https://soyuz-hockey.erplain.app/b2b/login"
  target="_blank"
  rel="noopener noreferrer"
  className="nav-link"
>
  B2B
</a>
```
