# Projet Angular

Application Angular réalisée dans le cadre du module Framework JS.

## Présentation du projet

Ce projet est une application de gestion de tâches réalisée avec Angular. Elle permet de créer une tâche avec un titre, une description et une échéance optionnelle.

Depuis la liste, il est possible de :

- afficher les tâches et leur statut (`À faire` ou `Fait`) ;
- modifier une tâche ;
- supprimer une tâche après confirmation ;
- cocher ou décocher une tâche ;
- rechercher une tâche par titre ou description ;
- filtrer les tâches par statut ;
- trier les tâches par échéance puis par titre.

Les tâches sont enregistrées dans le `localStorage` du navigateur. Elles restent donc disponibles après un rechargement de la page.

L'application possède deux vues accessibles sans rechargement :

- `/` : liste, formulaire et contrôles de recherche ;
- `/stats` : total, tâches faites, tâches à faire et pourcentage de progression.

## Prérequis d'installation

- Node.js installé
- npm installé
- Angular CLI 21.2.26, disponible via les dépendances du projet

## Installation complète depuis Git

### 1. Cloner le dépôt

Depuis le dossier dans lequel le projet doit être téléchargé :

```bash
git clone https://github.com/Yannickthomas0602/To_Do_List_Angular.git
cd To_Do_List_Angular/tp2
```

### 2. Installer les dépendances Angular

```bash
npm install
```

### 3. Installer Angular CLI globalement

Cette étape permet d'utiliser directement la commande `ng` :

```bash
npm install -g @angular/cli@21.2.26
```

Vérifier les versions installées :

```bash
node --version
npm --version
ng version
```

### 4. Lancer l'application

```bash
ng serve
```

Si Angular CLI n'est pas installé globalement, utiliser la version locale :

```bash
npx ng serve
```

Puis ouvrir [http://localhost:4200/](http://localhost:4200/).

Le serveur recharge automatiquement l'application après une modification des fichiers.

## Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm start` | Lance le serveur Angular de développement. |
| `npm run build` | Compile l'application dans `dist/`. |
| `npm run watch` | Recompile automatiquement après chaque modification. |
| `npm test` | Lance les tests unitaires avec Vitest. |
| `npm run ng -- generate component nom` | Génère un composant Angular. |
| `npm run serve:ssr:tp1` | Lance la version SSR déjà compilée. |

## Structure du projet

```text
Angular/
├── README.md
└── tp2/
    ├── package.json
    ├── angular.json
    ├── public/
    └── src/
        ├── main.ts
        └── app/
```

Les images et autres ressources statiques sont placées dans `tp2/public/`.

## Build de production

Pour générer les fichiers de production :

```bash
cd tp2
npm run build
```

Les fichiers générés se trouvent dans `tp2/dist/`.

## Tests

Pour lancer les tests unitaires :

```bash
cd tp2
npm test
```

## Commandes Angular utiles

```bash
npm run ng -- generate component nom-composant
npm run ng -- generate service nom-service
npm run ng -- serve
```
