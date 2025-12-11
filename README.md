# Projet DHTML - Application Web Interactive

## 📋 Description

Ce projet est une **application web interactive** développée en HTML, CSS et JavaScript (DHTML - Dynamic HTML). Elle propose plusieurs fonctionnalités avancées incluant la résolution de systèmes d'équations, la manipulation d'images, des animations et la gestion de données avec visualisation graphique.

**Équipe de développement N2MF - CODE4WARD :**
- **NIEKENA** (3734) - Développeuse Web
- **NAJORO** (3674) - Designer UI/UX  
- **MALALA** (3735) - Développeuse Web
- **FABRICE** (3649) - Chef de projet

---

## 🎯 Fonctionnalités Principales

### 1. **Page d'Accueil (Navigation générale)**
- **Menu de navigation** vers les différentes pages
- **Zone d'affichage dynamique** qui change selon la page sélectionnée
- **Pied de page** avec informations sur l'équipe
- **Interface moderne** avec effets visuels et animations

### 2. **Page Cramer - Résolution de Systèmes d'Équations**
- Résolution de **systèmes de 3 équations à 3 inconnues** par la méthode de Cramer
- **Formulaire interactif** avec 12 champs pour saisir les coefficients (aij et bi)
- **Calcul automatique** des déterminants et des solutions (X1, X2, X3)
- **Affichage détaillé** des résultats avec vérification

### 3. **Page Image - Manipulation Dynamique**
- Affichage d'une image dans un conteneur
- **2 sliders jQuery UI** pour contrôler :
  - La **largeur** de l'image
  - La **hauteur** de l'image
- **Redimensionnement en temps réel** avec aperçu instantané

### 4. **Page Panneau - Publicité Animée**
- **Panneau publicitaire interactif** avec plusieurs couches
- **Animation automatique** avec rotation/transition entre les couches
- **Effets visuels fluides** et design attractif
- **Système de navigation** entre les différents panneaux

### 5. **Page DataTable - Gestion de Données et Graphiques**
- **Tableau de produits** (maximum 10 lignes) avec colonnes :
  - Désignation
  - Quantité
  - Prix unitaire
  - Montant (calculé automatiquement)
- **Calculs automatiques** :
  - Total des quantités
  - Total des montants
  - Prix moyen, minimal et maximal
- **Visualisation graphique** avec Chart.js (graphique en barres ou camembert)
- **Interface soignée** avec Bootstrap

---

## 📁 Structure du Projet

```
projet-dhtml/
│
├── homepage.html               # Page d'accueil principale
│
├── css/
│   ├── style.css               # Styles principaux
│   ├── cramer.css              # Styles page Cramer
│   ├── image.css               # Styles page Image
│   ├── panneau.css             # Styles page Panneau
│   └── datatable.css           # Styles page DataTable
│
├── js/
│   ├── main.js                 # JavaScript principal (navigation)
│   ├── cramer.js               # Logique résolution équations
│   ├── image.js                # Gestion sliders et redimensionnement
│   ├── panneau.js              # Animation panneau publicitaire
│   ├── datatable.js            # Logique tableau et calculs
│   └── login.js                # Gestion connexion
│
├── pages/
│   ├── cramer.html             # Page résolution équations
│   ├── image.html              # Page manipulation images
│   ├── panneau.html            # Page panneau publicitaire
│   ├── datatable.html          # Page tableau avec graphiques
│   └── login.html              # Page de connexion
│
├── images/
│   └── street-art.jpg          # Image de démonstration
│
└── libs/
    ├── jquery-3.6.0.min.js     # Bibliothèque jQuery
    ├── jquery-ui.min.js        # jQuery UI pour les sliders
    ├── jquery-ui.min.css       # Styles jQuery UI
    └── chart.js                # Chart.js pour les graphiques
```

---

## 🚀 Installation et Utilisation

### Prérequis
- **Navigateur web moderne** (Chrome, Firefox, Safari, Edge)
- **Serveur web local** (optionnel mais recommandé)

