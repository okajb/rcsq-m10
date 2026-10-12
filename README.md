# RCSQ M10 Coach - V5 (version GitHub Pages, donnees privees locales)

## IMPORTANT
Le dossier de l'application peut etre publie sur GitHub Pages.
Le fichier `RCSQ-M10-DONNEES-PRIVEES-NE-PAS-METTRE-SUR-GITHUB.json` ne doit PAS etre mis sur GitHub : il contient les photos, dates de naissance et numeros FFR des enfants.

## Installation
1. Publier uniquement le contenu du ZIP `RCSQ-M10-Coach-V5-PUBLIC.zip` sur le deuxieme projet GitHub Pages.
2. Ouvrir l'application sur l'iPhone et l'ajouter a l'ecran d'accueil.
3. Dans Accueil > Donnees joueurs privees > Charger les fiches.
4. Choisir le fichier `RCSQ-M10-DONNEES-PRIVEES-NE-PAS-METTRE-SUR-GITHUB.json` depuis Fichiers.
5. Les noms, photos, numeros FFR et dates de naissance sont alors stockes uniquement dans le navigateur de l'iPhone.

## Fiche joueur
Chaque fiche affiche : photo, numero FFR, date de naissance, classe d'age, temps total joue, nombre total de plaquages, nombre total d'essais, matchs joues et notes educateur.


## Mise à jour V5.1
- Ajout d’un bouton **Remettre les stats à zéro** dans l’onglet Statistiques.
- La remise à zéro efface temps de jeu, plaquages, essais, historique, match/plateau de test.
- Les photos, licences, dates de naissance, notes joueurs et entraînements sont conservés.
- Double confirmation pour éviter une suppression accidentelle.


## V6 — QR parent / statistiques en direct

- Le coach garde seul les remplacements, chronos, mi-temps et fin de match.
- Le parent scanne un QR et voit uniquement les joueurs actuellement sur le terrain.
- Le parent peut saisir : **PLAQUAGE +1**, **ESSAI +1** et **ESSAI ÉQUIPE ADVERSE +1**.
- Les changements faits par le coach se synchronisent automatiquement sur l'écran du parent.
- Le QR expire après 8 heures et peut être révoqué à la fin du match.
- Aucune photo, date de naissance, licence FFR ou note éducateur n'est envoyée dans Firestore.

### IMPORTANT avant le premier QR
1. Dans Firebase Console > Firestore Database > Rules, remplacer les règles par le contenu du fichier `firestore.rules` puis **Publier**.
2. Dans Firebase Authentication > Sign-in method, vérifier que **Anonymous / Anonyme** est activé pour que les parents n'aient aucun compte à créer.
3. Le compte coach doit conserver son rôle `admin` dans `teams/rcsq-m10/members/<uid>`.

Le fichier `cloud-config.js` contient uniquement la configuration Web publique du projet Firebase déjà utilisé par l'application.


## V6.1 — correction synchronisation des remplacements
- Après un remplacement fait par le coach, la nouvelle composition est envoyée à Firebase avant confirmation à l'écran.
- L'écran parent garde le listener temps réel et ajoute un filet de sécurité : vérification de la composition toutes les 2 secondes quand l'écran parent est visible.
- Le parent voit donc automatiquement le joueur entrant et ne peut plus saisir de stat sur le joueur sorti.
- Aucun changement de règles Firestore n'est nécessaire par rapport à la V6.
