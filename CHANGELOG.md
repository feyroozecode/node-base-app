# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Ajouté
- Configuration initiale du projet avec TypeScript
- Serveur Express.js avec middleware de sécurité
- Connexion MongoDB avec Mongoose
- Système d'authentification JWT complet
- API CRUD pour la gestion des tâches (todos)
- Validation des données avec express-validator
- Gestion d'erreurs globale
- Support de la pagination et des filtres
- Configuration des variables d'environnement
- Documentation complète avec exemples d'API
- Scripts de développement et de production
- Structure de projet modulaire et maintenable

### Sécurité
- Protection Helmet contre les vulnérabilités web
- Configuration CORS sécurisée
- Rate limiting pour prévenir les abus
- Hachage sécurisé des mots de passe avec bcrypt
- Validation stricte des entrées utilisateur

### Fonctionnalités
- Inscription et connexion des utilisateurs
- Gestion du profil utilisateur
- CRUD complet pour les tâches
- Recherche et filtrage des tâches
- Statistiques des tâches
- Support de la pagination
- Gestion des priorités et dates d'échéance
- API RESTful avec réponses JSON standardisées

## [Non publié]

### À venir
- Tests unitaires et d'intégration
- Documentation API avec Swagger
- Support Docker
- CI/CD avec GitHub Actions
- Upload de fichiers
- Notifications par email
- Cache avec Redis
- Websockets pour les mises à jour en temps réel

