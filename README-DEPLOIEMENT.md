# RCSQ M10 — Statistiques en direct par QR code (Parent assistant)

**Commence par `COMMENCER-QR-PARENT.txt`.** Cette version conserve les fonctionnalités de l’application existante et ajoute l’invitation d’un parent sans e-mail, limitée à un mini-match.

## Installation — ordre impératif

1. Sauvegarde les 11 fiches **localement sur ton iPhone** via Réglages → Exporter une sauvegarde privée.
2. Firebase Authentication → Méthode de connexion → Ajouter un fournisseur → **Anonyme** → Activer. Conserver e-mail/mot de passe pour le coach.
3. Firebase Cloud Firestore → Règles → remplacer toutes les règles par le fichier **`firestore.rules`** livré ici et publier (l’ancien jeu de règles n’autorise pas les invités).
4. GitHub `okajb/rcsq-m10` → Téléverser des fichiers → glisser **les fichiers et les dossiers contenus dans ce ZIP**, puis valider.
5. Dans RCSQ M10 → Plateaux → Statistiques en direct : se connecter comme admin. Ouvrir un mini-match et toucher **« Inviter parent (QR) »**. Le partage du match sera proposé s’il n’est pas déjà actif.
6. Le parent scanne le QR code et ouvre le lien. Aucun compte ni e-mail à fournir ; il suit uniquement ce match et peut noter les actions.
7. En fin de match, dans **Statistiques en direct** du coach, **Révoquer** le lien. Un lien expire également après environ 8 heures.

L’application conserve IndexedDB et ses fiches privées sur l’iPhone du coach. N’efface pas l’app pour la mise à jour.

### Sécurité

La base de données ne publie ni photos ni noms de famille, dates de naissance ou numéros FFR. Les prénoms, statistiques et score du mini-match partagé sont visibles pour les personnes en possession du lien d’invitation temporaire. Le lien a un jeton secret de 192 bits ; ne pas l’afficher publiquement et le révoquer après le match.

**Limites :** Internet est requis pour la saisie partagée. Le chronomètre individuel et les remplacements sont gérés uniquement sur l’iPhone du coach. Pour valider la mise en service, effectuer un essai réel entre deux appareils. Les anciennes statistiques restent locales. La synchronisation et l’authentification utilisent le forfait Firebase Spark dans ses limites, sans forfait payant.

### Guide historique

# RCSQ M10 — Mise à jour Firebase configurée

La configuration Web du projet `rcsq-m10-direct` est déjà intégrée.
Consulte **COMMENCER-ICI.txt** pour les étapes à suivre et les précautions.

**IMPORTANT** : les fiches privées (photos, dates de naissance, licences FFR) ne doivent jamais être envoyées sur le dépôt GitHub public.
