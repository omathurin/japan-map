# Tabi — Le Japon à travers le temps

Atlas historique interactif en français, construit avec JavaScript, SVG et Vite.

## Essayer sans installation

Téléchargez `Tabi.html` et ouvrez-le dans votre navigateur. Cette version autonome embarque les récits, la carte, les illustrations et les polices. Elle fonctionne hors ligne ; les liens vers les sources nécessitent Internet.

## Développement

Prérequis : Node.js 22.12+ (validé avec Node.js 24) et npm.

```sh
cd /workspace/japan-map
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173
```

```sh
npm run build
npm run preview -- --port 4173
```

Les polices et les données cartographiques sont servies localement. Aucun compte, clé API ou service externe n'est nécessaire à l'exploration. Les liens « Approfondir » ouvrent les sites sources.

## Exploration

- Frise de 710 à 2025, dix périodes et lecture automatique.
- Six lentilles : politique, guerres, religion, culture, arts et cuisine.
- Points accessibles au clic et au clavier, fiche par défaut pour chaque période.
- Zoom, recentrage, découverte aléatoire et ambiance synthétique optionnelle.
- Interface adaptée aux mobiles.

## Contenus et limites

Les 15 récits de `src/data.js` forment une sélection éditoriale introductive, particulièrement développée pour Edo. Toutes les combinaisons période/lentille ne sont pas encore documentées ; un état explicite permet alors de revenir à la sélection de la période. Les fiches sont associées à une période : leur année repère peut différer de celle du curseur au sein de cette période. La carte conserve les frontières actuelles ; elle ne simule pas les changements territoriaux historiques. La période contemporaine s'arrête en 2025.

Les illustrations CSS sont évocatrices et ne sont pas des documents historiques. L'ambiance sonore est synthétique et n'est pas une reconstitution musicale. Les sources de chaque récit sont liées dans l'interface ; une révision éditoriale reste recommandée avant publication éducative.

Fond : Natural Earth (domaine public), via https://github.com/johan/world.geo.json/blob/master/countries/JPN.geo.json. Polices : DM Sans et Libre Caslon Display via Fontsource, licences incluses dans les paquets.
