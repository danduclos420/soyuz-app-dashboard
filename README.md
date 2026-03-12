🏒 SOYUZ BC — MASTER PLAN DE BUILD COMPLETStack : Next.js 14 + Supabase + Stripe + Vercel + GitHubDernière mise à jour : Mars 2026 | Version 1.0

ARCHITECTURE GLOBALEGitHub Repo: soyuz-bc-store  -> Vercel: soyuz-hockey.vercel.app
       |-- / (storefront public)
       |-- /products
       |-- /products/[slug]
       |-- /cart
       |-- /checkout
       |-- /account (dashboard client)
       |-- /rep (dashboard representant)
       |-- /admin (dashboard admin)

Backend Services (tous gratuits):
  |-- Supabase (DB + Auth + Storage + Realtime)
  |-- Stripe (paiements)
  |-- Erplain API (sync inventaire)
  |-- Resend (emails transactionnels)

PHASE 0 — SETUP ENVIRONNEMENTETAPE 0.1 — Comptes a creer[ ] Compte GitHub -> github.com[ ] Compte Vercel -> vercel.com (connecter avec GitHub)
[ ] Compte Supabase -> supabase.com (nouveau projet : soyuz-bc-store)
[ ] Compte Stripe -> stripe.com (activer PayPal, Google Pay, Apple Pay)
[ ] Compte Resend -> resend.com (emails gratuits - 3000/mois)

ETAPE 0.2 — Creer le repo GitHub1. Sur GitHub.com : New repository -> nom: "soyuz-bc-store"2. Visibility: Private
3. Add README: Yes
4. .gitignore: Node
5. Copier l'URL SSH ou HTTPS du repo

ETAPE 0.3 — Setup local (terminal / Cursor IDE)# 1. Creer le projet Next.jsnpx create-next-app@latest soyuz-bc-store --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Entrer dans le projet
cd soyuz-bc-store

# 3. Connecter au repo GitHub
git remote add origin https://github.com/danduclos420/soyuz-bc-store.git
git branch -M main
git push -u origin main

# 4. Installer toutes les dependances
npm install @supabase/supabase-js @supabase/ssr @stripe/stripe-js @stripe/react-stripe-js stripe zustand recharts react-hot-toast lucide-react framer-motion next-seo resend @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-accordion clsx tailwind-merge

ETAPE 0.4 — Variables d'environnement .env.local# SupabaseNEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_…
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…

# Erplain
ERPLAIN_API_KEY=votre_bearer_token (generer dans Edit my profile -> Generate API token)
ERPLAIN_API_URL=https://app.erplain.net/public-api/graphql/endpoint

