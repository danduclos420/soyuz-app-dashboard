# 🏒 SOYUZ BC — MASTER PLAN DE BUILD SUPRÊME
**Stack :** Next.js 14 (App Router) + TypeScript + Supabase + Stripe + Resend + Zustand + Framer Motion  
**Version :** 2.0 | **Dernière mise à jour :** Mars 2026

---

## 🎯 VISION & OBJECTIFS
Le Dashboard SOYUZ est une plateforme unifiée pour les clients, les affiliés et l'administration.  
Points clés :
- **Gamification :** Le système de "Carte de Hockey" (Hockey Card) pour tous les utilisateurs.
- **Transparence :** Monitoring en direct des ventes, commissions et points.
- **Efficacité :** Synchronisation QuickBooks (Read-Only) pour l'inventaire.
- **Aesthétique :** Design Carbone / Noir / Rouge SOYUZ (Premium).

---

## 🛠 NOUVELLES RÈGLES MÉTIER (CRITIQUE)
1. **Terminologie :** 
   - **AFFILIATE** (Technique - code)
   - **Affilié** (UI - humain)
   - *Interdiction formelle d'utiliser "rep" ou "représentant".*
2. **Points Dashboard :** 
   - **Ratio dynamique :** Dany définit combien de $ valent 1 point (ex: 1000$).
3. **Objectifs Cadeaux :**
   - Dany (Admin) définit les paliers de points nécessaires pour les 2 cadeaux déblocables.
   - L'Affilié voit 3 barres de progression (Points accumulés, Cadeau 1, Cadeau 2).
   - Contrôle à 100% par Dany via son dashboard.
4. **Hockey Card :**
   - Chaque profil (Client et Affilié) possède une carte style NHL.
   - Contient : Photo de l'utilisateur, stats complètes (Total sales, Monthly sales, Points, Commissions).
5. **Pricing :**
   - Prix Client Standard = Coût QB + 85%.
   - Prix Affilié = -15% sur le prix client.
   - Commission Affilié = 10% sur le prix d'origine client.

---

## 📋 MASTER TASK LIST (INDEXÉ SUR LE PLAN DÉTAILLÉ)

### PHASE 0 — SETUP & INFRASTRUCTURE
- [ ] **CP-01 :** Audit du Repo & Deploiement (Vercel/GitHub).
- [ ] **CP-02 :** Validation Structure App Router Next.js 14.
- [ ] **CP-03 :** Configuration Theme Carbone Global (Tailwind).
- [ ] **CP-04 :** Middleware & Protection des Routes par Rôle (Admin/Affiliate/Customer).

### PHASE 1 — BASE DE DONNÉES & LOGIQUE (SCHEMA ALIGNMENT)
- [ ] **DB-01 :** Mise à jour Table `profiles` & `affiliates`.
- [ ] **DB-02 :** Logique de Points (1pt / 1000$).
- [ ] **DB-03 :** Table de Configuration pour "Gift Goals" (Dany UI).

### PHASE 2 — LE SYSTÈME "HOCKEY CARD"
- [ ] **HC-01 :** Composant `HockeyCard` (Flip animation, Premium UI).
- [ ] **HC-02 :** Intégration `ImageCropper` pour photo profil obligatoire.
- [ ] **HC-03 :** Dashboard Utilisateur : Affichage de la carte et stats.
- [ ] **HC-04 :** Export & Partage de la carte (PNG/Social).

### PHASE 3 — DASHBOARD AFFILIÉ (GAMIFICATION COMPLETE)
- [ ] **DA-01 :** Leaderboard "Nœuds Actifs" (Grille de pastilles & Liste).
- [ ] **DA-02 :** Comparaison de Cartes Côte-à-Côte.
- [ ] **DA-03 :** Graphiques de performance (Recharts).
- [ ] **DA-04 :** Boîte de Réception (Broadcast Admin).

### PHASE 4 — DASHBOARD ADMIN (COMMANDEMENT)
- [ ] **ADM-01 :** Gestion des Approuvations Affiliés.
- [ ] **ADM-02 :** Interface de Configuration des Objectifs Cadeaux.
- [ ] **ADM-03 :** Monitoring Global & Sync QuickBooks.

---

## 🚀 DÉPLOIEMENT & QA
- **Sync :** Toutes les heures (Vercel Cron).
- **Mobile :** 100% Responsive, Drawers 2 colonnes.
- **Qualité :** TypeScript Strict, Zod Validation, Conventional Commits.

---
*Document de référence pour le développement continu - SOYUZ BC North America*
 14 + Supabase + Stripe..."

Document cree avec Comet - Mars 2026 | SOYUZ BC North America
