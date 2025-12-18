# API Laravel - Documentation

## Configuration

### Prérequis
- PHP >= 7.3
- Composer
- Base de données MySQL/PostgreSQL/SQLite

### Installation

1. Installer les dépendances :
```bash
composer install
```

2. Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

3. Générer la clé d'application :
```bash
php artisan key:generate
```

4. Générer la clé JWT :
```bash
php artisan jwt:secret
```

5. Configurer la base de données dans le fichier `.env` :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Exécuter les migrations :
```bash
php artisan migrate
```

7. Exécuter les seeders pour créer les utilisateurs par défaut :
```bash
php artisan db:seed
```

### Utilisateurs par défaut

Après avoir exécuté les seeders, les utilisateurs suivants sont créés :

- **Admin** :
  - Email: `admin@example.com`
  - Password: `password`
  - Role: `admin`

- **User** :
  - Email: `user@example.com`
  - Password: `password`
  - Role: `user`

## Routes API

### Routes publiques

#### POST `/api/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/api/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Réponse (200):**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Routes protégées (nécessitent un token JWT)

Toutes les routes protégées nécessitent un header `Authorization: Bearer {token}`.

#### GET `/api/user`
Récupère les informations de l'utilisateur authentifié.

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "user": {
    "id": 1,
    "name": "User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### POST `/api/logout`
Déconnexion de l'utilisateur (invalide le token).

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "message": "Successfully logged out"
}
```

#### POST `/api/refresh`
Rafraîchit le token JWT.

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### GET `/api/protected`
Route protégée exemple (accessible à tous les utilisateurs authentifiés).

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "message": "This is a protected route",
  "user": {
    "id": 1,
    "name": "User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Routes Admin (nécessitent un token JWT et le rôle admin)

#### GET `/api/admin`
Route réservée aux administrateurs.

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "message": "This is an admin only route",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Réponse (403) si l'utilisateur n'est pas admin:**
```json
{
  "message": "Unauthorized. Admin access required."
}
```

## Structure du projet

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── AuthController.php      # Contrôleur d'authentification
│   │   └── Middleware/
│   │       └── AdminMiddleware.php    # Middleware pour vérifier le rôle admin
│   └── Models/
│       └── User.php                    # Modèle User avec support JWT
├── config/
│   ├── auth.php                        # Configuration de l'authentification
│   ├── cors.php                        # Configuration CORS
│   └── jwt.php                         # Configuration JWT
├── database/
│   ├── migrations/
│   │   ├── 2014_10_12_000000_create_users_table.php
│   │   └── 2025_12_17_180149_add_role_to_users_table.php
│   └── seeders/
│       └── DatabaseSeeder.php         # Seeder pour créer les utilisateurs par défaut
└── routes/
    └── api.php                         # Routes API
```

## Authentification JWT

L'API utilise JWT (JSON Web Tokens) pour l'authentification. 

### Comment utiliser

1. **Inscription/Connexion** : Utilisez les routes `/api/register` ou `/api/login` pour obtenir un token.

2. **Requêtes authentifiées** : Incluez le token dans le header `Authorization` :
   ```
   Authorization: Bearer {votre_token}
   ```

3. **Rafraîchissement** : Utilisez `/api/refresh` pour obtenir un nouveau token avant expiration.

### Configuration JWT

Les paramètres JWT peuvent être configurés dans le fichier `.env` :
- `JWT_SECRET` : Clé secrète pour signer les tokens (générée avec `php artisan jwt:secret`)
- `JWT_TTL` : Durée de vie du token en minutes (défaut: 60)
- `JWT_REFRESH_TTL` : Durée de vie du refresh token en minutes (défaut: 20160)

## Middlewares

- `auth:api` : Vérifie que l'utilisateur est authentifié avec un token JWT valide
- `admin` : Vérifie que l'utilisateur est authentifié ET a le rôle `admin`

## Gestion des erreurs

L'API retourne des codes HTTP appropriés :
- `200` : Succès
- `201` : Créé avec succès
- `401` : Non authentifié
- `403` : Accès refusé (pas les permissions)
- `404` : Ressource non trouvée
- `422` : Erreur de validation
- `500` : Erreur serveur

Les réponses d'erreur suivent ce format :
```json
{
  "message": "Description de l'erreur",
  "errors": {
    "field": ["Message d'erreur"]
  }
}
```

