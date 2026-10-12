# RCSQ M10 Coach — V6.2 Terrain fluide

## Mise à jour depuis la V6.1

Aucun changement Firebase / Firestore n'est nécessaire.

Remplace simplement les fichiers du dépôt GitHub par ceux de cette version.

## Améliorations

- L'écran coach n'est plus reconstruit toutes les secondes : seuls les chronos changent.
- Remplacements plus rapides : toucher le joueur qui sort puis le remplaçant qui entre.
- Défilement automatique vers le banc après sélection du sortant.
- Retour haptique sur les changements.
- Bouton « Annuler le dernier changement ».
- Synchronisation parent temps réel + vérification de secours toutes les 1,5 s.
- Rafraîchissement automatique du parent après retour dans Safari/app ou retour d'Internet.
- État de connexion parent : SYNCHRO OK / RECONNEXION / HORS LIGNE.
- Saisie parent protégée contre les doubles clics involontaires.
- Gros boutons PLAQUAGE / ESSAI et bouton ESSAI ADVERSAIRE toujours facile d'accès.
- Zone de saisie parent sticky en bas de l'écran.
- Nouvelle clé de cache V6.2 pour forcer la mise à jour GitHub Pages/PWA.

## Test conseillé

1. Mettre la V6.2 sur GitHub.
2. Ouvrir l'app coach et lancer un nouveau match.
3. Créer/ouvrir le QR parent et le scanner avec un autre téléphone.
4. Faire un remplacement : l'écran parent doit changer quasi immédiatement, avec un filet de sécurité <= 1,5 s.
5. Tester PLAQUAGE, ESSAI, ESSAI ADVERSAIRE et ANNULER.
6. Faire un appel / passer sur une autre app puis revenir : les chronos coach doivent rester corrects.
