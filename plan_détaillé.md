SOYUZ DASHBOARD APP — MASTER TASK LIST COMPLET (70 ETAPES) — VERSION AFFILIATE
Projet: soyuz-app-dashboard | GitHub: danduclos420/soyuz-app-dashboard | Vercel: soyuz-hockey.vercel.app
Stack: Next.js 14 + TypeScript + Supabase + Stripe + Resend + Zustand + TailwindCSS + Framer Motion + Vercel
Agent cible: Antigravity | But: Verifier status + implementer tout ce qui manque dans l'ordre

========================================
NOTE SUR LA TERMINOLOGIE (UNIFICATION)
========================================
Dans tout ce document et le code source, le terme REPRESENTANT (ou rep) est OBSOLETE.
Il a ete remplace de facon permanente par:
  - AFFILIATE (en majuscules, anglais) = terme TECHNIQUE utilise dans le code
  - Affilie (minuscules, francais) = terme HUMAIN utilise dans l'interface utilisateur

NUANCE ET USAGE:
1. AFFILIATE (technique): Utilise pour noms de fichiers, colonnes BDD, routes API, variables TypeScript.
   Exemples: table 'affiliates', route '/affiliate', colonne 'affiliate_code', variable 'isAffiliate', type 'AffiliateRole'.
2. Affilie (interface): Utilise dans tous les textes vus par l'utilisateur, labels, boutons, emails.
   Exemples: 'Devenir Affilie', 'Code Affilie valide', 'Dashboard Affilie', 'Programme Affilie'.

REGLE: L'agent NE DOIT JAMAIS ecrire 'rep', 'representant', ou 'Representant' dans le nouveau code.

========================================
INFORMATIONS CRITIQUES POUR L'AGENT
========================================
- Terme unifie: AFFILIATE (technique) et Affilie (humain). Jamais 'rep'.
- NE PAS utiliser Erplain API pour sync inventaire — utiliser QuickBooks API uniquement
- NE PAS remplacer fichiers entiers sans verifier SHA Git
- NE PAS toucher next.config.js (deja corrige, commit c70eba5)
- Editeur: Antigravity (pas Cursor)
- Repo: PRIVATE sur GitHub (danduclos420/soyuz-app-dashboard)
- Deploiement auto: chaque push sur main = Vercel rebuild automatique
- Variables env: .env.local en local + Vercel dashboard pour prod
- Design: Theme carbone/noir/anthracite, accents rouge SOYUZ
- Mobile: 100% responsive, drawers 2 colonnes sur mobile
- Header unifie: bouton Fermer ET bouton Deconnexion dans MEME composant

========================================
ARCHITECTURE ROUTES COMPLETES
========================================
/ = Storefront public (Home page)
/products = Catalogue complet avec filtres
/products/[slug] = Fiche produit detaillee
/cart = Panier
/checkout = Paiement Stripe
/account = Dashboard client connecte
/affiliate = Dashboard Affilie (acces role=affiliate uniquement)
/admin = Dashboard admin (acces role=admin uniquement)
/b2b = Page B2B + redirect vers soyuz-hockey.erplain.app/b2b/login
/auth/login = Connexion
/auth/register = Inscription client
/auth/affiliate-register = Inscription Affilie (necessite approbation admin)
/api/validate-code = Validation code AFFILIATE en temps reel
/api/stripe/webhook = Reception events Stripe
/api/sync/quickbooks = Sync inventaire QuickBooks

========================================
TABLES SUPABASE REQUISES
========================================
profiles, affiliates, products, product_variants, orders, order_items,
commissions, messages, affiliate_points, stock_alerts

========================================
PRICING LOGIC GLOBALE (CRITIQUE)
========================================
Prix de base (cost): prix QuickBooks
Prix client standard (affiche sur magasin): cost + 85%
Prix Affilie (dans dashboard affiliate uniquement): -15% sur prix client standard
Code Affilie au checkout: client obtient 15% rabais (visible uniquement au checkout)
Commission Affilie: +10% sur le prix d'origine client (avant rabais) quand code utilise
Retour/remboursement: politique 30 jours, frais retour a la charge maison-mere


========================================
PHASE 0 — SETUP & INFRASTRUCTURE (Etapes 01-05)
========================================

ETAPE 01 — VERIFICATION ETAT REPO ET DEPLOIEMENT
Objectif: S'assurer que le repo GitHub et Vercel sont en bonne sante avant de commencer.
Actions:
  a) Verifier que le repo danduclos420/soyuz-app-dashboard est accessible sur GitHub.
  b) Confirmer que le dernier commit deploy sur Vercel est fonctionnel 
  c) Verifier que .env.local existe localement avec toutes les variables requises.
  d) Verifier que les variables d'env sont configurees dans le dashboard Vercel (prod).
  e) Lancer 'npm run dev' et confirmer que l'app tourne sans erreurs sur localhost:3000.
  f) Verifier les logs Vercel pour s'assurer qu'il n'y a pas d'erreurs de build recentes.
Variables env requises: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, RESEND_API_KEY, QUICKBOOKS_CLIENT_ID,
  QUICKBOOKS_CLIENT_SECRET, QUICKBOOKS_REALM_ID, QUICKBOOKS_REFRESH_TOKEN
Resultat attendu: App fonctionnelle, zero erreur console, deploiement Vercel OK.

ETAPE 02 — VERIFICATION STRUCTURE FICHIERS NEXT.JS
Objectif: S'assurer que la structure du projet est correcte et complete.
Actions:
  a) Verifier que le dossier /app existe avec structure App Router Next.js 14.
  b) Confirmer la presence de: /app/layout.tsx, /app/page.tsx, /app/globals.css.
  c) Verifier que /app/(auth)/login, /app/(auth)/register existent.
  d) Verifier que /app/affiliate/page.tsx existe (ou le creer).
  e) Verifier que /app/admin/page.tsx existe (ou le creer).
  f) Verifier que /app/account/page.tsx existe (ou le creer).
  g) Confirmer la presence de /lib/supabase.ts et /lib/stripe.ts.
  h) Confirmer la presence de /components/ avec sous-dossiers organises inclus les photos utile pour affiché contenu.
Structure attendue: /app, /components, /lib, /types, /hooks, /store, /public
Resultat attendu: Aucun fichier manquant critique, imports resolus.

ETAPE 03 — CONFIGURATION TAILWIND ET THEME CARBONE
Objectif: Implementer le theme visuel SOYUZ (carbone/noir/rouge) de facon globale.
Actions:
  a) Ouvrir tailwind.config.ts et verifier/ajouter les couleurs custom SOYUZ.
  b) Definir palette: soyuz-black (#0a0a0a), soyuz-carbon (#1a1a1a), soyuz-anthracite (#2d2d2d),
     soyuz-red (#e63946), soyuz-red-dark (#c1121f), soyuz-gold (#ffd700), soyuz-white (#f8f9fa).
  c) Configurer les fonts: Inter pour body, Bebas Neue ou Oswald pour titres hockey.
  d) Ajouter les animations Framer Motion dans tailwind.config (si applicable).
  e) Verifier globals.css: background par defaut soyuz-black, text soyuz-white.
  f) Ajouter composant ThemeProvider si pas present (mode dark force).
Resultat attendu: Design cohherent carbone sur toutes les pages.

ETAPE 04 — CONFIGURATION SUPABASE CLIENT ET MIDDLEWARE
Objectif: S'assurer que l'auth Supabase fonctionne correctement avec les routes proteges.
Actions:
  a) Verifier /lib/supabase.ts: createClient avec variables env correctes.
  b) Creer /lib/supabase-server.ts: createServerClient pour Server Components.
  c) Verifier/creer middleware.ts a la racine du projet.
  d) Dans middleware.ts: proteger /affiliate (role=affiliate), /admin (role=admin), /account.
  e) Logique middleware: si non connecte -> redirect /auth/login.
     Si connecte mais mauvais role -> redirect /account ou /.
  f) Tester: acces direct /admin sans auth doit rediriger vers /auth/login.
  g) Tester: acces /affiliate avec compte client normal doit rediriger vers /account.
Resultat attendu: Routes protegees, redirections correctes selon role.

ETAPE 05 — CONFIGURATION ZUSTAND STORES GLOBAUX
Objectif: Mettre en place la gestion d'etat globale avec Zustand.
Actions:
  a) Creer /store/authStore.ts: user, role, isAffiliate, isAdmin, setUser, clearUser.
  b) Creer /store/cartStore.ts: items[], addItem, removeItem, updateQty, clearCart, total.
  c) Creer /store/affiliateStore.ts: affiliateData, commissions, points, messages.
  d) Creer /store/adminStore.ts: pendingAffiliates, allOrders, allMessages.
  e) Chaque store utilise persist middleware Zustand pour localStorage (sauf admin).
  f) AuthStore se synchronise avec Supabase onAuthStateChange.
Resultat attendu: Etat global accessible partout, persistent entre navigations.

========================================
PHASE 1 — BASE DE DONNEES SUPABASE (Etapes 06-15)
========================================

ETAPE 06 — TABLE PROFILES (Extension auth.users)
Objectif: Stocker les donnees etendues de chaque utilisateur avec leur role.
Schema SQL:
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'affiliate', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
Actions:
  a) Creer la table si elle n'existe pas.
  b) Activer RLS (Row Level Security) sur profiles.
  c) Policy RLS: chaque user voit son propre profil. Admin voit tous.
  d) Creer trigger: a chaque nouvel auth.users, inserer dans profiles automatiquement.
  e) Ajouter index sur 'role' pour queries rapides.
  f) Verifier que role='affiliate' remplace partout l'ancien 'rep'.
