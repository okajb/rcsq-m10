# RCSQ M10 — Version 2 : temps de jeu individuel

**Déjà installé sur GitHub ?** Ne recrée pas le dépôt et ne supprime pas l'app de ton iPhone. Lis d'abord `MISE-A-JOUR-GITHUB.txt` pour sauvegarder puis mettre à jour les fichiers du dépôt `okajb/rcsq-m10`.

Nouveautés : compteur de temps par joueur à côté de « Sur le terrain » / « Remplaçant », chrono qui s'arrête à la sortie et reprend à l'entrée, cumul de saison sur chaque fiche, pause et remise à zéro cohérentes. Les anciens matchs ne permettent pas de reconstituer les temps individuels passés.

---

# RCSQ M10 — Application de coach 2026–2027

## 1. Ce dossier ZIP est destiné à GitHub Pages (site PUBLIC)

Il comprend : `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `icons/`, `assets/`, `.nojekyll` et ce README.

- PWA iPhone gratuite, sans compte, sans App Store payant, sans cloud payant.
- Accueil avec illustration validée : coach en bleu / casquette verte, équipe de rugby dessinée.
- Identité graphique RCSQ M10 (bleu nuit, bleu roi, rouge, jaune). Le pictogramme SVG inclus est une **création pour l’application**, **pas le logo officiel** du club. Le blason d’origine peut être importé dans Réglages sur ton appareil.
- Six ateliers M10, effectif, fiches, présences, plateaux, mini-matchs, chronomètre, essais / statistiques et sauvegarde locale.
- Les 11 fiches (portraits et numéros FFR) sont **dans le fichier JSON privé séparé**, pas dans ce ZIP.

## 2. Mise en ligne depuis l'ordinateur (GitHub)

1. Décompresser `RCSQ-M10-GITHUB-PRET.zip`.
2. Sur github.com, créer un **NOUVEAU dépôt**, nommé `rcsq-m10` (ne jamais remplacer le dépôt OKAJB).
3. `Add file` → `Upload files` puis glisser **le contenu du dossier extrait**, pas le ZIP lui-même. Les fichiers `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest` doivent apparaître directement à la racine, et les dossiers `assets` et `icons` doivent être présents.
4. Cliquer `Commit changes`.
5. `Settings` → `Pages` → `Deploy from a branch`, branche `main`, dossier `/ (root)` → `Save`.
6. Ouvrir le lien affiché dans Pages. Il ressemble à `https://PSEUDO.github.io/rcsq-m10/` ; remplacer PSEUDO par ton identifiant GitHub.

## 3. Installation sur iPhone

1. Ouvrir le lien dans **Safari**.
2. Utiliser Partager → **Sur l’écran d’accueil** → Ajouter.
3. Lancer l'application **par cette icône**.
4. Toucher **Importer les 11 fiches privées**.
5. Choisir le fichier `RCSQ-M10-DONNEES-PRIVEES-11-JOUEURS.json` depuis Fichiers.
6. Les 11 portraits et licences seront disponibles uniquement sur cet appareil. Si le site Safari et la version installée n'ont pas le même stockage, refaire l'import dans l'icône installée.

## 4. Sécurité des enfants – IMPORTANT

**NE PAS METTRE dans GitHub** :
- `RCSQ-M10-DONNEES-PRIVEES-11-JOUEURS.json` ;
- le PDF original `Licences M-10.pdf` ;
- les 11 photos individuelles ;
- les exports `RCSQ-M10-SAUVEGARDE-PRIVEE-...json`.

Les noms, dates de naissance, portraits et numéros de qualification FFR ne sont pas visibles par les visiteurs du site. Les données importées ne sont pas transmises à GitHub : elles sont enregistrées via IndexedDB dans le navigateur de l'appareil.

**Attention :** les données locales ne sont pas chiffrées par l'app. Protéger l'iPhone (code/Face ID). Faire des exports privés réguliers et les conserver hors d'un site public. Effacer les données du navigateur ou désinstaller l'app peut effacer les données de suivi.

La couverture publique contient une **illustration stylisée de groupe** validée auparavant. Bien vérifier les autorisations de diffusion d'images de mineurs ou de visuels dérivés avant de publier le dépôt. Si tu n'as pas ces autorisations, remplace `assets/couverture-rcsq.webp` par une illustration du terrain ne montrant pas d’enfants avant mise en ligne.

## 5. Logo officiel et personnalisation

`assets/logo-officiel-rcsq.jpg` est le blason officiel transmis pour le club. Il est affiché par défaut dans l’en-tête et les nouvelles icônes de l’application. Le réglage d’un logo personnalisé sur le téléphone reste prioritaire si tu en avais déjà importé un.

## 6. Tester avant de publier

Sur ton ordinateur, dans le dossier décompressé, tu peux lancer `python3 -m http.server 8000` puis ouvrir `http://localhost:8000`. L'application doit afficher la couverture et les menus même sans import des fiches.

© Carnet coach RCSQ M10 · Saison 2026–2027


## Version blason officiel (octobre 2026)

Le blason officiel transmis a été ajouté à l’en-tête, au favicon, au manifeste PWA et aux icônes Apple. Les fonctions et le stockage local des joueurs et présences ne sont pas modifiés. Les icônes iOS déjà installées peuvent rester temporairement en cache : ne désinstalle pas l’app pour les forcer, sinon tu risques de perdre les données locales.