### Lancement
1. **Téléchargez** ou clonez le projet
2. **Ouvrez** `homepage.html` dans votre navigateur
3. **Naviguez** entre les différentes pages via le menu

### Utilisation des Fonctionnalités

#### Page Cramer
1. Saisissez les **coefficients** du système d'équations dans les champs
2. Cliquez sur **"Résoudre"**
3. Consultez les **résultats** affichés (X1, X2, X3)

#### Page Image
1. Utilisez les **sliders** pour ajuster la largeur et la hauteur
2. Observez le **redimensionnement en temps réel** de l'image

#### Page Panneau
1. Regardez l'**animation automatique** des couches
2. Utilisez les **contrôles** pour naviguer manuellement

#### Page DataTable
1. **Saisissez** les données des produits dans le tableau
2. Observez les **calculs automatiques** des totaux
3. Consultez le **graphique généré** automatiquement

---

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** - Structure des pages
- **CSS3** - Styles et animations
- **JavaScript (ES6)** - Logique applicative
- **jQuery 3.6.0** - Manipulation DOM
- **jQuery UI** - Composants interactifs (sliders)
- **Chart.js** - Visualisation de données
- **Bootstrap** - Framework CSS responsive

### Concepts Techniques
- **DHTML** (Dynamic HTML) - Pages web interactives
- **Méthode de Cramer** - Résolution de systèmes linéaires
- **Manipulation DOM** - Interaction avec les éléments HTML
- **Événements JavaScript** - Gestion des interactions utilisateur
- **Responsive Design** - Adaptation aux différents écrans

---

## 🎨 Caractéristiques Techniques

### Design
- **Interface moderne** avec thème sombre et accents verts
- **Animations fluides** et effets de transition
- **Responsive design** adapté aux mobiles
- **Effets visuels avancés** (glassmorphism, gradients)

### Performance
- **Code optimisé** pour une exécution rapide
- **Gestion d'erreurs** et validation des données
- **Interface utilisateur intuitive**
- **Compatibilité multi-navigateurs**

### Fonctionnalités Avancées
- **Calculs mathématiques complexes** (déterminants, matrices)
- **Manipulation d'images dynamique**
- **Animations CSS et JavaScript**
- **Visualisation de données interactive**

---

## 📖 Documentation des Fonctions

### Fonctions Principales

#### `resoudreSysteme()` - Page Cramer
Résout un système de 3 équations à 3 inconnues en utilisant la méthode de Cramer.
- **Entrée** : Coefficients aij et bi
- **Sortie** : Solutions X1, X2, X3

#### `redimensionnerImage()` - Page Image
Redimensionne dynamiquement une image selon les valeurs des sliders.
- **Paramètres** : Largeur, hauteur
- **Effet** : Modification en temps réel

#### `animerPanneau()` - Page Panneau
Gère l'animation automatique des couches du panneau publicitaire.
- **Fonctionnalité** : Rotation automatique et contrôles manuels

#### `calculerTotaux()` - Page DataTable
Calcule les totaux, moyennes et génère le graphique.
- **Calculs** : Sommes, moyennes, min/max
- **Visualisation** : Graphique Chart.js

---

## 🔧 Maintenance et Développement

### Structure Modulaire
- **Séparation des préoccupations** : HTML, CSS, JS dans des fichiers distincts
- **Code réutilisable** et maintenable
- **Commentaires détaillés** pour faciliter la compréhension

### Bonnes Pratiques
- **Validation des données** avant traitement
- **Gestion d'erreurs** robuste
- **Code lisible** et bien structuré
- **Optimisation des performances**

---

## 📞 Contact et Support

Pour toute question ou suggestion concernant ce projet :

- **Équipe développement** : N2MF - CODE4WARD
- **Année** : 2025

---

## 📄 Licence

Ce projet est développé dans le cadre académique par l'équipe N2MF.

**© 2025 - N2MF Team - CODE4WARD**