Note critique: NE JAMAIS utiliser role='rep'. Seuls: 'client', 'affiliate', 'admin'.

ETAPE 07 — TABLE AFFILIATES (Donnees specifiques Affilie)
Objectif: Stocker toutes les donnees propres au programme Affilie.
Schema SQL:
  CREATE TABLE affiliates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
    affiliate_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
    commission_rate DECIMAL DEFAULT 0.85,
    total_sales DECIMAL DEFAULT 0,
    total_commissions DECIMAL DEFAULT 0,
    photo_url TEXT,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
Actions:
  a) Creer la table.
  b) Policy RLS: Affilie voit seulement ses propres donnees. Admin voit tout.
  c) affiliate_code: genere automatiquement (format: SOYUZ-XXXX, 4 lettres/chiffres aleatoires).
  d) commission_rate: 0.85 signifie 85% de la marge generee par l'Affilie.
  e) photo_url: obligatoire pour apparaitre dans le classement.

ETAPE 08 — TABLE PRODUCTS ET PRODUCT_VARIANTS
Objectif: Catalogue complet des produits avec variantes (taille, couleur).
Schema SQL:
  CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    base_price DECIMAL NOT NULL,
    affiliate_price DECIMAL,
    cost_price DECIMAL,
    images TEXT[],
    is_active BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    size TEXT,
    color TEXT,
    stock INTEGER DEFAULT 0,
    sku TEXT UNIQUE
  );
Actions:
  a) Creer les deux tables.
  b) affiliate_price = base_price * 0.85 (calcule automatiquement ou stored).
  c) cost_price: visible UNIQUEMENT pour admin via son dashboard.
  d) Policy RLS: tous peuvent lire products actifs. Seul admin peut ecrire.
  e) Configurer policy pour que cost_price soit masque aux non-admins.

ETAPE 09 — TABLE ORDERS ET ORDER_ITEMS
Objectif: Enregistrer chaque commande avec tracking du code Affilie utilise.
Schema SQL:
  CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    affiliate_code TEXT REFERENCES affiliates(affiliate_code),
    stripe_payment_intent TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    subtotal DECIMAL NOT NULL,
    shipping DECIMAL DEFAULT 0,
    total DECIMAL NOT NULL,
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL NOT NULL
  );
Actions:
  a) Creer les deux tables.
  b) affiliate_code: si acheteur utilise un code Affilie, le stocker ici.
  c) Ce lien permet de calculer les commissions automatiquement.
  d) Status valeurs: 'pending', 'paid', 'shipped', 'delivered', 'refunded'.

ETAPE 10 — TABLE COMMISSIONS
Objectif: Tracker chaque commission generee pour chaque Affilie.
Schema SQL:
  CREATE TABLE commissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id),
    order_id UUID REFERENCES orders(id),
    amount DECIMAL NOT NULL,
    rate DECIMAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
  );
Actions:
  a) Creer la table.
  b) Trigger: a chaque order avec affiliate_code, creer une commission automatiquement.
  c) amount = (order.total - cost_price_total) * affiliate.commission_rate.
  d) Admin peut marquer commissions comme 'paid' manuellement.
  e) Affilie voit ses commissions dans son dashboard.

ETAPE 11 — TABLE AFFILIATE_POINTS (Programme de fidelite)
Objectif: Systeme de points pour recompenser les Affilies performants.
Schema SQL:
  CREATE TABLE affiliate_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id) UNIQUE,
    total_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    last_reset TIMESTAMPTZ DEFAULT NOW()
  );
Logique des points:
  - 1 point = 1000$ de ventes generees par l'Affilie
- A chaque 15000$ de ventes = cadeau/recompense physique (gere manuellement par admin)
- 3000$ de ventes dans le mois = 1 participation au tirage au sort mensuel
  - monthly_points se reset le 1er de chaque mois (cron job Supabase)
  - lifetime_points ne se reset jamais
Actions:
  a) Creer la table.
  b) Trigger: a chaque order paye avec affiliate_code, incrementer les points.
  c) Creer fonction Supabase pour le reset mensuel (cron).
  d) Admin peut voir et ajuster les points manuellement.

ETAPE 12 — TABLE MESSAGES (Messagerie admin -> Affilies)
Objectif: Systeme de messagerie interne pour communication admin -> Affilies.
Schema SQL:
  CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id),
    recipient_id UUID REFERENCES profiles(id),
    is_broadcast BOOLEAN DEFAULT false,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,,
  is_perpetual BOOLEAN DEFAULT false

    created_at TIMESTAMPTZ DEFAULT NOW()
  );
Regles metier importantes:
  - Admin peut envoyer messages PRIVES (recipient_id specifique).
  - Admin peut envoyer BROADCAST (is_broadcast=true, tous les Affilies recoivent).
  - Admin peut SUPPRIMER un message (suppression globale pour tous les destinataires).
  - Admin NE PEUT PAS editer un message envoye (pas d'UPDATE sur body).
  - Les Affilies peuvent LIRE seulement, pas repondre (sens unique).
- Reset mensuel: TOUS les messages supprimes le 1er du mois (cron) SAUF ceux marques is_perpetual=true.
Actions:
  a) Creer la table.
  b) Policy RLS: Affilie voit messages ou recipient_id = son id OU is_broadcast=true.
  c) Policy RLS: seul admin peut INSERT.
  d) Pas de UPDATE sur body (enforce via policy ou trigger).

ETAPE 13 — TABLE STOCK_ALERTS
Objectif: Alertes automatiques quand le stock descend sous un seuil.
Schema SQL:
  CREATE TABLE stock_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    threshold INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMPTZ
  );
Actions:
  a) Creer la table.
  b) Trigger: quand stock descend sous threshold, envoyer email admin via Resend.
  c) Admin configure les seuils par produit/variante.
  d) Email alerte: template avec nom produit, variante, stock actuel, seuil.

ETAPE 14 — CONFIGURATION ROW LEVEL SECURITY (RLS) GLOBALE
Objectif: S'assurer que chaque table est securisee correctement.
Actions:
  a) Activer RLS sur TOUTES les tables: profiles, affiliates, products, orders, etc.
  b) Policy client: peut lire ses propres orders. Pas d'acces aux autres.
  c) Policy affiliate: peut lire ses commissions, points, messages. Ses stats seulement.
  d) Policy admin: acces complet en lecture et ecriture sur toutes les tables.
  e) Policy products: lecture publique pour produits actifs. Ecriture admin seulement.
  f) Policy cost_price: masque aux non-admins via policy ou computed column.
  g) Tester chaque policy avec comptes de test (client, affiliate, admin).

ETAPE 15 — SYNC INVENTAIRE QUICKBOOKS (READ-ONLY)
Objectif: Synchroniser le stock depuis QuickBooks sans modifier les donnees QB.
IMPORTANT: Integration READ-ONLY. NE JAMAIS ecrire dans QuickBooks depuis l'app.
Actions:
  a) Creer /app/api/sync/quickbooks/route.ts.
  b) Utiliser QuickBooks API v3 avec OAuth 2.0.
  c) Endpoint: GET /v3/company/{realmId}/item pour recuperer les items.
  d) Mapper les items QB aux products Supabase par SKU.
  e) Mettre a jour stock_quantity dans products et product_variants.
  f) Cron job: sync automatique toutes les heures via Vercel Cron.
  g) Bouton sync manuel dans dashboard admin.
  h) Log chaque sync: timestamp, items synces, erreurs.
Variables env: QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET,
  QUICKBOOKS_REALM_ID, QUICKBOOKS_REFRESH_TOKEN
NE PAS utiliser Erplain API. NE PAS ecrire dans QuickBooks.

========================================
PHASE 2 — AUTHENTIFICATION ET NAVIGATION (Etapes 16-20)
========================================

ETAPE 16 — PAGES AUTH: LOGIN, REGISTER, AFFILIATE-REGISTER
Objectif: Creer les pages d'authentification avec design carbone SOYUZ.
Actions:
  a) Creer /app/auth/login/page.tsx:
     - Formulaire: email + password.
     - Bouton 'Se connecter' avec loading state.
     - Lien vers /auth/register et /auth/affiliate-register.
     - Gestion erreur: mauvais credentials, email non confirme.
     - Apres login succes: redirect selon role (client=/account, affiliate=/affiliate, admin=/admin).
  b) Creer /app/auth/register/page.tsx:
     - Formulaire: full_name, email, password, confirm_password.
     - Validation cote client (Zod ou validation manuelle).
     - Appel supabase.auth.signUp -> creer profile avec role='client'.
     - Email de confirmation via Resend.
  c) Creer /app/auth/affiliate-register/page.tsx:
     - Formulaire: full_name, email, password, message de motivation (optionnel).
     - Appel supabase.auth.signUp -> profile avec role='client' temporaire.
     - Creer entree dans affiliates avec status='pending'.
     - Email admin: 'Nouvelle demande Affilie de [nom]'.
     - Message confirmation: 'Votre demande est en attente d approbation'.
Design: Background soyuz-black, card centree, logo SOYUZ en haut.

