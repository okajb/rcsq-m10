# RCSQ M10 Coach — V6.3 Confort terrain

## Ce qui change

- **Gros indicateur parent connecté** sur l'écran coach : vert si un téléphone parent est réellement actif, orange en attente, rouge hors ligne.
- **Confirmation visuelle courte** sur le téléphone parent après chaque plaquage, essai ou essai adverse.
- **Écran parent plus stable** : une stat ne redessine plus toute la page. Seuls les compteurs changent. Lors d'un remplacement, la composition se met à jour sans faire perdre sa position à l'écran.
- **Résumé automatique de fin de match** : score, durée, plaquages, essais, temps moyen et temps de jeu de chaque joueur.
- **Alerte douce d'équité du temps de jeu** : après quelques minutes, si un joueur est nettement sous la moyenne du plateau, l'app le signale au coach sans vibration ni pop-up bloquant.
- **Sauvegarde renforcée** : stockage habituel + copie locale de secours IndexedDB + copie d'urgence. Une sauvegarde est forcée à la fin du match.

## IMPORTANT — une petite mise à jour Firebase est nécessaire

Le nouvel indicateur « PARENT CONNECTÉ » utilise une présence temporaire. Il faut donc republier les règles Firestore fournies dans `firestore.rules`.

1. Firebase Console → **Firestore Database** → **Règles**.
2. Remplacer tout le contenu par le fichier `firestore.rules` de cette V6.3.
3. Cliquer sur **Publier**.

Aucun autre réglage Firebase n'est à refaire. L'authentification Anonyme reste telle qu'elle est déjà configurée.

## Mise à jour GitHub

Décompresser le ZIP V6.3 puis téléverser le contenu du dossier `m10-coach` dans le dépôt `okajb/rcsq-m10`, en remplaçant les fichiers existants. Le cache passe en V6.3 pour forcer la nouvelle version sur iPhone.
