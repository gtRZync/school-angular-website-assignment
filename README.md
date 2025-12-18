# SwiftBasket 🛍️

SwiftBasket est une application e-commerce moderne pour la vente de chaussures, construite avec une architecture client/serveur utilisant Angular et Laravel.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Authentification](#authentification)
- [Système CRUD Admin](#système-crud-admin)

## 🎯 Aperçu

SwiftBasket est une plateforme e-commerce complète permettant aux utilisateurs de :
- Parcourir et rechercher des chaussures par catégorie
- Ajouter des produits au panier
- Gérer leur panier
- S'authentifier avec JWT
- Administrer les produits (pour les admins)

## ✨ Fonctionnalités

### Utilisateur
- ✅ Authentification JWT (login/register)
- ✅ Parcourir les produits (chaussures)
- ✅ Filtrer par catégorie (Running, Casual, Basketball)
- ✅ Ajouter des produits au panier
- ✅ Gérer le panier (ajouter, modifier quantité, supprimer)
- ✅ Calcul automatique du total du panier
- ✅ Interface responsive avec Bootstrap
- ✅ Thème clair/sombre

### Administrateur
- ✅ CRUD complet pour les produits
- ✅ Créer de nouveaux produits
- ✅ Modifier les produits existants
- ✅ Supprimer des produits
- ✅ Interface d'administration sécurisée
- ✅ Routes protégées par guard admin

## 🏗️ Architecture

Le projet suit une architecture client/serveur avec :

- **Frontend (Angular)** : Interface utilisateur avec services, guards, interceptors
- **Backend (Laravel)** : API REST avec authentification JWT
- **Base de données** : MySQL/PostgreSQL/SQLite

```
┌─────────────┐         HTTP/REST         ┌─────────────┐
│   Angular   │ ◄──────────────────────► │   Laravel   │
│  Frontend   │      (JWT Auth)          │    API      │
└─────────────┘                           └─────────────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  Database   │
                                            │  (MySQL)     │
                                            └─────────────┘
```

## 🛠️ Technologies

### Frontend
- **Angular** 17+ (Standalone components)
- **Bootstrap** 5
- **RxJS** (Observables)
- **TypeScript**

### Backend
- **Laravel** 8
- **PHP** 7.3+
- **JWT Auth** (tymon/jwt-auth)
- **MySQL/PostgreSQL/SQLite**

## 📦 Prérequis

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **PHP** >= 7.3
- **Composer**
- **MySQL** >= 5.7 ou **PostgreSQL** >= 10 ou **SQLite** >= 3

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd AngularProject
```

### 2. Backend (Laravel)

```bash
cd backend

# Installer les dépendances
composer install

# Copier le fichier .env
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Générer la clé JWT
php artisan jwt:secret

# Configurer la base de données dans .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=swiftbasket
# DB_USERNAME=root
# DB_PASSWORD=

# Exécuter les migrations
php artisan migrate

# Exécuter les seeders (créer utilisateurs et produits)
php artisan db:seed

# Démarrer le serveur
php artisan serve
```

Le serveur backend sera accessible sur `http://localhost:8000`

### 3. Frontend (Angular)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
# ou
ng serve
```

Le frontend sera accessible sur `http://localhost:4200`

## ⚙️ Configuration

### Backend (.env)

```env
APP_NAME=SwiftBasket
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swiftbasket
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your-jwt-secret-key
JWT_TTL=60
```

### Frontend (src/app/config/api.config.ts)

```typescript
export const API_CONFIG = {
  baseUrl: 'http://localhost:8000/api'
};
```

## 📖 Utilisation

### Comptes par défaut

Après avoir exécuté les seeders, vous pouvez vous connecter avec :

**Admin :**
- Email: `admin@example.com`
- Password: `password`
- Accès: Administration complète

**Utilisateur :**
- Email: `user@example.com`
- Password: `password`
- Accès: Achat de produits

### Parcourir les produits

1. Accédez à `/products`
2. Parcourez les chaussures disponibles
3. Filtrez par catégorie si nécessaire
4. Ajoutez des produits au panier

### Gérer le panier

1. Accédez à `/cart`
2. Modifiez les quantités
3. Supprimez des articles
4. Vérifiez le total

### Administration (Admin uniquement)

1. Connectez-vous avec un compte admin
2. Cliquez sur le bouton "Admin" dans le header
3. Accédez à `/admin/products`
4. Créez, modifiez ou supprimez des produits

## 📁 Structure du projet

```
AngularProject/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # Contrôleurs API
│   │   │   └── Middleware/   # Middlewares (Auth, Admin)
│   │   └── Models/          # Modèles Eloquent
│   ├── database/
│   │   ├── migrations/      # Migrations de base de données
│   │   └── seeders/        # Seeders (Users, Products)
│   ├── routes/
│   │   └── api.php         # Routes API
│   └── config/             # Configuration
│
└── frontend/                # Application Angular
    └── src/
        ├── app/
        │   ├── components/  # Composants Angular
        │   │   ├── admin/    # Composants admin
        │   │   ├── cart/     # Panier
        │   │   ├── products/ # Produits
        │   │   └── ...
        │   ├── services/     # Services Angular
        │   ├── config/       # Configuration
        │   └── app.routes.ts # Routes Angular
        └── ...
```

## 📡 API Documentation

### Endpoints publics

- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détails d'un produit
- `GET /api/products/categories` - Liste des catégories
- `GET /api/products/category/{category}` - Produits par catégorie

### Endpoints protégés (authentification requise)

- `GET /api/user` - Informations utilisateur
- `POST /api/logout` - Déconnexion
- `POST /api/refresh` - Rafraîchir le token
- `GET /api/cart` - Panier de l'utilisateur
- `POST /api/cart/add` - Ajouter au panier
- `PUT /api/cart/{id}` - Modifier quantité
- `DELETE /api/cart/{id}` - Supprimer du panier
- `DELETE /api/cart` - Vider le panier
- `GET /api/cart/total` - Total du panier

### Endpoints admin (admin uniquement)

- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

Pour plus de détails, consultez [backend/API_README.md](backend/API_README.md)

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification.

### Flux d'authentification

1. **Inscription/Connexion** : L'utilisateur s'inscrit ou se connecte
2. **Token JWT** : Le serveur retourne un token JWT
3. **Stockage** : Le token est stocké dans le localStorage
4. **Requêtes** : Le token est automatiquement ajouté dans le header `Authorization: Bearer {token}`
5. **Validation** : Le serveur valide le token à chaque requête protégée

### Guards Angular

- **authGuard** : Protège les routes nécessitant une authentification
- **adminGuard** : Protège les routes admin (vérifie le rôle dans le token JWT)

### Interceptor JWT

Toutes les requêtes HTTP incluent automatiquement le token JWT dans le header si l'utilisateur est authentifié.

## 🎛️ Système CRUD Admin

Le système CRUD permet aux administrateurs de gérer les produits.

### Fonctionnalités

- ✅ **Create** : Créer de nouveaux produits
- ✅ **Read** : Voir la liste de tous les produits
- ✅ **Update** : Modifier les produits existants
- ✅ **Delete** : Supprimer des produits

### Accès

1. Se connecter avec un compte admin
2. Cliquer sur le bouton "Admin" dans le header
3. Accéder à `/admin/products`

### Interface

- Tableau avec tous les produits
- Formulaire pour créer/modifier
- Validation des champs
- Messages de succès/erreur
- Confirmation avant suppression

### Champs du produit

- **Title** : Titre du produit (requis, max 255 caractères)
- **Price** : Prix (requis, >= 0)
- **Category** : Catégorie (Running, Casual, Basketball)
- **Description** : Description du produit (optionnel)
- **Image** : URL de l'image (requis)

## 🧪 Tests

### Backend

```bash
cd backend
php artisan test
```

### Frontend

```bash
cd frontend
npm test
```

## 🐛 Dépannage

### Erreur CORS

Assurez-vous que CORS est configuré dans `backend/config/cors.php` :

```php
'allowed_origins' => ['*'],
'supports_credentials' => true,
```

### Erreur JWT

Vérifiez que la clé JWT est générée :

```bash
php artisan jwt:secret
```

### Erreur de connexion à la base de données

Vérifiez les paramètres dans `.env` et que la base de données existe.

## 📝 License

MIT License - Utilisez, modifiez, distribuez librement.

---

**SwiftBasket** - Votre destination pour les meilleures chaussures ! 👟