ETAPE 17 — COMPOSANT HEADER PRINCIPAL (UNIFIE)
Objectif: Header responsive unifie avec navigation, panier, compte, et boutons Fermer/Deconnexion.
IMPORTANT: bouton Fermer ET bouton Deconnexion doivent etre dans le MEME composant Header.
Actions:
  a) Creer /components/layout/Header.tsx.
  b) Structure desktop:
     - Logo SOYUZ gauche.
     - Navigation centre: Accueil, Produits, B2B, Programme Affilie.
     - Droite: icone panier (avec badge count), icone compte, si admin: lien Admin.
  c) Structure mobile:
     - Logo + icone menu hamburger.
     - Menu hamburger ouvre un drawer lateral.
     - Dans ce drawer: navigation + compte + panier + bouton Fermer (X) + bouton Deconnexion.
     - Bouton Fermer ferme le drawer. Bouton Deconnexion appelle supabase.auth.signOut.
     - Les deux boutons sont TOUJOURS visibles ensemble dans le header/drawer.
  d) Si connecte: afficher nom utilisateur ou avatar.
  e) Si role=admin: afficher indicateur admin visuel (badge rouge).
  f) Panier: icone avec nombre d'items du cartStore Zustand.

ETAPE 18 — COMPOSANT FOOTER ET LAYOUT GLOBAL
Objectif: Footer informatif + Layout wrapper pour toutes les pages.
Actions:
  a) Creer /components/layout/Footer.tsx:
     - Colonnes: A propos SOYUZ, Liens utiles (Produits, B2B, Programme Affilie),
       Politique (Retour 30j, Confidentialite, CGV), Contact.
     - Mention: frais retour a la charge de la maison-mere.
     - Copyright SOYUZ.
  b) Creer /components/layout/MainLayout.tsx:
     - Wrapper: Header + {children} + Footer.
     - Background soyuz-black global.
  c) Appliquer MainLayout dans /app/layout.tsx.
  d) Pages /admin et /affiliate peuvent avoir leur propre layout sans footer public.

ETAPE 19 — VALIDATION CODE AFFILIATE EN TEMPS REEL
Objectif: Permettre aux acheteurs de valider un code Affilie au checkout.
Actions:
  a) Creer /app/api/validate-code/route.ts (GET).
  b) Logic: recevoir ?code=SOY-XXXX, chercher dans affiliates ou code_affiliate correspond.
  c) Verifier que affiliate.status = 'approved'.
  d) Retourner: { valid: true, affiliateName: 'Jean Dupont', discount: 0 } ou { valid: false }.
  e) Note: le code Affilie ne donne PAS de reduction au client, il track juste la vente.
  f) Dans le composant checkout, ajouter champ 'Code Affilie' avec validation en temps reel.
  g) Afficher feedback: 'Code Affilie valide - Merci de soutenir [nom]' en vert.
     Ou: 'Code invalide ou expire' en rouge.
  h) Stocker le code valide dans cartStore pour l'inclure dans l'order a la creation.

ETAPE 20 — COMPOSANTS UI GENERIQUES REUTILISABLES
Objectif: Creer une librairie de composants UI coherente avec le design carbone SOYUZ.
Actions:
  a) Creer /components/ui/Button.tsx: variants (primary/secondary/danger/ghost), sizes, loading state.
  b) Creer /components/ui/Input.tsx: label, placeholder, error state, icone optionnelle.
  c) Creer /components/ui/Card.tsx: fond carbone, bordure subtile, shadow.
  d) Creer /components/ui/Badge.tsx: couleurs (rouge, vert, gris, or) pour status.
  e) Creer /components/ui/Modal.tsx: overlay sombre, animation Framer Motion, close button.
  f) Creer /components/ui/LoadingSpinner.tsx: spinner rouge SOYUZ.
  g) Creer /components/ui/Toast.tsx: notifications succes/erreur (en haut a droite).
  h) Creer /components/ui/Drawer.tsx: slide depuis droite ou gauche, backdrop click ferme.
  i) Tous les composants: TypeScript strict, props bien types, accessible (aria).

========================================
PHASE 3 — STOREFRONT PUBLIC (Etapes 21-25)
========================================

ETAPE 21 — PAGE ACCUEIL (HOME PAGE /)
Objectif: Page d'accueil publique percutante avec hero section, produits vedettes, call to action.
Actions:
  a) Creer /app/page.tsx avec sections:
     - Hero: image plein ecran, titre SOYUZ, sous-titre, CTA 'Voir les produits' + 'Programme Affilie'.
     - Section produits vedettes (4-6 produits, fetches depuis Supabase is_featured=true).
     - Section 'Pourquoi SOYUZ': 3-4 arguments (qualite, livraison, programme Affilie, B2B).
     - Section Programme Affilie teaser: avantages, CTA 'Devenir Affilie'.
     - Section B2B teaser: redirect vers /b2b.
  b) Hero animation: Framer Motion fadeIn + slideUp.
  c) Produits vedettes: grille 4 colonnes desktop, 2 colonnes mobile, 1 colonne xs.
  d) Chaque carte produit: image, nom, prix (prix Affilie si connecte et affiliate).
  e) SEO: metadata title, description, og:image.

ETAPE 22 — PAGE CATALOGUE PRODUITS (/products)
Objectif: Catalogue complet avec filtres par categorie, tri, et recherche.
Actions:
  a) Creer /app/products/page.tsx.
  b) Fetch tous les products actifs depuis Supabase avec pagination (12 par page).
  c) Filtres sidebar (desktop) ou drawer (mobile):
     - Categorie (checkbox multiple).
     - Prix (slider min/max).
     - Taille disponible.
     - En stock seulement.
  d) Tri: Prix croissant/decroissant, Nouveautes, Populaires.
  e) Barre de recherche texte (filtre sur nom/description).
  f) Grille produits: 4 col desktop, 2 col mobile. Carte produit avec:
     - Image produit.
     - Nom, categorie.
     - Prix client. Si Affilie connecte: afficher prix Affilie (-15%) en rouge a cote.
     - Badge 'Rupture' si stock=0.
  g) Pagination ou infinite scroll.

ETAPE 23 — PAGE FICHE PRODUIT (/products/[slug])
Objectif: Page detail produit avec selection variante, ajout panier, galerie.
Actions:
  a) Creer /app/products/[slug]/page.tsx.
  b) Fetch produit par slug + ses variantes depuis Supabase.
  c) Galerie photos: image principale + thumbnails. Click thumbnail change image principale.
  d) Infos produit:
     - Nom, description complete.
     - Prix: prix client normal. Si Affilie connecte: afficher les deux prix (normal barree + prix Affilie).
     - Selection taille (boutons). Selection couleur (swatches).
     - Quantite (+ / - avec max = stock disponible).
     - Bouton 'Ajouter au panier' avec animation succes.
     - Indicateur stock: 'En stock', 'Stock faible (X restants)', 'Rupture de stock'.
  e) Section avis (si applicable plus tard).
  f) Produits similaires en bas de page (meme categorie).
  g) Meta SEO dynamique depuis les donnees produit.

ETAPE 24 — PAGE PANIER (/cart)
Objectif: Panier d'achat avec resume commande, modification quantites, code Affilie.
Actions:
  a) Creer /app/cart/page.tsx.
  b) Afficher items du cartStore Zustand:
     - Image, nom, variante, prix unitaire, quantite (editable), sous-total.
     - Bouton supprimer item.
  c) Resume commande droite:
     - Sous-total, livraison (gratuite ou calculee), total.
     - Champ 'Code Affilie' avec validation temps reel (appel /api/validate-code).
     - Bouton 'Passer la commande' -> redirect /checkout.
  d) Si panier vide: message + CTA vers /products.
  e) Bouton 'Continuer les achats' -> /products.
  f) Persistance panier via Zustand persist (localStorage).
  g) Mobile: layout en colonne (items en haut, resume en bas).

ETAPE 25 — PAGE CHECKOUT ET PAIEMENT STRIPE (/checkout)
Objectif: Processus de paiement securise avec Stripe Elements.
Actions:
  a) Creer /app/checkout/page.tsx.
  b) Etapes checkout:
     - Etape 1: Informations livraison (nom, adresse, ville, code postal, pays).
     - Etape 2: Recapitulatif commande + code Affilie confirme.
     - Etape 3: Paiement Stripe (Elements integres).
  c) Creer /app/api/checkout/create-intent/route.ts:
     - Creer PaymentIntent Stripe avec montant calcule cote serveur.
     - Inclure metadata: user_id, affiliate_code (si present).
  d) A la confirmation paiement:
     - Creer order dans Supabase avec status='paid'.
     - Creer order_items pour chaque produit.
     - Si affiliate_code: creer entree commissions automatiquement.
     - Decrementer stock_quantity des produits/variantes.
     - Envoyer email confirmation client via Resend.
     - Envoyer email admin (recap commande).
  e) Page /checkout/success: confirmation numero commande, recapitulatif.
  f) Webhook Stripe (/api/stripe/webhook): gerer payment_intent.succeeded,
     payment_intent.failed, charge.refunded.

========================================
PHASE 4 — DASHBOARD CLIENT (Etapes 26-30)
========================================

ETAPE 26 — PAGE COMPTE CLIENT (/account)
Objectif: Dashboard personnel pour les clients standards.
Actions:
  a) Creer /app/account/page.tsx.
  b) Sections:
     - Bienvenue + nom utilisateur.
     - Informations personnelles: nom, email, avatar.
     - Bouton 'Modifier profil' (ouvre modal ou page /account/edit).
     - Historique commandes: tableau recent 5 dernieres commandes.
       Colonnes: Date, Numero, Total, Status (pending/paid/shipped/delivered).
       Click sur une commande -> /account/orders/[id] pour details.
  c) Sidebar navigation:
     - Apercu (page actuelle).
     - Mes commandes.
     - Modifier profil.
     - Deconnexion.
  d) Si l'utilisateur n'a jamais commande: message + CTA vers /products.
  e) Bouton 'Devenir Affilie' visible si role=client.

