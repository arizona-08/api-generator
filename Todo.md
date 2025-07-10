# Todo Vue.js – Générateur d’API

## 1. Initialisation & Structure du projet

- [x] Générer le projet avec `npm create vue@latest`  
  _Options : Composition API, Vue Router, Pinia, ESLint, Prettier, (TypeScript si bonus)_
- [x] Nettoyer le projet  
  _Supprimer les composants par défaut, vider App.vue, nettoyer le dossier assets_
- [x] Organiser les dossiers  
  _Créer : `src/components`, `src/views`, `src/stores`, `src/assets`, `src/router`_
- [x] Respecter le nommage PascalCase pour les composants

---

## 2. Fonctionnalités principales

### a. Insertion de données

- [ ] Créer un composant pour importer un fichier JSON ou saisir manuellement du JSON  
  _Utiliser v-model, textarea, drag&drop_
- [ ] Valider le JSON et afficher les erreurs à l’utilisateur
- [ ] _(Bonus)_ Gérer l’import de fichiers CSV, XML, YAML

### b. Génération de documentation API

- [ ] Générer dynamiquement une documentation à partir du JSON  et pouvoir la previsualiser et si possible la modifier en live

  _Affichage structuré : endpoints, schémas, exemples_
- [ ] Permettre l’export de la documentation (PDF, copier/coller, etc.)
- [ ] _(Bonus)_ Générer une configuration Postman donc il faudra que l'url de la demo de l'api soit accessible depuis postman
### c. Génération d’un testeur/démo d’API

- [ ] Créer un composant permettant de simuler des requêtes sur l’API générée  
  _Formulaire, affichage de la réponse mockée_
- [ ] _(Bonus)_ Exposer la démo via une URL partageable

---

## 3. Vue Router

- [x] Mettre en place le router  
  _Pages : Accueil, Générateur, Documentation, Testeur_
- [ ] Utiliser `<router-link>` et `<router-view>` pour la navigation
- [ ] Ajouter une page 404 personnalisée

---

## 4. Pinia (gestion d’état)

- [ ] Créer un store pour stocker les données importées, la documentation générée, l’état du testeur
- [ ] Utiliser le store dans les composants (import, affichage, test)

---

## 5. Composants Vue.js

- [ ] Créer des composants réutilisables  
  _Exemples : UploadJson, DocViewer, ApiTester, etc._
- [ ] Utiliser props, emits, v-model sur au moins un composant personnalisé
- [ ] Utiliser des slots si besoin (ex : personnalisation d’un bloc d’affichage)

---

## 6. Directives & Interactivité

- [ ] Utiliser les directives de base dans les composants  
  _v-model, v-bind, v-if, v-for, v-show, v-on_
- [ ] Gérer les événements utilisateurs (click, input, submit, etc.)
- [ ] _(Bonus)_ Créer une directive personnalisée (ex : focus auto sur un champ)

---

## 7. Composables

- [ ] Créer au moins un composable personnalisé  
  _Exemples : useApiDoc, useFileReader_

---

## 8. Qualité visuelle & design

- [ ] Ajouter du style local/global (CSS ou framework type Tailwind/Bulma)
- [ ] _(Bonus)_ Proposer un darkmode
- [ ] Soigner l’ergonomie et la présentation

---

## 9. Qualité du code & bonnes pratiques

- [ ] Indenter et commenter le code
- [ ] Respecter la structure Vue.js (data, methods, props, emits, etc.)
- [ ] Pas de code spaghetti (éviter les fonctions trop longues, bien structurer les composants)

---

## 10. Bonus

- [ ] Utiliser TypeScript
- [ ] Ajouter des tests unitaires (Vitest)
- [ ] Utiliser Nuxt.js

---

**Répartition possible pour 3 devs :**
- Dev 1 : Insertion de données, validation, store Pinia, composables
- Dev 2 : Génération documentation, export, testeur d’API, router
- Dev 3 : Composants réutilisables, design/UX, directives, darkmode, qualité code/tests

