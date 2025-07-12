# Exemples d'utilisation de l'API

Ce document contient des exemples pratiques d'utilisation de l'API du boilerplate Node.js.

## Configuration de base

Assurez-vous que le serveur est démarré :

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## 1. Vérification de l'état du serveur

```bash
curl -X GET http://localhost:3000/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 2. Documentation de l'API

```bash
curl -X GET http://localhost:3000/api
```

## 3. Authentification

### Inscription d'un nouvel utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Password123"
  }'
```

### Récupération du profil utilisateur

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Mise à jour du profil

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

## 4. Gestion des tâches (Todos)

### Créer une nouvelle tâche

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Terminer le projet",
    "description": "Finaliser le développement du boilerplate Node.js",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Terminer le projet",
    "description": "Finaliser le développement du boilerplate Node.js",
    "completed": false,
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Lister toutes les tâches

```bash
# Toutes les tâches (avec pagination)
curl -X GET "http://localhost:3000/api/todos?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tâches non terminées seulement
curl -X GET "http://localhost:3000/api/todos?completed=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tâches de haute priorité
curl -X GET "http://localhost:3000/api/todos?priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Recherche dans les tâches
curl -X GET "http://localhost:3000/api/todos?search=projet" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tri par date de création (décroissant)
curl -X GET "http://localhost:3000/api/todos?sort=createdAt&order=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Récupérer une tâche spécifique

```bash
curl -X GET http://localhost:3000/api/todos/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Mettre à jour une tâche

```bash
# Marquer comme terminée
curl -X PUT http://localhost:3000/api/todos/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'

# Modifier le titre et la priorité
curl -X PUT http://localhost:3000/api/todos/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Projet terminé !",
    "priority": "low"
  }'
```

### Supprimer une tâche

```bash
curl -X DELETE http://localhost:3000/api/todos/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Obtenir les statistiques des tâches

```bash
curl -X GET http://localhost:3000/api/todos/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Todo statistics retrieved successfully",
  "data": {
    "total": 15,
    "completed": 8,
    "pending": 7,
    "overdue": 2,
    "completionRate": 53,
    "priority": {
      "high": 3,
      "medium": 8,
      "low": 4
    }
  }
}
```

## 5. Gestion des erreurs

### Erreur de validation

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
```

**Réponse :**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email address",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

### Erreur d'authentification

```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer invalid_token"
```

**Réponse :**
```json
{
  "success": false,
  "message": "Access denied. Invalid token."
}
```

### Ressource non trouvée

```bash
curl -X GET http://localhost:3000/api/todos/invalid_id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Réponse :**
```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

## 6. Test avec Postman

Vous pouvez importer cette collection Postman pour tester l'API :

```json
{
  "info": {
    "name": "Node.js Boilerplate API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Password123\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

## 7. Variables d'environnement pour les tests

Créez un fichier `.env.test` pour les tests :

```env
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/nodejs-boilerplate-test
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=1h
```

## Notes importantes

1. **Sécurité** : En production, utilisez HTTPS et des secrets JWT forts
2. **Rate Limiting** : L'API limite les requêtes à 100 par 15 minutes par IP
3. **CORS** : Configuré pour accepter toutes les origines en développement
4. **Validation** : Toutes les entrées sont validées côté serveur
5. **Pagination** : Les listes sont paginées avec un maximum de 50 éléments par page

