# Node.js Boilerplate

Un boilerplate moderne Node.js avec Express, MongoDB, authentification JWT et TypeScript pour démarrer rapidement vos projets d'API.

## 🚀 Fonctionnalités

- **TypeScript** - Support complet avec configuration optimisée
- **Express.js** - Framework web rapide et minimaliste
- **MongoDB** - Base de données NoSQL avec Mongoose ODM
- **Authentification JWT** - Système d'authentification sécurisé
- **API CRUD** - Exemple complet avec gestion des tâches (todos)
- **Validation** - Validation des données avec express-validator
- **Sécurité** - Helmet, CORS, rate limiting
- **Logging** - Morgan pour les logs HTTP
- **Structure modulaire** - Architecture claire et maintenable
- **Variables d'environnement** - Configuration flexible avec dotenv
- **Gestion d'erreurs** - Gestionnaire d'erreurs global
- **Pagination** - Support de la pagination pour les listes
- **Recherche et filtres** - Fonctionnalités de recherche avancées

## 📋 Prérequis

- Node.js (version 18.0.0 ou supérieure)
- npm (version 8.0.0 ou supérieure)
- MongoDB (local ou cloud)

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone [<votre-repo>](https://github.com/feyroozecode/node-base-app.git)
   cd nodejs-boilerplate
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Modifier le fichier `.env` avec vos propres valeurs :
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/nodejs-boilerplate
   JWT_SECRET=votre-clé-secrète-très-sécurisée
   JWT_EXPIRES_IN=7d
   ```

4. **Démarrer MongoDB**
   ```bash
   # Si MongoDB est installé localement
   mongod
   
   # Ou utiliser Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🚦 Utilisation

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Scripts disponibles
- `npm run dev` - Démarrage en mode développement avec rechargement automatique
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en mode production
- `npm run clean` - Nettoyage du dossier dist

## 📚 Documentation API

### Endpoints d'authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### Profil utilisateur
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Mise à jour du profil
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

### Endpoints des tâches

#### Créer une tâche
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Ma nouvelle tâche",
  "description": "Description de la tâche",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Lister les tâches
```http
GET /api/todos?page=1&limit=10&completed=false&priority=high&search=important
Authorization: Bearer <token>
```

#### Obtenir une tâche
```http
GET /api/todos/:id
Authorization: Bearer <token>
```

#### Mettre à jour une tâche
```http
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tâche mise à jour",
  "completed": true
}
```

#### Supprimer une tâche
```http
DELETE /api/todos/:id
Authorization: Bearer <token>
```

#### Statistiques des tâches
```http
GET /api/todos/stats
Authorization: Bearer <token>
```

## 🏗️ Structure du projet

```
nodejs-boilerplate/
├── src/
│   ├── config/
│   │   ├── index.ts          # Configuration principale
│   │   └── database.ts       # Configuration MongoDB
│   ├── controllers/
│   │   ├── authController.ts # Contrôleur d'authentification
│   │   └── todoController.ts # Contrôleur des tâches
│   ├── middleware/
│   │   ├── auth.ts          # Middleware d'authentification
│   │   └── validators.ts    # Validateurs de requêtes
│   ├── models/
│   │   ├── User.ts          # Modèle utilisateur
│   │   └── Todo.ts          # Modèle tâche
│   ├── routes/
│   │   ├── authRoutes.ts    # Routes d'authentification
│   │   └── todoRoutes.ts    # Routes des tâches
│   ├── types/
│   │   └── index.ts         # Types TypeScript
│   ├── utils/               # Utilitaires
│   ├── app.ts              # Configuration Express
│   └── server.ts           # Point d'entrée
├── tests/                  # Tests (à implémenter)
├── .env.example           # Exemple de variables d'environnement
├── tsconfig.json          # Configuration TypeScript
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🔒 Sécurité

Ce boilerplate inclut plusieurs mesures de sécurité :

- **Helmet** - Protection contre les vulnérabilités web communes
- **CORS** - Configuration des origines autorisées
- **Rate Limiting** - Limitation du nombre de requêtes par IP
- **JWT** - Tokens sécurisés pour l'authentification
- **Validation** - Validation stricte des données d'entrée
- **Hachage des mots de passe** - Utilisation de bcrypt avec salt

## 🚀 Déploiement

### Variables d'environnement de production

Assurez-vous de définir ces variables en production :

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://votre-serveur-mongo/votre-db
JWT_SECRET=une-clé-très-sécurisée-et-longue
CORS_ORIGIN=https://votre-frontend.com
```

### Docker (optionnel)

Créez un `Dockerfile` :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
```

## 🧪 Tests

Les tests ne sont pas encore implémentés dans ce boilerplate. Vous pouvez ajouter :

- **Jest** pour les tests unitaires
- **Supertest** pour les tests d'intégration
- **MongoDB Memory Server** pour les tests de base de données

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes ou avez des questions :

1. Vérifiez que MongoDB est en cours d'exécution
2. Vérifiez vos variables d'environnement
3. Consultez les logs de l'application
4. Ouvrez une issue sur GitHub

## 🔄 Prochaines étapes

Pour étendre ce boilerplate, vous pourriez ajouter :

- Tests automatisés
- Documentation API avec Swagger
- Upload de fichiers
- Envoi d'emails
- Cache avec Redis
- Websockets
- Microservices
- CI/CD avec GitHub Actions

---

# sms-pro-backend