ETAPE 27 — PAGE DETAILS COMMANDE CLIENT (/account/orders/[id])
Objectif: Vue detaillee d'une commande specifique.
Actions:
  a) Creer /app/account/orders/[id]/page.tsx.
  b) Fetch order depuis Supabase par ID (verifier que order.user_id = user connecte).
  c) Afficher:
     - Numero commande, date, status.
     - Items commande: tableau (image, nom, variante, quantite, prix unitaire, sous-total).
     - Adresse livraison.
     - Sous-total, livraison, total.
     - Si code Affilie utilise: afficher 'Commande liee au code [SOY-XXXX] (Merci!)'.
  d) Suivi livraison (si tracking disponible): afficher lien tracking.
  e) Bouton retour vers /account.
  f) Si status=delivered: option 'Demander retour' (ouvre formulaire contact admin).
     Politique 30j: retour accepte sous 30 jours, frais retour a charge maison-mere.

ETAPE 28 — PAGE MODIFIER PROFIL CLIENT (/account/edit)
Objectif: Permettre au client de modifier ses infos personnelles.
Actions:
  a) Creer /app/account/edit/page.tsx.
  b) Formulaire pre-rempli avec donnees actuelles:
     - Nom complet (editable).
     - Email (affiche, non editable ou editable avec confirmation).
     - Photo profil: upload via Supabase Storage.
  c) Bouton 'Enregistrer' -> UPDATE profiles.
  d) Toast succes: 'Profil mis a jour'.
  e) Bouton annuler -> retour /account.

ETAPE 29 — PAGE LISTE COMMANDES CLIENT (/account/orders)
Objectif: Liste complete de toutes les commandes du client.
Actions:
  a) Creer /app/account/orders/page.tsx.
  b) Fetch toutes les orders ou order.user_id = user connecte.
  c) Afficher tableau:
     - Colonnes: Date, Numero, Total, Status, Actions.
     - Tri par date decroissante (plus recentes en haut).
  d) Filtres: Status (Tous, En attente, Payee, Expediee, Livree, Remboursee).
  e) Pagination si beaucoup de commandes.
  f) Click sur ligne -> redirect /account/orders/[id].

ETAPE 30 — PAGE B2B REDIRECT (/b2b)
Objectif: Page B2B avec redirection vers Erplain.
Actions:
  a) Creer /app/b2b/page.tsx.
  b) Contenu:
     - Titre: 'SOYUZ B2B - Solutions pour professionnels'.
     - Description programme B2B: volume, tarifs, avantages.
     - Bouton principal: 'Accéder au portail B2B' -> redirect externe vers
       soyuz-hockey.erplain.app/b2b/login.
     - Formulaire contact B2B (optionnel): nom, entreprise, email, message.
       Envoi email admin via Resend.
  c) Design coherent avec le reste du site (theme carbone).
  d) SEO meta pour page B2B.

========================================
PHASE 5 — DASHBOARD AFFILIE (/affiliate) (Etapes 31-40)
========================================
Cette phase est CRITIQUE car elle contient toutes les features uniques du programme Affilie.

ETAPE 31 — PAGE PRINCIPALE DASHBOARD AFFILIE (/affiliate)
Objectif: Hub central avec toutes les stats et acces rapides.
Actions:
  a) Creer /app/affiliate/page.tsx (protege par middleware role=affiliate).
  b) Layout special: Sidebar navigation gauche avec menu:
     - Apercu (page actuelle).
     - Carte Hockey.
     - Classement.
     - Comparaison.
     - Commissions.
     - Messages.
     - Parametres.
  c) Contenu page Apercu:
     - Carte de bienvenue avec nom et code Affilie (SOY-XXXX) en grand.
     - Bouton copier code avec feedback toast.
     - Widget stats 4 cartes:
       * Total ventes generees (lifetime).
       * Commissions gagnees (total + pending/paid).
       * Points actuels (total + monthly).
       * Rang dans le classement (ex: #3 sur 45).
     - Graphique ventes 6 derniers mois (line chart ou bar chart).
     - Section 'Messages recents' (3 derniers messages admin).
     - Section 'Objectifs du mois':
       * Progres vers 3 points (eligibilite tirage).
       * Progres vers 50 points (cadeau physique).
       * Barre progression visuelle.
  d) Mobile: cartes stats en colonne, graphique scrollable.

ETAPE 32 — PHOTO PROFIL OBLIGATOIRE POUR CLASSEMENT
Objectif: L'Affilie doit uploader une photo pour apparaitre dans le classement.
Actions:
  a) Dans /app/affiliate/page.tsx, verifier si affiliates.photo_url existe.
  b) Si photo_url est null: afficher banniere alerte en haut:
     'Uploadez votre photo de profil pour apparaitre dans le classement et sur votre carte hockey!'
     Bouton 'Uploader ma photo'.
  c) Click bouton -> ouvre modal upload photo.
  d) Upload via Supabase Storage dans bucket 'affiliate-photos'.
  e) Apres upload: UPDATE affiliates SET photo_url = url.
  f) Toast succes: 'Photo uploadee! Vous apparaitrez maintenant dans le classement.'.
  g) Contraintes photo: format JPG/PNG, max 2MB, ratio carre ou portrait.
  h) Afficher preview avant validation.

ETAPE 33 — CARTE HOCKEY AFFILIE PERSONNALISEE (/affiliate/card)
Objectif: Generer une carte hockey style NHL avec photo + stats de l'Affilie.
Cette feature est UNIQUE et tres importante pour la gamification.
Actions:
  a) Creer /app/affiliate/card/page.tsx.
  b) Creer composant /components/affiliate/HockeyCard.tsx:
     - Design: carte style carte hockey NHL (format vertical).
     - Recto:
       * Photo Affilie en haut (uploader si manquante).
       * Nom complet en gros.
       * Code Affilie (SOY-XXXX) en badge.
       * Stats cles: Ventes totales, Commissions, Points, Rang.
       * Logo SOYUZ en bas.
     - Verso (optionnel): graphique performance ou message personnalise.
  c) Bouton 'Telecharger ma carte' -> export PNG haute resolution (canvas HTML5 ou lib).
  d) Bouton 'Partager sur reseaux' -> genere lien partage avec preview carte.
  e) Animations Framer Motion: flip card au hover (recto/verso).
  f) Responsive: carte redimensionnee sur mobile mais garde ratio.
  g) Template carte: fond carbone/noir, accents rouge SOYUZ, typographie hockey.

ETAPE 34 — CLASSEMENT AFFILIES (LEADERBOARD) (/affiliate/leaderboard)
Objectif: Classement de tous les Affilies par points mensuels et lifetime.
Deux vues: GRILLE PASTILLES et LISTE DETAILLEE.
Actions:
  a) Creer /app/affiliate/leaderboard/page.tsx.
  b) Fetch tous les affiliates approuves avec leurs points (affiliate_points table).
  c) Vue 1: GRILLE PASTILLES (par defaut):
     - Afficher tous les Affilies en grille responsive.
     - Chaque pastille = cercle avec:
       * Photo profil Affilie.
       * Nom en dessous.
       * Points du mois en petit badge.
     - Tri par monthly_points decroissant.
     - Top 3: pastilles plus grandes + badges or/argent/bronze.
     - Grille: 5 col desktop, 3 col tablet, 2 col mobile.
  d) Vue 2: LISTE DETAILLEE (toggle bouton):
     - Tableau complet:
       Colonnes: Rang, Photo, Nom, Code, Points mois, Points total, Ventes totales.
     - Tri: par monthly_points (defaut) ou lifetime_points ou total_sales.
     - Ligne de l'Affilie connecte: highlight couleur differente.
  e) Toggle vue: bouton 'Grille / Liste' en haut.
  f) Filtres: Mois actuel (defaut) ou Tous les temps.
  g) Reset mensuel: le 1er du mois, monthly_points reset a 0 pour tous.
     Afficher mention: 'Classement du mois de [Mois]'.
  h) Animation: fade in des pastilles avec stagger Framer Motion.

ETAPE 35 — COMPARAISON COTE-A-COTE CARTES HOCKEY (/affiliate/compare)
Objectif: Comparer sa carte hockey avec celle d'un autre Affilie.
Actions:
  a) Creer /app/affiliate/compare/page.tsx.
  b) Interface:
     - Gauche: afficher la carte hockey de l'Affilie connecte (composant HockeyCard).
     - Droite: dropdown ou search pour selectionner un autre Affilie.
     - Afficher la carte de l'Affilie selectionne a droite.
  c) Stats cote-a-cote:
     - Tableau comparatif en dessous des cartes:
       Lignes: Ventes totales, Commissions, Points mois, Points total, Rang.
       Colonnes: Moi | [Nom autre Affilie].
     - Highlight vert les stats ou l'utilisateur est meilleur.
  d) Bouton 'Partager comparaison' (screenshot ou export PNG).
  e) Animations: slide in des deux cartes.
  f) Mobile: cartes empilees verticalement au lieu de cote-a-cote.

