# Tabi — Le Japon à travers le temps

Atlas historique interactif en français : **200 récits**, quinze périodes, six lentilles et une carte politique contextualisée de la préhistoire (repère vers 38 000 av. J.-C.) à 2025. JavaScript, SVG et Vite.

## Essayer

Site GitHub Pages : https://omathurin.github.io/japan-map/ (nécessite l’activation de Pages sur la branche `gh-pages`, dossier `/`).

Les 200 récits disposent d’une illustration documentaire ou de contexte, avec leur auteur, leur licence et une fiche source.

Pour jouer sans installation, téléchargez `Tabi.html` et ouvrez-le dans votre navigateur. Ce fichier autonome embarque les récits, les contours et les polices. Il fonctionne hors ligne ; les liens vers les sources nécessitent Internet.

## Explorer

- Faites glisser la frise ou utilisez la lecture automatique. La fiche par défaut suit le dernier récit daté avant votre année dans la sélection de l’époque, ou le premier si tous sont postérieurs.
- Chaque combinaison époque/lentille contient au moins un récit : politique, guerres, religion, culture, arts, cuisine.
- Les points rouges ouvrent les récits ; les losanges repèrent des sièges de pouvoir. Les points proches sont légèrement décalés avec un trait de rappel pour rester accessibles.
- Cliquez sur une province/préfecture pour lire son nom et son contexte, ou utilisez Tab puis Entrée/Espace.
- Le menu « Un tournant politique » rejoint directement un changement de régime. La couche politique peut être masquée.
- Le carnet historique affiche les récits de la sélection. La recherche porte sur les 200 récits, toutes époques et lentilles confondues ; ouvrir un résultat rejoint sa période et sa lentille.
- Zoom, recentrage, découverte aléatoire et ambiance synthétique optionnelle sont disponibles. Interface mobile et tablette.

## Ce que montre la carte politique

La carte distingue les circuits anciens, la trame provinciale, les centres de pouvoir et les préfectures modernes. Les textes changent notamment aux repères de Kamakura, des deux cours, de Sengoku, de l’unification, d’Edo, de Meiji et de l’occupation. Un encart des Ryūkyū, à une autre échelle, suit l’évolution du royaume et du statut d’Okinawa.

**Le fond ancien est une référence datée de 1868**, dérivée d’un jeu de données CC0 d’Asukana : 68 provinces traditionnelles et Ezo. Pour les dates de 710 à 1867, ce fond sert à se repérer ; il ne prétend pas restituer les limites exactes de chaque année, les frontières anciennes du Nord, les shōen, les possessions des clans ni les domaines morcelés des daimyō. Les couleurs provinciales ne représentent pas les possessions des clans. La transition préfectorale de 1871–1888 est expliquée sans en inventer les découpages successifs.

À partir de 1889, les 47 divisions sont montrées avec des contours contemporains simplifiés, et non leurs limites historiques exactes. La distinction de l’administration américaine d’Okinawa est explicitée pour 1945–1972. Les situations d’Amami et d’Ogasawara sont mentionnées sans être délimitées à cette échelle. L’empire colonial et les territoires lointains ne sont pas couverts par cette vue de l’archipel principal et des Ryūkyū.

La méthode, les licences et les limites sont détaillées dans [public/data/SOURCES.md](public/data/SOURCES.md). Ne pas présenter cette carte comme une reconstitution annuelle des domaines féodaux.

## Développement

Prérequis : Node.js 22.12+ (validé avec Node.js 24) et npm.

```sh
cd /workspace/japan-map
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173
```

```sh
npm test
npm run build
npm run preview -- --port 4173
```

`npm run build` produit `dist/` (site Vite, chemins relatifs adaptés à GitHub Pages) et régénère `Tabi.html`. `npm run build:standalone` régénère uniquement le fichier autonome. L’application ne requiert ni clé API, ni compte, ni service externe à l’exécution.

Tests navigateur :

```sh
npx playwright install chromium
npm run test:e2e
```

Pour utiliser un Chromium déjà installé :

```sh
TABI_CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
```

Les tests vérifient la présence de références pour les 200 récits, au moins cinq faits culturels par époque, puis les 90 combinaisons époque/thème, avec une sélection vide explicitée lorsque les récits ne sont pas documentés, les changements politiques, la sélection au clavier et à la souris des territoires, la recherche transversale, les fiches par défaut, la lecture automatique, le zoom, le son, les formats mobile/tablette et le fichier autonome sans réseau.