# Resend (emails)
RESEND_API_KEY=re_…

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000 (prod: https://soyuz-hockey.vercel.app)
ADMIN_EMAIL=ton@email.com

ETAPE 0.5 — Deployer sur Vercel1. vercel.com -> New Project -> importer repo GitHub "soyuz-bc-store"2. Framework Preset: Next.js
3. Ajouter toutes les env variables (copier du .env.local)
4. Deploy -> recuperer l'URL .vercel.app
5. Mettre a jour NEXT_PUBLIC_APP_URL avec l'URL Vercel

PHASE 1 — BASE DE DONNEES SUPABASEETAPE 1.1 — Schema SQL complet des tablesCopier ce schema SQL dans Supabase -> SQL Editor -> New Query -> Run
TABLE: profiles (etend auth.users de Supabase)
  - id: UUID (reference auth.users)
  - email: TEXT NOT NULL
  - full_name: TEXT
  - role: TEXT (admin | rep | client) DEFAULT client
  - avatar_url: TEXT
  - phone: TEXT
  - address: JSONB
  - created_at / updated_at: TIMESTAMPTZ

TABLE: reps (representants)
  - id: UUID PRIMARY KEY
  - user_id: UUID (ref profiles)
  - code: TEXT UNIQUE (ex: DAN15)
  - status: pending | active | inactive
  - commission_rate: NUMERIC DEFAULT 10 (%)
  - approved_by: UUID (ref admin)
  - approved_at: TIMESTAMPTZ
 - notes: TEXT

TABLE: products (miroir Erplain)
  - id: UUID PRIMARY KEY
  - erplain_id: TEXT UNIQUE (ID dans Erplain pour la sync)
  - name: TEXT NOT NULL
  - slug: TEXT UNIQUE (URL friendly: hit-ultra-flex-75)
  - description: TEXT
  - price: NUMERIC NOT NULL
  - compare_price: NUMERIC (prix barre - promo)
  - images: TEXT[] (tableau d'URLs)
  - category: TEXT (HIT ULTRA, CLASSIC, MASTER FRST, etc.)
  - tags: TEXT[]
  - in_stock: BOOLEAN DEFAULT true
  - stock_qty: INTEGER DEFAULT 0
  - variants: JSONB (flex, courbe, taille, stock par variante)
  - specs: JSONB (kick point, poids, carbone, etc.)
  - is_featured: BOOLEAN DEFAULT false

TABLE: price_overrides (admin change les prix)
  - product_id: UUID (ref products)
  - price: NUMERIC NOT NULL
  - updated_by: UUID (ref admin profile)
  - updated_at: TIMESTAMPTZ

TABLE: orders (commandes)
  - id: UUID PRIMARY KEY
  - user_id: UUID (ref profiles - peut etre NULL si achat anonyme)
  - rep_code: TEXT (code du representant utilise)
  - rep_id: UUID (ref reps)
  - items: JSONB (liste des produits commandes)
  - subtotal / discount_pct / discount_amount / total: NUMERIC
  - stripe_payment_id / stripe_payment_status: TEXT
  - status: pending | paid | shipped | delivered | cancelled
  - shipping_address: JSONB
  - customer_email / customer_name / notes: TEXT

TABLE: commissions (commissions representants)
  - rep_id / order_id: UUID (references)
  - amount: NUMERIC (montant de la commission)
  - status: pending | paid
  - paid_at / paid_by: TIMESTAMPTZ / UUID

TABLE: favorites / stock_alerts / carts
  - favorites: user_id + product_id (UNIQUE ensemble)
  - stock_alerts: user_id + product_id + email + notified_at
  - carts: user_id + session_id + items JSONB + rep_code

IMPORTANT: RLS (Row Level Security) active sur toutes les tables- clients: voient seulement leurs propres donnees- reps (active): voient les produits + leurs commissions
- admin: acces complet a toutes les tables
- public: voient seulement les produits (pas les commandes)

ETAPE 1.2 — Auth + Middleware (middleware.ts)Redirections par role:  /admin/* -> role admin seulement (redirect /login si autre)
  /rep/* -> role rep + status active (redirect /login si autre)
  /account/* -> connecte (tous roles)

Callback auth inscription:
  -> Creation automatique du profil dans la table profiles
  -> role par defaut: client
  -> Email de bienvenue via Resend

PHASE 2 — LAYOUT + DESIGN GLOBALETAPE 2.1 — Theme SOYUZCouleurs:  Background principal:  #0D0D0D (noir carbone)
  Primary:               #FFFFFF (blanc)
  Accent SOYUZ:          #CC0000 (rouge)
  Cards / surfaces:      #1A1A1A (gris fonce)
  Texte secondaire:      #888888 (gris clair)

Typographie:
  Titres: font-sans bold uppercase (style militaire/sport)
  Corps: font-sans regular

Effets visuels:
  - Texture carbone (background-image CSS repeating-linear-gradient)
  - Holographique / irise sur certains elements (gradient rainbow)
  - Animations: framer-motion (slide-in, fade, hover scale)

ETAPE 2.2 — Composants globaux a creer<Header/>: logo SOYUZ BC, nav links, icone panier (badge qty), icone compte, menu hamburger mobile<Footer/>: liens, reseaux sociaux, copyright
<CartDrawer/>: slide depuis la droite, liste items, sous-total, code promo, bouton checkout
<AuthModal/>: connexion / inscription (modal global)
<Toast/>: notifications react-hot-toast
<ProductCard/>: image, titre, prix, favoris, badge stock
<LoadingSpinner/>, <Badge/>, <Button/>, <Input/>: composants UI de base

PHASE 3 — STOREFRONT PUBLICETAPE 3.1 — Page d'accueil / (route: app/page.tsx)Sections dans l'ordre:
1. HERO SECTION (full-screen)
   - Background: image batons SOYUZ carbone
   - Tagline animee: "DESIGNED FOR ELITE ATHLETES"
   - Sous-titre: "PROFESSIONAL HOCKEY STICKS - SOYUZ BC NORTH AMERICA"
   - CTA: bouton SHOP ALL + bouton DEVENIR REVENDEUR
   - Scroll indicator anime en bas

2. BANNIERE SCROLLANTE
   "STRENGTH IN UNITY . POWER WITH SOYUZ . BREAK THE LIMITS ."
   (animation infinite scroll horizontal, fond rouge #CC0000)

3. SECTION COLLECTIONS (carousel horizontal)
   Modeles: HIT ULTRA, CLASSIC, MASTER FRST, LORD Goalie, RAPID, ARCANE
   Chaque card: image, nom collection, nombre de produits, lien

4. PRODUITS VEDETTES
   Grille 2x2 mobile, 4 colonnes desktop
   Source: products ou is_featured = true

5. SECTION A PROPOS SOYUZ
   - KHL Sponsor, Carbon Fiber, The Golden Shot
   - Design inspire soyuzhockey.com

6. TEMOIGNAGES (carousel)
   Jeff WA, Frank TO, Jonas K, Lulu CA, Stacey PA

7. SECTION B2B (devenir revendeur)
   Fond carbone fonce / gradient noir
   Titre: "DEVENEZ REVENDEUR SOYUZ BC"
   Avantages: Prix exclusifs / Inventaire temps reel / Commandes simples / Support dedie
   CTA: "ACCEDER AU PORTAIL B2B" -> https://soyuz-hockey.erplain.app/b2b/login

8. CTA FINAL
   Bouton SHOP NOW + (optionnel: compteur flash sale)

ETAPE 3.2 — Page catalogue /productsFILTRES (sidebar desktop, drawer mobile):  - Categorie: HIT ULTRA, CLASSIC, MASTER FRST, LORD Goalie, RAPID, ARCANE
  - Flex: 65, 70, 75, 80, 85, 90, 95
  - Courbe: P28, P29, P90TM, P88
  - Taille: Senior, Intermediate, Junior
  - Prix: slider min/max
  - En stock seulement: toggle

GRILLE PRODUITS:
  - 2 colonnes mobile, 3-4 colonnes desktop
  - Tri: Prix croissant/decroissant, Nouveautes, Populaires
  - Infinite scroll ou pagination

CHAQUE <ProductCard/>:
  - Image produit (hover = 2e image)
  - Nom + variante
  - Prix (barre si compare_price existe)
  - Badge "RUPTURE" rouge si stock = 0
  - Bouton favoris (toggle, auth requis)
  - Bouton "M'AVERTIR" si rupture (cree stock_alert en DB)
  - Bouton "AJOUTER AU PANIER"

ETAPE 3.3 — Page produit /products/[slug]SECTIONS DE LA PAGE:
1. Gallery d'images
   - Swipe mobile, click desktop pour zoomer
   - Miniatures en bas

2. Infos produit
   - Nom + SKU
   - Prix (avec override si admin a change)

3. Selecteur de variantes
   - FLEX: radio buttons (65, 70, 75, 80, 85, 90, 95)
   - CURVE: radio buttons (P28, P29, P90TM, P88)
   - AGE RANGE: Senior / Intermediate / Junior
   - Stock affiche par variante selectionnee

4. Champ code representant
   - Input "Entrer un code representant"
   - Validation temps reel -> API /api/validate-code
   - Si valide: badge vert -15% + prix mis a jour visuellement
   - Si invalide: message d'erreur rouge

5. Boutons d'action
   - AJOUTER AU PANIER (animation check)
   - Favoris (coeur toggle)
   - M'AVERTIR si rupture

6. Accordeon specifications
   Kick Point, Poids, Construction carbone, Flex Profile, etc.

7. Produits similaires (meme categorie, 4 cards)

PHASE 4 — PANIER + CHECKOUTETAPE 4.1 — Panier (Zustand store)State global avec Zustand: lib/store/cart.ts  - items: CartItem[] (produit + variante + qty)
  - rep_code: string | null
  - discount: number (calcule depuis rep commission_rate)
  - addItem / removeItem / updateQty / clearCart
  - Persistance localStorage (persist middleware Zustand)
  - Sync avec table carts Supabase (si connecte)

ETAPE 4.2 — Page panier /cart  - Liste des items avec image, nom, variante, prix, quantite  - Modifier quantite ou supprimer
  - Champ code representant (si pas deja entre)
  - Recapitulatif: sous-total, reduction, total
  - Bouton PROCEDER AU PAIEMENT

ETAPE 4.3 — Checkout /checkout (Stripe)Flux de paiement:  1. Clic PROCEDER AU PAIEMENT
  2. API Route: POST /api/checkout/create-session
     - Cree une Stripe Checkout Session avec les items
     - Applique la reduction si rep_code valide
     - success_url: /success?session_id={CHECKOUT_SESSION_ID}
     - cancel_url: /cart
  3. Redirect vers Stripe Checkout (heberge par Stripe)
  4. Apres paiement -> Webhook Stripe -> /api/webhooks/stripe
     - Cree la commande dans table orders
     - Cree la commission dans table commissions
     - Envoie l'email de confirmation (Resend)
  5. Page /success: confirmation commande + numero

Methodes de paiement Stripe activees:
  - Carte de credit/debit (Visa, Mastercard)
  - Apple Pay
  - Google Pay
  - PayPal (activer dans Stripe Dashboard -> Payment methods)

PHASE 5 — DASHBOARD REPRESENTANT /repETAPE 5.1 — Inscription representantPage /rep/register:  - Formulaire: nom, email, region, message/motivation
  - Cree un compte Supabase Auth + profil + entree reps (status: pending)
  - Email a l'admin (Resend): "Nouvelle demande representant"
  - Message au representant: "Votre demande est en cours de traitement"

ETAPE 5.2 — Dashboard /rep (accessible si status active)Sections:  - Mon code: affichage gros + bouton copier (ex: DAN15)
  - Lien a partager: soyuz-hockey.vercel.app?ref=DAN15
  - Stats: ventes ce mois / total commissions / status commissions
  - Graphique recharts: ventes par mois (derniers 6 mois)
  - Tableau commissions: date, commande, montant, status (pending/paid)
  - Profile: modifier info, mot de passe

PHASE 6 — DASHBOARD ADMIN /adminETAPE 6.1 — Vue d'ensemble (Dashboard)  - KPI cards: ventes aujourd'hui, ventes ce mois, commandes en attente  - Graphique ventes par semaine (recharts)
  - Produits en rupture de stock (alerte rouge)
  - Representants actifs / en attente d'approbation

ETAPE 6.2 — Gestion des produits  - Tableau: tous les produits (nom, stock, prix, categorie)  - Modifier le prix -> price_overrides (update Stripe automatiquement)
  - Toggle is_featured (produits vedettes)
  - Bouton SYNC ERPLAIN: force la sync depuis l'API Erplain

ETAPE 6.3 — Gestion des commandes  - Tableau: toutes les commandes (date, client, montant, status)  - Filtrer par status: pending / paid / shipped / delivered
  - Changer status (marquer comme shipped -> email client automatique)
 - Details commande: items, adresse livraison, code rep utilise

ETAPE 6.4 — Gestion des representants  - Tableau: tous les reps (nom, code, status, commission %)  - Approuver / Rejeter les demandes en attente
  - Modifier le taux de commission
  - Marquer commissions comme payees
  - Desactiver un rep

PHASE 7 — SYNC INVENTAIRE ERPLAINETAPE 7.1 — Comment la sync fonctionneIMPORTANT: L'API Erplain est READ-ONLY (lecture seulement)Erplain = source de verite pour l'inventaire
Supabase = miroir mis a jour periodiquement

Methodes de sync:
  Option A - Cron job (recommande): toutes les heures
    -> Vercel Cron Job: /api/cron/sync-erplain
    -> Appelle GraphQL Erplain, compare avec Supabase, met a jour

  Option B - Manual sync: bouton dans /admin
    -> POST /api/admin/sync-erplain (auth admin requis)

ETAPE 7.2 — Route API de sync (lib/erplain.ts)Endpoint GraphQL: https://app.erplain.net/public-api/graphql/endpointHeader: Authorization: Bearer {ERPLAIN_API_KEY}

Requete GraphQL pour recuperer les produits:
query { products { id name reference quantity price images { url } } }

Logique de sync:
  1. Fetch tous les produits depuis Erplain
  2. Pour chaque produit Erplain:
     - Si erplain_id existe dans Supabase -> UPDATE stock_qty
     - Si erplain_id n'existe pas -> INSERT nouveau produit
  3. Mise a jour in_stock = stock_qty > 0

PHASE 8 — EMAILS TRANSACTIONNELS (Resend)Emails a implementer:
1. Bienvenue (inscription client)
   Objet: "Bienvenue chez SOYUZ BC!"
   Contenu: logo, message, lien shop

2. Confirmation de commande
   Objet: "Commande #XXXX confirmee - SOYUZ BC"
   Contenu: recapitulatif items, total, adresse livraison

3. Expedition
   Objet: "Votre commande #XXXX est en chemin!"
   Contenu: numero de suivi, transporteur

4. Representant: demande recue
   Objet: "Demande representant reçue"

5. Representant: approuve
   Objet: "Felicitations - Votre code representant est actif!"
   Contenu: code unique, instructions, lien /rep

6. Alerte rupture de stock resolue
   Objet: "Le produit que vous voulez est de retour!"
   Contenu: lien direct vers le produit

PHASE 9 — STRUCTURE DES FICHIERSsoyuz-bc-store/|-- app/
|   |-- page.tsx                  (accueil storefront)
|   |-- layout.tsx                (layout global)
|   |-- globals.css               (styles globaux + carbone)
|   |-- products/
|   |   |-- page.tsx              (catalogue /products)
|   |   |-- [slug]/page.tsx       (fiche produit)
|   |-- cart/page.tsx             (panier)
|   |-- checkout/page.tsx         (checkout Stripe)
|   |-- success/page.tsx          (confirmation commande)
|   |-- account/page.tsx          (dashboard client)
|   |-- rep/
|   |   |-- page.tsx              (dashboard representant)
|   |   |-- register/page.tsx     (inscription representant)
|   |-- admin/
|   |   |-- page.tsx              (dashboard admin)
|   |   |-- products/page.tsx     (gestion produits)
|   |   |-- orders/page.tsx       (gestion commandes)
|   |   |-- reps/page.tsx         (gestion representants)
|   |-- api/
|   |   |-- checkout/create-session/route.ts
|   |   |-- webhooks/stripe/route.ts
|   |   |-- validate-code/route.ts
|   |   |-- cron/sync-erplain/route.ts
|   |   |-- admin/sync-erplain/route.ts

|-- components/
|   |-- ui/                        (Button, Input, Badge, Modal)
|   |-- layout/                    (Header, Footer, CartDrawer)
|   |-- storefront/                (Hero, Collections, ProductCard)
|   |-- rep/                       (RepDashboard, CommissionsTable)
|   |-- admin/                     (AdminTable, SyncButton)

|-- lib/
|   |-- supabase/                  (client.ts, server.ts)
|   |-- erplain.ts                 (GraphQL sync)
|   |-- stripe.ts                  (client Stripe)
|   |-- resend.ts                  (client email)
|   |-- store/cart.ts              (Zustand store)

|-- types/
|   |-- database.ts                (types Supabase)
|   |-- index.ts                   (types globaux)

|-- middleware.ts                   (auth + redirections)
|-- next.config.js
|-- tailwind.config.ts
|-- .env.local                     (variables d'environnement)

PLAN D'ACTION — ORDRE DE CONSTRUCTION Suivre cet ordre pour eviter les blocages:
1 — FONDATIONS
[ ] Phase 0: Setup complet (comptes, repo, Next.js, env vars, Vercel)
[ ] Phase 1: Schema Supabase + Auth + Middleware
[ ] Phase 2: Layout global (Header, Footer, couleurs, fonts)

2 — STOREFRONT
[ ] Phase 3.1: Page accueil (Hero + Banniere + Collections)
[ ] Phase 3.2: Page catalogue /products (filtres + grille)
[ ] Phase 3.3: Page produit /products/[slug]
[ ] Seed data: ajouter 5-10 produits manuellement en Supabase

3 — PAIEMENT + COMPTES
[ ] Phase 4: Panier Zustand + Page /cart
[ ] Phase 4: Checkout Stripe + Webhook + Page /success
[ ] Phase 8: Emails Resend (bienvenue + confirmation commande)

4 — REPRESENTANTS + ADMIN
[ ] Phase 5: Dashboard representant + inscription
[ ] Phase 6: Dashboard admin (produits + commandes + reps)
[ ] Phase 7: Sync Erplain (obtenir API key + tester GraphQL)

5 — TESTS + LAUNCH
[ ] Tests end-to-end (achat complet, paiement Stripe test)
[ ] Test sync Erplain -> Supabase
[ ] Optimisation mobile 100%
[ ] SEO: meta tags, og images, sitemap
[ ] Passer Stripe en mode PRODUCTION
[ ] Mise en ligne officielle!

NOTES IMPORTANTES1. L'API Erplain est en READ-ONLY - tu ne peux PAS modifier les stocks via l'API   Solution: Supabase = source de verite pour le storefront
   Erplain = source de verite pour l'inventaire physique (sync unidirectionnelle)

2. L'API Erplain est un add-on PAYANT
   Verifier sur erplain.com/pricing si ton plan l'inclut
   Si non disponible: entrer les stocks manuellement dans Supabase en attendant

3. Quickbooks + Erplain: la connexion Quickbooks se fait directement dans Erplain
   Erplain -> Settings -> Apps -> QuickBooks -> Connect
   Les commandes Erplain se synchronisent automatiquement avec QB

4. Webgility: pour connecter Erplain + Quickbooks + Shopify
   Webgility.com -> installer le connecteur
   Synchronise les commandes e-commerce vers QB automatiquement

5. Pour les prompts Gemini/Cursor:
   Donner le schema SQL + les specs de chaque phase
   Demander une phase a la fois pour eviter les erreurs
   Toujours commencer par: "Je construis une boutique Next.js 14 + Supabase + Stripe..."

Document cree avec Comet - Mars 2026 | SOYUZ BC North America