ETAPE 36 — GRAPHIQUE VENTES SUR 6 MOIS (/affiliate/stats)
Objectif: Visualiser la progression des ventes et commissions.
Actions:
  a) Creer /app/affiliate/stats/page.tsx.
  b) Fetch orders des 6 derniers mois ou affiliate_code = code de l'Affilie.
  c) Aggreger par mois: total ventes, total commissions, nombre orders.
  d) Graphique 1: Line chart ventes mensuelles (axe X = mois, axe Y = montant $).
  e) Graphique 2: Bar chart commissions mensuelles.
  f) Utiliser librairie: Recharts ou Chart.js ou Tremor.
  g) Couleurs: ligne rouge SOYUZ sur fond carbone.
  h) Legende et tooltips clairs.
  i) Export CSV: bouton pour telecharger donnees en CSV.
  j) Filtres: 6 mois (defaut), 12 mois, Tous les temps.

ETAPE 37 — PAGE COMMISSIONS DETAILLEES (/affiliate/commissions)
Objectif: Voir toutes les commissions generees avec details.
Actions:
  a) Creer /app/affiliate/commissions/page.tsx.
  b) Fetch commissions depuis table commissions ou affiliate_id = id connecte.
  c) Tableau:
     - Colonnes: Date, Numero commande, Montant vente, Taux commission, Montant commission, Status.
     - Status: pending (jaune), paid (vert), cancelled (rouge).
  d) Tri par date decroissante.
  e) Filtres:
     - Status: Tous, En attente, Payees, Annulees.
     - Periode: Ce mois, Mois dernier, 6 mois, Tous les temps.
  f) Total en haut de page:
     - Total commissions pending.
     - Total commissions paid.
     - Total lifetime.
  g) Click sur ligne commande -> modal details order (produits, quantites, adresse).
  h) Export CSV.

ETAPE 38 — INBOX MESSAGES AFFILIES (/affiliate/messages)
Objectif: Recevoir et lire les messages de l'admin (broadcast ou prives).
REGLES IMPORTANTES:
  - Admin peut envoyer messages prives (a un Affilie specifique).
  - Admin peut envoyer BROADCAST (tous les Affilies recoivent).
  - Admin peut SUPPRIMER messages (suppression globale pour tous).
  - Admin NE PEUT PAS EDITER un message envoye.
  - Affilies peuvent LIRE seulement, pas repondre.
- Reset mensuel: tous les messages supprimes le 1er du mois SAUF si admin marque comme 'perpetuel'.
Actions:
  a) Creer /app/affiliate/messages/page.tsx.
  b) Fetch messages depuis table messages ou:
     (recipient_id = user_id connecte) OU (is_broadcast = true).
  c) Tri par created_at decroissant (plus recents en haut).
  d) Liste messages:
     - Badge 'BROADCAST' ou 'PRIVE' pour chaque message.
     - Sujet en gros, preview body (50 premiers caracteres).
     - Date envoi.
     - Indicateur non lu (is_read=false) -> badge rouge ou gras.
  e) Click sur message -> ouvre modal ou page details:
     - Affiche sujet complet, body complet, date, expediteur (admin).
     - Marquer comme lu automatiquement (UPDATE is_read=true).
  f) Badge compteur messages non lus dans le menu sidebar.
  g) Pas de bouton repondre (sens unique).
  h) Mention en bas: 'Les messages sont supprimes le 1er de chaque mois'.

ETAPE 39 — PARAMETRES AFFILIE (/affiliate/settings)
Objectif: Modifier ses infos personnelles et parametres compte Affilie.
Actions:
  a) Creer /app/affiliate/settings/page.tsx.
  b) Sections:
     - Informations personnelles: nom, email, photo profil (editable).
     - Code Affilie: affiche en lecture seule (non modifiable).
     - Taux commission: affiche en lecture seule (modifiable par admin seulement).
     - Historique approbation: date approbation, approuve par (nom admin).
  c) Bouton 'Enregistrer modifications' -> UPDATE profiles et affiliates.
  d) Bouton 'Changer mot de passe' -> ouvre modal Supabase auth.updateUser.
  e) Section danger: 'Desactiver mon compte Affilie' (avec confirmation).
     -> Change status='suspended' (reversible par admin).

