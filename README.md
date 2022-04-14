# Projet 7 - Groupomania

#### Installation de l'application Groupomania

### Backend

**Node.js**, **Express.js** et **MySQL**
<br />

## Configuation du Backend

- Écrire dans le terminal `cd /backend`.
  <br />
- Tapez `npm install` pour installer toutes les dépendances du backend.
  <br />
- Créer un fichier `.env` dans le dossier `/backend`, entrer le host, les identifiants de votre utilisateur admin et le nom de la base de données que vous souhaitez créer.
  <br />
  Exemple type du ficher voir le fichier `.env.example` :



## Configuration de la Base de données MySQL

- Creer sa base de données sql et lancer les migrations

## Lancer le serveur nodemon

- Écrire dans le terminal `nodemon server` pour lancer le serveur.

### Frontend

**React.js**

## Configuation du Frontend

- Écrire dans le terminal `cd /frontend`.
  <br />
- Tapez `npm install` pour installer toutes les dépendances du frontend.
- et taper la commande npm start.
  <br />
- Créer un fichier `.env` dans le dossier `/frontend`, entrer l'URL du backend comme ceci : NEXT_PUBLIC_API_URL=http://localhost:8080/api

## Lancer le serveur npm start

- Écrire dans le terminal `npm start` pour lancer le serveur une fois le serveur lancer aller sur url d'authentification `localhost:3000/authentification/login`

### Droits Admin

Pour tester les droits d'admin, changez la valeur en 'isAdmin'  en 1 dans la table Users de votre base de données.
