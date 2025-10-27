# 2XAGRESSIF – Boutique de parfums

## Démarrage rapide

- Backend
  - Copier `backend/.env.example` vers `backend/.env` et ajuster si besoin.
  - Installer et lancer:
    ```bash
    npm install --prefix backend
    npm run dev --prefix backend
    ```
  - API: http://localhost:4000/api

- Frontend
  - Installer et lancer:
    ```bash
    npm install --prefix frontend
    npm run dev --prefix frontend
    ```
  - App: http://localhost:5173
  - Config API via `VITE_API_URL` si nécessaire.

## Identifiants par défaut
- username: `username2xAGGRESSIF`
- password: `password provisoire`

Changez-les en production et mettez un `JWT_SECRET` fort.

## Endpoints principaux
- `POST /api/login`
- `GET /api/parfums`
- `GET /api/parfums/:id`
- `POST /api/parfums` (auth + upload image)
- `PUT /api/parfums/:id` (auth + upload image)
- `DELETE /api/parfums/:id` (auth)

## Uploads images
- Stockées dans `backend/uploads/` et servies via `/uploads/<filename>`.
- Sur le frontend, l'URL d'image reçue est relative (`uploads/...`) et est préfixée automatiquement par le site (le composant utilise `/<image>` quand backend et front sont sur la même machine). En déploiement, configurez `VITE_API_URL` et servez les images depuis l'API.