ETAPE 40 — ANIMATIONS ET UX DASHBOARD AFFILIE
Objectif: Rendre le dashboard Affilie engageant avec animations fluides.
Actions:
  a) Toutes les cartes stats: animation fadeIn + slideUp au chargement (Framer Motion).
  b) Hover effects sur cartes: elevation (shadow augmente), scale 1.02.
  c) Transitions routes: page fade in/out entre pages /affiliate/*.
  d) Loading states: skeleton loaders pendant fetch donnees.
  e) Graphiques: animations progressives (line dessine progressivement).
  f) Classement grille: stagger animation (pastilles apparaissent une par une).
  g) Messages inbox: badge pulse si messages non lus.
  h) Carte hockey: flip animation recto/verso au hover.
  i) Toast notifications: slide in depuis haut-droite.
  j) Mobile: drawer lateral pour menu au lieu de sidebar fixe.

========================================
PHASE 6 — DASHBOARD ADMIN (/admin) (Etapes 41-50)
========================================

ETAPE 41 — PAGE PRINCIPALE DASHBOARD ADMIN (/admin)
Objectif: Vue d'ensemble admin avec KPIs globaux.
Actions:
  a) Creer /app/admin/page.tsx (protege middleware role=admin).
  b) Sidebar navigation:
     - Apercu.
     - Gestion Affilies.
     - Commandes.
     - Produits.
     - Messagerie.
     - Inventaire QuickBooks.
     - Parametres.
  c) Contenu page Apercu:
     - Widgets stats 6 cartes:
       * Nombre total Affilies (approved/pending/suspended).
       * Ventes totales ce mois.
       * Commissions a payer (pending).
       * Commandes en attente traitement.
       * Produits en rupture stock.
       * Messages non envoyes (drafts si applicable).
     - Graphique ventes globales 6 mois.
     - Tableau Affilies top 5 performants du mois.
     - Tableau dernieres commandes (5 recentes).

ETAPE 42 — GESTION AFFILIES: APPROBATION DEMANDES (/admin/affiliates)
Objectif: Approuver ou rejeter demandes Affilie pending.
Actions:
  a) Creer /app/admin/affiliates/page.tsx.
  b) Tabs: Pending | Approved | Suspended.
  c) Tab Pending:
     - Liste demandes status='pending'.
     - Colonnes: Nom, Email, Date demande, Message motivation (si fourni).
     - Actions: Bouton 'Approuver' + Bouton 'Rejeter'.
  d) Click 'Approuver':
     - Generer code affiliate unique (SOY-XXXX, verifier unicite).
     - UPDATE affiliates: status='approved', affiliate_code=genere,
       approved_at=NOW(), approved_by=admin_id.
     - UPDATE profiles: role='affiliate'.
     - Creer entree affiliate_points pour ce nouveau Affilie.
     - Envoyer email: 'Felicitations! Votre demande Affilie est approuvee.
       Votre code: [SOY-XXXX]. Connectez-vous pour acceder a votre dashboard.'.
  e) Click 'Rejeter':
     - DELETE from affiliates (ou status='rejected').
     - Envoyer email: 'Votre demande Affilie n a pas ete approuvee pour le moment.'.
  f) Tab Approved: liste tous approved avec bouton 'Suspendre'.
  g) Tab Suspended: liste suspendus avec bouton 'Reactiver'.

ETAPE 43 — DETAILS ET MODIFICATION AFFILIE (/admin/affiliates/[id])
Objectif: Voir et modifier les details d'un Affilie specifique.
Actions:
  a) Creer /app/admin/affiliates/[id]/page.tsx.
  b) Fetch affiliate par ID + ses stats (ventes, commissions, points).
  c) Sections:
     - Infos generales: nom, email, photo, code, status.
     - Taux commission: champ editable (defaut 0.85).
       Permet admin d'ajuster commission individuellement.
     - Stats lifetime: total ventes, commissions generees, points.
     - Historique commandes liees a ce code.
  d) Boutons actions:
     - 'Modifier taux commission' -> modal input nouveau taux -> UPDATE.
     - 'Ajuster points manuellement' -> modal +/- points -> UPDATE affiliate_points.
     - 'Suspendre compte' (si approved) -> status='suspended'.
     - 'Supprimer Affilie' (danger, avec confirmation triple).
  e) Log toutes modifications admin dans une table audit_logs (optionnel mais recommande).

ETAPE 44 — GESTION COMMANDES ADMIN (/admin/orders)
Objectif: Voir et gerer toutes les commandes.
Actions:
  a) Creer /app/admin/orders/page.tsx.
  b) Fetch toutes les orders (tous les clients/Affilies).
  c) Tableau:
     - Colonnes: ID, Date, Client, Total, Code Affilie (si present), Status, Actions.
  d) Filtres:
     - Status: Tous, Pending, Paid, Shipped, Delivered, Refunded.
     - Date: Aujourd'hui, Cette semaine, Ce mois, Personnalisee.
     - Code Affilie: dropdown tous les codes pour filtrer par Affilie.
  e) Actions par commande:
     - Click ligne -> /admin/orders/[id] details.
     - Bouton 'Marquer expediee' -> UPDATE status='shipped' + ajouter tracking (optionnel).
     - Bouton 'Rembourser' -> modal confirmation -> status='refunded' +
       annuler commission associee (commission.status='cancelled').
  f) Export CSV toutes commandes filtrees.
  g) Pagination.

ETAPE 45 — DETAILS COMMANDE ADMIN (/admin/orders/[id])
Objectif: Vue complete d'une commande avec possibilite modification.
Actions:
  a) Creer /app/admin/orders/[id]/page.tsx.
  b) Afficher:
     - Infos client: nom, email.
     - Adresse livraison complete.
     - Items commande: tableau produits avec images.
     - Paiement: Stripe payment_intent, montant, date.
     - Code Affilie utilise (si present): afficher nom Affilie + lien vers son profil.
     - Commission generee (si affiliate_code): montant, status pending/paid.
  c) Actions admin:
     - 'Modifier adresse livraison' (si pas encore expediee).
     - 'Changer status' -> dropdown (pending/paid/shipped/delivered/refunded).
     - 'Ajouter numero tracking' -> input tracking number.
     - 'Envoyer email suivi client' -> template email avec tracking.
     - 'Rembourser' -> appel Stripe Refund API + UPDATE order + annuler commission.

ETAPE 46 — GESTION PRODUITS ADMIN (/admin/products)
Objectif: CRUD complet produits et variantes.
Actions:
  a) Creer /app/admin/products/page.tsx.
  b) Liste tous products avec filtres (categorie, actif/inactif, en stock/rupture).
  c) Tableau:
     - Colonnes: Image, Nom, Categorie, Prix base, Prix Affilie, Stock, Actif, Actions.
  d) Actions:
     - Bouton 'Ajouter produit' -> /admin/products/new.
     - Click ligne -> /admin/products/[id]/edit.
     - Toggle actif/inactif direct depuis tableau.
     - Bouton 'Dupliquer' pour creer variante similaire.
  e) Bouton 'Sync QuickBooks' en haut -> appelle /api/sync/quickbooks manuellement.
     Affiche feedback: 'Sync en cours...' puis 'X produits mis a jour'.

ETAPE 47 — AJOUTER/MODIFIER PRODUIT (/admin/products/new et /[id]/edit)
Objectif: Formulaire complet creation/edition produit.
Actions:
  a) Creer /app/admin/products/new/page.tsx et /app/admin/products/[id]/edit/page.tsx.
  b) Formulaire:
     - Nom (requis).
     - Slug (auto-genere depuis nom, editable).
     - Description (textarea riche ou markdown).
     - Categorie (dropdown ou input).
     - Prix base (requis, en $).
     - Prix Affilie (auto-calcule: base * 0.85, editable).
     - Prix coute (admin only, pour calcul marge).
     - Images: upload multiple via Supabase Storage.
       Drag & drop order pour image principale.
     - Stock global (si pas de variantes).
     - Actif (checkbox).
  c) Section variantes (optionnel):
     - Ajouter variante: taille, couleur, stock, SKU.
     - Tableau variantes avec possibilite suppression.
  d) Bouton 'Enregistrer' -> INSERT ou UPDATE products.
  e) Validation: slug unique, prix positifs, au moins une image.

ETAPE 48 — MESSAGERIE ADMIN: ENVOI BROADCAST/PRIVE (/admin/messages)
Objectif: Envoyer messages aux Affilies (prives ou broadcast).
REGLES CRITIQUES:
  - Admin peut envoyer prive (a un Affilie) ou broadcast (tous).
  - Admin peut SUPPRIMER messages (suppression globale).
  - Admin NE PEUT PAS EDITER apres envoi.
  - Pas de reponses des Affilies (sens unique).
  - Reset mensuel le 1er du mois (tous supprimes automatiquement).
Actions:
  a) Creer /app/admin/messages/page.tsx.
  b) Bouton 'Nouveau message' -> modal ou page /admin/messages/new.
  c) Formulaire nouveau message:
     - Type: Radio 'Prive' ou 'Broadcast'.
     - Si prive: dropdown selection Affilie destinataire.
     - Sujet (requis).
     - Corps message (textarea, max 1000 caracteres)..
     - Checkbox 'Marquer comme perpetuel' (is_perpetual=true, ne sera pas supprime le 1er du mois).

     - Bouton 'Envoyer' -> INSERT dans messages.
       Si broadcast: is_broadcast=true, recipient_id=null.
       Si prive: is_broadcast=false, recipient_id=selected.
       sender_id = admin_id.
  d) Liste messages envoyes:
     - Tableau: Date, Type (Broadcast/Prive), Destinataire, Sujet, Actions.
     - Bouton 'Supprimer' -> DELETE message (suppression definitive pour tous).
     - PAS de bouton 'Editer'.
  e) Mention en bas: 'Tous les messages seront supprimes le 1er du mois prochain'.
     (tourne le 1er de chaque mois a minuit, supprime messages ou is_perpetual=false).

ETAPE 49 — SYNC INVENTAIRE QUICKBOOKS MANUEL (/admin/inventory)
Objectif: Interface admin pour sync QuickBooks et logs.
Actions:
  a) Creer /app/admin/inventory/page.tsx.
  b) Section status sync:
     - Derniere sync: timestamp, nombre items synces, erreurs.
     - Prochaine sync auto: dans X heures (cron toutes les heures).
  c) Bouton 'Lancer sync maintenant' -> appelle /api/sync/quickbooks.
     Affiche loading + progress si possible.
  d) Logs sync:
     - Tableau: Date, Items synces, Erreurs, Details.
     - Click details -> modal avec log complet JSON.
  e) Mapping SKU:
     - Tableau products avec colonne SKU actuel.
     - Possibilite modifier SKU pour matcher QuickBooks.
  f) Alertes:
     - Si sync echoue: afficher erreur en rouge + details.
     - Si items QB non matches: liste items non trouves.
  g) Rappel: READ-ONLY. Ne jamais ecrire dans QuickBooks.

ETAPE 50 — PARAMETRES ADMIN ET CONFIGURATION GLOBALE (/admin/settings)
Objectif: Parametres globaux app et config.
Actions:
  a) Creer /app/admin/settings/page.tsx.
  b) Sections:
     - Informations entreprise: nom, logo, email contact.
     - Taux commission par defaut (0.85 = 85%).
     - Politique retour: duree (30 jours), frais retour (maison-mere).
     - Config emails Resend: templates, expediteur.
     - Config Stripe: mode test/prod, webhooks.
     - Config QuickBooks: credentials, realm ID, dernier refresh token.
     - Cron jobs: enable/disable sync auto, reset mensuel points/messages.
  c) Chaque config: bouton 'Enregistrer' -> UPDATE dans table settings (ou variables env).
  d) Section danger:
     - 'Resetiser tous les points mensuels maintenant' (hors cycle).
     - 'Supprimer tous les messages maintenant'.
     - Confirmations multiples requises.
  e) Logs activite admin (audit trail): afficher dernieres 50 actions admin.

========================================
PHASE 7 — INTEGRATIONS ET EMAILS (Etapes 51-60)
========================================

ETAPE 51 — CONFIGURATION STRIPE COMPLETE
Objectif: S'assurer que Stripe est configure correctement pour paiements et webhooks.
Actions:
  a) Verifier /lib/stripe.ts existe avec Stripe SDK initialise.
  b) Variables env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
  c) Creer /app/api/stripe/webhook/route.ts (deja mentionne etape 25, verifier completude):
     - Verifier signature webhook avec STRIPE_WEBHOOK_SECRET.
     - Gerer events:
       * payment_intent.succeeded -> confirmer order, envoyer email.
       * payment_intent.failed -> UPDATE order status='failed', notifier client.
       * charge.refunded -> UPDATE order status='refunded', annuler commission.
  d) Dans dashboard Stripe, configurer webhook endpoint:
     URL: https://soyuz-hockey.vercel.app/api/stripe/webhook
     Events: payment_intent.succeeded, payment_intent.failed, charge.refunded.
  e) Tester webhooks en local avec Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe/webhook.
  f) Mode test vs prod: utiliser cles test en dev, prod keys en production Vercel.

ETAPE 52 — TEMPLATES EMAILS RESEND
Objectif: Creer tous les templates emails necessaires.
Utiliser Resend pour envoi emails transactionnels.
Actions:
  a) Creer /lib/email-templates/ avec fichiers React Email ou HTML templates.
  b) Templates requis:
     1. welcome-client.tsx: email bienvenue nouveau client.
     2. welcome-affiliate.tsx: email approbation Affilie avec code.
     3. order-confirmation.tsx: confirmation commande avec recap produits.
     4. order-shipped.tsx: notification expedition avec tracking.
     5. affiliate-new-sale.tsx: notif Affilie quand vente generee par son code.
     6. admin-new-order.tsx: notif admin nouvelle commande.
     7. admin-new-affiliate-request.tsx: notif admin nouvelle demande Affilie.
     8. password-reset.tsx: reset mot de passe (Supabase par defaut mais customisable).
  c) Chaque template: design coherent (couleurs SOYUZ, logo), responsive, texte clair.
  d) Utiliser React Email library pour composants reutilisables (Button, Container, etc).
  e) Tester templates: creer page /admin/emails/preview pour previsualiser.

ETAPE 53 — ENVOI EMAILS AUTOMATIQUES
Objectif: Integrer envoi emails dans les flows business.
Actions:
  a) Creer /lib/resend.ts: wrapper fonction sendEmail(to, template, data).
  b) Utiliser RESEND_API_KEY depuis variables env.
  c) Hooks pour envoi auto:
     - Apres inscription client -> welcome-client.tsx.
     - Apres approbation Affilie -> welcome-affiliate.tsx avec code.
     - Apres paiement Stripe reussi -> order-confirmation.tsx au client +
       admin-new-order.tsx a l'admin.
     - Apres order status='shipped' -> order-shipped.tsx au client.
     - Apres nouvelle vente avec affiliate_code -> affiliate-new-sale.tsx a l'Affilie.
     - Apres nouvelle demande Affilie -> admin-new-affiliate-request.tsx a l'admin.
  d) Gestion erreurs: si Resend API echoue, logger erreur mais ne pas bloquer flow.
  e) Rate limiting: Resend free tier limite 100 emails/jour, upgrader si necessaire.
  f) From email: configure domain verifie dans Resend (ex: noreply@soyuz-hockey.com).

ETAPE 54 — INTEGRATION QUICKBOOKS API COMPLETE
Objectif: Finaliser integration QuickBooks pour sync inventaire READ-ONLY.
Actions:
  a) Revoir /app/api/sync/quickbooks/route.ts (etape 15, s'assurer completude).
  b) OAuth 2.0 QuickBooks:
     - Stocker refresh_token de facon securisee (variable env ou Supabase encrypted).
     - Implementer refresh automatique du access_token (expire apres 1h).
  c) Endpoint sync:
     - GET /v3/company/{realmId}/query?query=SELECT * FROM Item.
     - Parser reponse JSON, extraire items avec Sku, Name, QtyOnHand.
     - Mapper par SKU aux products/product_variants Supabase.
     - UPDATE stock_quantity.
  d) Logs sync:
     - Creer table sync_logs: id, timestamp, items_synced, errors, details (JSON).
     - INSERT log apres chaque sync.
  e) Cron job Vercel:
     - Creer vercel.json a la racine:
       {
         "crons": [{
           "path": "/api/sync/quickbooks",
           "schedule": "0 * * * *"
         }]
       }
     - Sync toutes les heures.
  f) Gestion erreurs: retry logic si QuickBooks API timeout.
  g) RAPPEL CRITIQUE: NE JAMAIS ecrire dans QuickBooks (POST/PUT/DELETE interdits).

ETAPE 55 — NOTIFICATIONS PUSH (OPTIONNEL MAIS RECOMMANDE)
Objectif: Notifs navigateur pour Affilies (nouveaux messages, ventes).
Actions:
  a) Utiliser Web Push API ou service comme OneSignal/Pusher.
  b) Demander permission navigateur dans /app/affiliate/page.tsx au premier login.
  c) Stockage token push dans profiles.push_token.
  d) Triggers notifs:
     - Nouvelle vente generee par code Affilie.
     - Nouveau message admin broadcast ou prive.
     - Objectif atteint (ex: 3 points ce mois).
  e) Composant NotificationBell dans Header avec badge count.
  f) Liste notifications dans /affiliate/notifications (optionnel).

ETAPE 56 — UPLOAD FICHIERS SUPABASE STORAGE
Objectif: Gerer tous les uploads (photos profil, images produits).
Actions:
  a) Creer buckets Supabase Storage:
     - affiliate-photos (public read, auth write).
     - product-images (public read, admin write).
     - avatars (public read, auth write).
  b) RLS policies sur buckets:
     - affiliate-photos: seul owner peut upload/delete sa photo.
     - product-images: seul admin peut upload/delete.
     - avatars: seul owner peut upload/delete.
  c) Composant FileUpload.tsx reutilisable:
     - Drag & drop.
     - Preview avant upload.
     - Validation: type (jpg/png), taille max (2MB).
     - Progress bar upload.
     - Compression image cote client (optionnel, lib: browser-image-compression).
  d) Utiliser supabase.storage.from('bucket').upload(path, file).
  e) Apres upload: retourner public URL, stocker dans BDD.
  f) Supprimer ancienne image si remplacement (eviter files orphelins).

ETAPE 57 — GESTION ERREURS GLOBALE ET MONITORING
Objectif: Capturer erreurs et monitorer app en production.
Actions:
  a) Integrer Sentry ou Vercel Analytics pour error tracking.
  b) Creer /lib/logger.ts: wrapper console.log/error pour environnement.
     - En prod: envoyer a Sentry.
     - En dev: console standard.
  c) Error boundaries React:
     - Creer ErrorBoundary.tsx wrapper autour de l'app.
     - Afficher page erreur generique si crash.
  d) API error handling:
     - Toutes routes API retournent format consistent:
       { success: true/false, data/error, message }.
     - Codes HTTP corrects: 200, 400, 401, 403, 404, 500.
  e) Monitoring Vercel:
     - Activer Vercel Analytics.
     - Dashboard: response times, errors, traffic.
  f) Logs Supabase:
     - Activer logs queries lentes dans dashboard Supabase.

ETAPE 58 — SEO ET METADATA
Objectif: Optimiser SEO pour pages publiques.
Actions:
  a) Metadata Next.js 14:
     - Dans chaque page.tsx, exporter metadata object ou generateMetadata().
     - Inclure: title, description, openGraph (og:image, og:title), twitter card.
  b) Pages cles SEO:
     - / (home): titre 'SOYUZ Hockey - Equipement professionnel'.
     - /products: 'Catalogue produits SOYUZ'.
     - /products/[slug]: titre dynamique depuis nom produit.
     - /b2b: 'Solutions B2B SOYUZ Hockey'.
  c) Sitemap.xml:
     - Creer /app/sitemap.ts (Next.js 14 generate sitemap auto).
     - Inclure toutes pages statiques + produits dynamiques.
  d) Robots.txt:
     - Creer /app/robots.ts.
     - Allow tous crawlers sauf /admin, /affiliate, /account.
  e) Schema.org markup:
     - Ajouter JSON-LD sur pages produits (Product schema).
     - Home page: Organization schema.
  f) Performance:
     - Images: utiliser Next.js Image avec lazy loading.
     - Fonts: preload critical fonts.

ETAPE 59 — TESTS MANUELS ET SCENARIOS CRITIQUES
Objectif: Tester tous les flows critiques avant deploy final.
Actions:
  a) Creer 3 comptes test:
     - client-test@soyuz.com (role=client).
     - affiliate-test@soyuz.com (role=affiliate, status=approved, code=SOY-TEST).
     - admin-test@soyuz.com (role=admin).
  b) Scenarios a tester:
     1. Inscription client -> login -> achat produit -> paiement Stripe test.
     2. Inscription Affilie -> attente approbation -> admin approuve -> login Affilie
        -> voir dashboard -> uploader photo -> voir classement.
     3. Achat avec code Affilie SOY-TEST -> verifier commission creee -> Affilie voit vente.
     4. Admin envoie message broadcast -> tous Affilies recoivent -> marquent lu.
     5. Sync QuickBooks manuel -> verifier stock mis a jour.
     6. Remboursement commande -> verifier commission annulee.
  c) Tester responsive:
     - Desktop (1920x1080).
     - Tablet (768x1024).
     - Mobile (375x667).
  d) Tester navigateurs: Chrome, Firefox, Safari, Edge.
  e) Verifier emails recus (utiliser Resend test mode ou emails reels).

ETAPE 60 — DOCUMENTATION TECHNIQUE INTERNE
Objectif: Documenter pour faciliter maintenance future.
Actions:
  a) Creer README.md a la racine:
     - Description projet.
     - Stack technique.
     - Installation locale (npm install, env vars, supabase setup).
     - Scripts: npm run dev, build, deploy.
     - Structure dossiers.
  b) Creer DEPLOYMENT.md:
     - Processus deploy Vercel.
     - Variables env requises (liste complete).
     - Config Stripe webhooks.
     - Config QuickBooks OAuth.
     - Cron jobs Vercel.
  c) Creer ARCHITECTURE.md:
     - Schema BDD (tables, relations).
     - Flow auth (middleware, RLS).
     - Flow paiement Stripe.
     - Flow sync QuickBooks.
     - Flow commissions Affilie.
  d) Commentaires code:
     - Ajouter JSDoc sur fonctions complexes.
     - Commenter logique business non evidente.
  e) Changelog:
     - Creer CHANGELOG.md pour tracker versions futures.

========================================
PHASE 8 — FINITIONS ET OPTIMISATIONS (Etapes 61-70)
========================================

ETAPE 61 — OPTIMISATION PERFORMANCE FRONTEND
Objectif: Ameliorer vitesse chargement et fluidite.
Actions:
  a) Code splitting:
     - Lazy load composants lourds (graphiques, modals) avec React.lazy().
     - Dynamic imports pour pages admin/affiliate.
  b) Images:
     - Toutes images via next/image avec priority sur hero images.
     - Formats modernes: WebP avec fallback.
     - Sizes appropriees (responsive).
  c) Fonts:
     - Preload fonts critiques dans layout.tsx.
     - Font-display: swap pour eviter FOIT.
  d) Bundle size:
     - Analyser avec @next/bundle-analyzer.
     - Tree-shaking: importer seulement necessaire (ex: lodash/get au lieu de lodash).
  e) CSS:
     - Purge Tailwind classes non utilisees (auto en prod).
     - Critical CSS inline si applicable.
  f) Lighthouse audit:
     - Viser score >90 Performance, Accessibility, Best Practices, SEO.

ETAPE 62 — OPTIMISATION REQUETES SUPABASE
Objectif: Reduire nombre queries et temps reponse.
Actions:
  a) Indexes BDD:
     - Ajouter index sur colonnes frequemment filtrees:
       profiles.role, affiliates.status, orders.user_id, orders.affiliate_code,
       commissions.affiliate_id, messages.recipient_id.
  b) Queries optimisees:
     - Utiliser .select() avec colonnes specifiques au lieu de *.
     - Limit results avec .limit() si liste longue.
     - Pagination cote serveur.
  c) Caching:
     - Cache stats dashboard avec revalidation toutes les 5 min.
     - useSWR ou React Query pour fetch avec cache.
  d) Batch queries:
     - Regrouper queries multiples en une si possible (ex: fetch affiliate + points + commissions en une query).
  e) RLS performance:
     - S'assurer que policies RLS utilisent indexes.

ETAPE 63 — ACCESSIBILITE (A11Y)
Objectif: Rendre app accessible a tous.
Actions:
  a) Audit accessibilite:
     - Utiliser axe DevTools ou Lighthouse.
     - Fixer toutes violations critiques.
  b) Navigation clavier:
     - Tous interactifs (buttons, links, inputs) accessibles via Tab.
     - Focus visible (outline ou ring).
     - Escape ferme modals/drawers.
  c) ARIA labels:
     - Tous icones boutons ont aria-label.
     - Modals ont role="dialog" et aria-labelledby.
     - Forms ont labels associes.
  d) Contraste couleurs:
     - Verifier contraste texte/background (min 4.5:1 pour normal, 3:1 pour large).
     - Texte rouge SOYUZ sur fond noir: verifier lisibilite.
  e) Screen readers:
     - Tester avec NVDA (Windows) ou VoiceOver (Mac).
     - Annoncer changements dynamiques avec aria-live.
  f) Alt text images:
     - Toutes images produits ont alt descriptif.

ETAPE 64 — SECURITE AVANCEE
Objectif: Renforcer securite app.
Actions:
  a) Rate limiting API:
     - Limiter requetes API par IP (ex: max 100/min).
     - Utiliser middleware ou Vercel Edge Config.
  b) CSRF protection:
     - Next.js API routes: verifier origin header.
     - Tokens CSRF pour actions sensibles (optionnel si Supabase gere).
  c) Input sanitization:
     - Valider/sanitize tous inputs utilisateur.
     - Prevenir XSS: echapper HTML dans user content.
     - Prevenir SQL injection: toujours utiliser parameterized queries Supabase.
  d) Secrets rotation:
     - Plan pour rotation periodique API keys (Stripe, QuickBooks, Resend).
  e) Audit dependencies:
     - Lancer npm audit regulierement.
     - Mettre a jour packages avec vulnerabilites.
  f) HTTPS only:
     - Forcer HTTPS en prod (Vercel le fait par defaut).
  g) Content Security Policy:
     - Ajouter CSP headers dans next.config.js.

ETAPE 65 — MOBILE UX FINAL
Objectif: Peaufiner experience mobile.
Actions:
  a) Touch targets:
     - Tous boutons min 44x44px (Apple guideline).
     - Espacement suffisant entre elements cliquables.
  b) Drawers et modals:
     - Drawers slide depuis bas sur mobile (plus naturel).
     - Modals prennent 100vh sur mobile si contenu long.
  c) Forms mobile:
     - Input type="email" pour clavier email.
     - Input type="tel" pour clavier numerique.
     - Autocomplete attributes (name, email, etc).
  d) Sticky headers:
     - Header reste visible en scroll sur mobile.
     - CTA 'Ajouter panier' sticky en bas sur fiche produit mobile.
  e) Swipe gestures:
     - Swipe pour fermer drawer (optionnel).
  f) Viewport meta:
     - Verifier <meta name="viewport" content="width=device-width, initial-scale=1" />.
  g) Test real devices:
     - Tester sur vrais iPhone et Android si possible.

ETAPE 66 — ANALYTICS ET TRACKING
Objectif: Tracker comportement users pour insights.
Actions:
  a) Google Analytics 4 (ou alternative privacy-friendly):
     - Installer gtag.js ou package next-ga.
     - Tracker pageviews, events critiques:
       * Achat complete.
       * Inscription Affilie.
       * Utilisation code Affilie au checkout.
       * Upload photo Affilie.
  b) Vercel Analytics:
     - Activer Web Analytics Vercel.
     - Insights vitals (CLS, FCP, LCP, etc).
  c) Heatmaps (optionnel):
     - Hotjar ou Microsoft Clarity.
     - Analyser ou users cliquent le plus.
  d) Custom events:
     - Tracker conversions importantes:
       * Affiliate code copie.
       * Message admin envoye.
       * Produit ajoute panier.
  e) Dashboard analytics interne:
     - Page /admin/analytics avec stats business:
       * Taux conversion visiteur -> client.
       * Taux approbation Affilie.
       * Valeur moyenne commande.
       * Top Affilies.

ETAPE 67 — MODES DARK/LIGHT (OPTIONNEL)
Objectif: Offrir choix theme clair/sombre.
Note: SOYUZ est deja theme sombre par defaut. Cette etape est optionnelle.
Actions:
  a) Si implemente:
     - Toggle dans Header ou Settings.
     - Stocker preference localStorage.
     - Tailwind: utiliser dark: prefix pour styles dark mode.
     - Couleurs light mode: fond blanc, texte noir, accents rouge SOYUZ.
  b) Si non implemente:
     - Forcer dark mode uniquement (theme carbone SOYUZ).
     - Simplifier: pas de toggle, juste dark.

ETAPE 68 — INTERNATIONALISATION (I18N) (OPTIONNEL)
Objectif: Support multilingue si necessaire.
Note: Actuellement en francais. Ajouter anglais si expansion internationale.
Actions:
  a) Si implemente:
     - Utiliser next-intl ou i18next.
     - Fichiers traduction: /locales/fr.json, /locales/en.json.
     - Detecter langue navigateur.
     - Toggle langue dans Header.
  b) Si non implemente:
     - Rester francais uniquement pour commencer.
     - Preparer code pour i18n futur (strings dans constantes).

ETAPE 69 — BACKUP ET DISASTER RECOVERY
Objectif: Plan de backup et recuperation donnees.
Actions:
  a) Backup Supabase:
     - Plan Supabase Pro: backups automatiques quotidiens.
     - Tester restore backup sur instance test.
  b) Export donnees critiques:
     - Script cron pour export CSV affiliates, orders, commissions (hebdo).
     - Stocker exports dans bucket Supabase ou S3.
  c) Monitoring uptime:
     - Utiliser UptimeRobot ou Vercel monitoring.
     - Alertes si site down.
  d) Plan incident:
     - Documenter procedure si BDD corrompue ou site down.
     - Contact support Vercel/Supabase.
  e) Versionning code:
     - Git tags pour releases importantes.
     - Branche main protegee, PRs requises.

ETAPE 70 — CHECKLIST PRE-LANCEMENT ET GO-LIVE
Objectif: Verifier tout avant mise en production finale.
Checklist complete:
  a) Fonctionnel:
     ✓ Tous les 70 etapes completees.
     ✓ Tests manuels passes (etape 59).
     ✓ Zero bugs critiques.
  b) Configuration:
     ✓ Variables env prod configurees Vercel.
     ✓ Stripe webhooks prod configures.
     ✓ QuickBooks OAuth prod setup.
     ✓ Resend domain verifie, emails prod.
     ✓ Cron jobs Vercel actifs.
  c) Securite:
     ✓ RLS actives sur toutes tables.
     ✓ Middleware routes proteges.
     ✓ Secrets rotation plan en place.
  d) Performance:
     ✓ Lighthouse score >90.
     ✓ Temps chargement <3s.
     ✓ Images optimisees.
  e) Contenu:
     ✓ Produits ajoutes en BDD.
     ✓ Pages statiques remplies (A propos, CGV, etc).
     ✓ Logo et branding finalises.
  f) Legal:
     ✓ Politique confidentialite.
     ✓ CGV (conditions generales vente).
     ✓ Mentions legales.
     ✓ Politique retour 30j (frais maison-mere).
  g) Monitoring:
     ✓ Analytics installes.
     ✓ Error tracking (Sentry) actif.
     ✓ Uptime monitoring actif.
  h) Documentation:
     ✓ README complet.
     ✓ DEPLOYMENT guide.
     ✓ ARCHITECTURE doc.
  i) Backup:
     ✓ Backup Supabase configure.
     ✓ Export initial donnees fait.
  j) Communication:
     ✓ Email admin configure.
     ✓ Templates emails testes.
     ✓ Messages bienvenue prepares.

APRES LE LANCEMENT:
- Monitorer logs et erreurs premiere semaine.
- Collecter feedback premiers users.
- Iterer ameliorations basees sur usage reel.
- Celebrer le lancement! 🚀

========================================
FIN DU MASTER TASK LIST (70 ETAPES)
========================================

Ce document est votre guide complet pour implementer SOYUZ Dashboard App.
Chaque etape est detaillee avec objectif, actions precises, et contraintes.
L'agent Antigravity peut suivre ce plan de A a Z pour completer le projet.

REMARQUES FINALES IMPORTANTES:
1. Terminologie: TOUJOURS utiliser AFFILIATE (technique) et Affilie (UI). Jamais 'rep'.
2. QuickBooks: READ-ONLY uniquement. Ne jamais ecrire dans QB.
3. Messagerie admin: suppression globale OK, edition interdite, reset mensuel.
4. Header: boutons Fermer ET Deconnexion dans le meme composant.
5. Pricing: -15% Affilies, +85% commission sur marge, retour 30j frais maison-mere.
6. Points: 1pt=1000$, 50pts=cadeau, 3pts/mois=tirage, reset mensuel.
7. Classement: photo obligatoire pour apparaitre.
8. Carte hockey: feature unique et importante pour gamification.
9. Mobile: 100% responsive, drawers 2 colonnes.
10. Design: theme carbone/noir/rouge SOYUZ partout.

Bonne chance pour l'implementation! 🏂