## Ajouter des contenus

Les 55 récits antérieurs à 710 et les cinq nouvelles périodes sont dans `src/early-stories.js` ; leurs identifiants commencent à 145 pour conserver ceux des récits existants. Les récits initiaux sont dans `src/data.js`, les 90 ajouts historiques dans `src/more-stories.js` et les 40 nouveaux faits culturels dans `src/cultural-stories.js`. Les articles de référence des 105 récits précédents sont associés par identifiant dans `src/references.js`. Chaque récit possède une date repère, un lieu, un thème, un texte original et une source de contexte. Les repères politiques sont dans `src/politics.js` ; leur affichage est dans `src/political-map.js`. Après modification, relancez les tests et la compilation pour actualiser aussi le fichier autonome.

Les dates approximatives sont signalées dans les textes. Une fiche associée à une époque peut être postérieure à l’année du curseur : l’interface le précise. Le découpage annuel des ères impériales est simplifié ; notamment, les transitions de 1912, 1926 et 1989 se produisent en cours d’année. La vue contemporaine s’arrête en 2025.

Les résumés forment une introduction éditoriale, non une encyclopédie exhaustive. Chaque fiche et chaque carte du carnet proposent un article Wikipédia consacré au sujet, avec un titre en français et la langue de l’article (anglais). Les liens d’origine sont conservés comme références de contexte supplémentaires lorsqu’ils diffèrent. Les articles servent à approfondir ; ils ne sont pas présentés comme une preuve de chaque détail du résumé. Les illustrations CSS sont évocatrices et les musiques documentaires sont contextualisées et datées, sans prétendre reconstituer chaque année. Une révision éditoriale spécialisée reste recommandée pour un usage éducatif publié.

## Publication GitHub Pages

La branche `gh-pages` sert le contenu de `dist/`, avec `.nojekyll`. Les images sont chargées séparément et les miniatures du carnet sont différées pour éviter de télécharger le fichier autonome entier au démarrage. Après une modification, reconstruisez et testez avant de mettre à jour cette branche sans écraser les autres fichiers. Les sources et le téléchargement autonome `Tabi.html` restent sur `main`. L’activation initiale de Pages s’effectue dans les paramètres du dépôt ; une mise à jour de branche ne prouve pas à elle seule que le déploiement public est terminé.

## Illustrations et crédits

Les **200 récits** sont illustrés, avec **182 fichiers uniques** conservés dans `public/images/`. Un bouton « i » discret sur chaque image donne accès à l’auteur, la licence et la fiche source en surimpression. Sur la fiche principale, les crédits apparaissent au survol de l’image ; dans le carnet, au survol du bouton « i » pour garder la vignette cliquable. Ils sont aussi accessibles à la prise de focus au clavier ou au clic/toucher. Échap, la croix et un clic à l’extérieur permettent de fermer le panneau. Ces informations ne prennent aucune place sous les images, dans les fiches comme dans le carnet. Les dates du document et les notices de contexte distinguent les vues contemporaines, les copies anciennes, les représentations postérieures et les documents d’époque. Les illustrations ne sont pas systématiquement des représentations directes de l’événement à la date du curseur.

Les métadonnées de droits proviennent de Wikimedia Commons : domaine public indiqué par la source, CC0, CC BY ou CC BY-SA. Les images non libres ou de droits non établis ne sont pas importées. Les licences des images sont indépendantes de celle du code. L’inventaire des crédits par fichier est disponible dans [public/images/CREDITS.md](public/images/CREDITS.md).

`npm run images:research` recherche les illustrations des articles de référence, vérifie les notices Commons et télécharge les miniatures acceptées. Les choix éditoriaux sont dans `scripts/image-selections.json`. Les fichiers déjà vérifiés sont réutilisés ; les requêtes respectent un espacement et un délai en cas de limitation de débit. L’accès réseau aux APIs est nécessaire uniquement pour cette recherche, pas pour consulter l’application.

La version autonome embarque toutes les images et leurs crédits. Détails de la méthode et des conditions de réutilisation : [public/data/IMAGE-SOURCES.md](public/data/IMAGE-SOURCES.md). Journal par récit : [public/data/image-research.json](public/data/image-research.json).

## Musiques et ambiance

