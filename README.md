# Snake Game

Refonte d'un jeu Snake en `HTML`, `CSS` et `JavaScript` vanilla, avec stockage local des scores via `localStorage`.

## Aperçu

Le projet met en scène un Snake dans un univers inspiré d'Isaac Newton et d'une ligne temporelle à protéger.  
L'objectif est simple : collecter les pommes, survivre le plus longtemps possible et entrer dans le classement local.

## Fonctionnalités

- Interface modernisée et responsive
- Rendu canvas retravaillé
- Contrôles clavier `ZQSD`, `WASD` et flèches
- Pause et reprise avec `Espace`
- Contrôles tactiles pour mobile
- Classement local sauvegardé dans le navigateur
- Musique et effets sonores
- Modale d'introduction et overlay de partie

## Stack technique

- `HTML5`
- `CSS3`
- `JavaScript` vanilla
- `Canvas API`
- `localStorage`

## Structure

```text
snake-game/
├── index.html
├── assets/
│   ├── css/
│   │   ├── index.css
│   │   ├── modal.css
│   │   └── score.css
│   └── js/
│       ├── index.js
│       ├── snakeGame.js
│       └── scoreManager.js
└── music/
```

## Lancer le projet

Le projet ne nécessite pas de build.

1. Place le dossier dans ton environnement local.
2. Lance ton serveur local habituel, par exemple avec Laragon.
3. Ouvre `index.html` ou l'URL locale du projet dans ton navigateur.

## Stockage des scores

Les scores et le meilleur score sont enregistrés uniquement dans le navigateur via `localStorage`.  
Il n'y a pas de base de données distante ni d'API serveur.

## Objectif de la refonte

Cette version améliore fortement :

- la qualité visuelle
- la lisibilité de l'interface
- la fluidité de la boucle de jeu
- l'expérience sur desktop et mobile
- la cohérence générale de l'UX

## Auteur

Projet retravaillé pour une version plus moderne, plus propre et plus agréable à jouer tout en restant sur une base simple en front pur.