Cinq vrais enregistrements de Wikimedia Commons remplacent les sons synthétiques : gagaku de cour (Nara à Momoyama, interprétation de 2023), Sakura Sakura au koto (Edo, enregistrement de 2006), Kōjō no Tsuki de Rentarō Taki, composé en 1901 (Meiji, interprétation de 1997), Shika no Tōne au shakuhachi par Araki Kodō III (Taishō/Shōwa, archive datée entre 1925 et 1937) et shamisen avec chant lors d’un festival à Tokyo (contemporain, 2006). Ce sont des choix documentaires illustrant des traditions : un morceau ne représente pas toute la musique d’une époque.

Le son se lance uniquement au clic, à 25 % du volume, et suit les changements d’époque. Il continue dans une même famille musicale. Le bouton « i » près du contrôle ouvre un panneau compact avec titre, volume, contexte, date réelle de l’enregistrement, crédit, licence et liens Commons/Wikipédia. Échap ou un clic ailleurs le referment. Les courts documents tournent en boucle ; le fichier d’archive au shakuhachi dure environ six minutes. Aucun fichier sonore n’est téléchargé avant l’activation.

Les MP3 locaux, leurs licences individuelles et les modifications sont inventoriés dans [public/audio/CREDITS.md](public/audio/CREDITS.md), avec les métadonnées sources dans [public/audio/research.json](public/audio/research.json). La version autonome embarque aussi les cinq pistes et fonctionne hors connexion. Le volume du document Meiji, très faible dans la source, a été relevé de 9 dB ; les autres fichiers sont uniquement transcodés (son extrait de la vidéo pour le gagaku).

Pour actualiser ces sources uniquement : `node scripts/research-music.mjs` (Node, réseau Commons et ffmpeg/ffprobe requis). La sélection éditoriale est dans `scripts/music-selections.json`. Le script vérifie les licences de la notice Commons et l’intégrité SHA-1 des originaux, transcode en MP3 à 96 kbit/s, puis conserve les crédits et l’empreinte SHA-256 des fichiers livrés. Aucun outil de transcodage ni réseau externe n’est nécessaire pour consulter le site.

## Avant 710 : préhistoire et premiers États

La sélection comprend désormais **55 récits supplémentaires** : Paléolithique, Jōmon, Yayoi, Kofun et Asuka. Parmi eux : Iwajuku, Minatogawa, les hameçons de Sakitari, les poteries et dogū, les villages Jōmon, la riziculture, Himiko et Yamatai, le sceau de Na, les tumulus et haniwa, l’introduction du bouddhisme, les dix-sept articles attribués à Shōtoku, Taika, Baekgang, Jinshin, Fujiwara-kyō et le code de Taihō.

Les dates archéologiques sont des repères approximatifs, signalés par « vers ». Les seuils pédagogiques de la frise sont −38 000, −14 000, −900, 250, 592 et 710. Ils ne prétendent pas fixer des ruptures simultanées dans tout l’archipel : les débuts de Yayoi et d’Asuka varient selon les sources, et Jōmon se prolonge plus tard dans certaines régions. Le début de la frise est un repère du Paléolithique supérieur, pas une date certaine d’arrivée des premiers humains. Les datations 538/552 du bouddhisme, la localisation de Yamatai et les attributions traditionnelles des tombeaux sont qualifiées dans les textes.

La frise réserve une section de longueur égale à chacune des quinze périodes. Cette échelle adaptée garde les siècles récents accessibles. Le champ « Aller à une année » permet une saisie exacte ; un nombre négatif désigne une année avant J.-C., sans année zéro. Les boutons des périodes défilent horizontalement sur les petits écrans.

Avant 710, aucun contour provincial ou préfectoral n’est superposé à la carte : seuls les sites, les récits et certains sièges de cour sont localisés sur les rivages actuels. Les frontières et les côtes préhistoriques ne sont pas reconstruites. Les sujets non documentés dans la sélection restent vides, sans bataille ou croyance inventée pour remplir une lentille. Aucun enregistrement musical n’est attribué à ces nouvelles périodes ; l’ambiance est suspendue puis reprend au retour aux périodes documentées si elle avait été activée.

Les 55 nouveaux récits disposent chacun d’une illustration libre, avec des légendes distinguant site actuel, reconstitution, copie, œuvre postérieure et document de contexte. Le journal des références est dans [public/data/early-history-research.json](public/data/early-history-research.json). Les références externes servent à approfondir ; les résumés sont rédigés pour l’application et ne recopient pas les articles.
