# BTIS

Site institutionnel bilingue (français / anglais) de Bangba Tinbo Intelligence et Stratégies.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## MySQL (Hostinger / phpMyAdmin)

La formule Hostinger n’offre pas PostgreSQL. Les demandes des formulaires Contact et Rendez-vous sont enregistrées en MySQL.

1. Créez une base et un utilisateur dans phpMyAdmin / hPanel.
2. Importez [`sql/schema.sql`](sql/schema.sql).
3. Renseignez `.env.local` (en local) ou les variables d’environnement Node.js sur Hostinger :

```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
```

Depuis l’application hébergée, utiliser `127.0.0.1` (pas l’hôte distant `srv….hstgr.io`).

## Contact

- Email : tinbobangba@gmail.com
- Téléphone : +33 7 55 82 16 84

Deux parcours distincts :

- `/contact` : message écrit
- `/rendez-vous` : demande d’échange (format, période, objectif)

L’envoi SMTP est optionnel (`CONTACT_TO` par défaut : tinbobangba@gmail.com).

Les articles vivent dans `content/insights`. Les opérations publiables vivent dans `content/operations`.

## Déploiement Hostinger (GitHub → Node.js)

Le site est une application **Next.js** : il faut un site **Node.js**, pas un hébergement PHP / `public_html` seul.

### 1. Créer le site Node.js

1. Dans hPanel : **Sites web** → **Ajouter un site** → **Node.js**.
2. Choisissez le domaine (ou un sous-domaine).
3. Node.js **20** ou **22**.
4. Type d’application : **Next.js**.

### 2. Relier GitHub

1. Dans le site : **Avancé** → **Git**, ou à la création : **Importer un dépôt Git**.
2. Autorisez GitHub et sélectionnez le dépôt BTIS.
3. Branche : `main` (ou celle que vous utilisez).
4. Activez le déploiement automatique sur chaque push.

### 3. Réglages de build

| Champ | Valeur |
|---|---|
| Framework | Next.js |
| Node.js | 20 ou 22 |
| Répertoire racine | `.` (là où se trouve `package.json`) |
| Script de build | `build` (`npm run build`) |
| Commande de démarrage | `npm start` (`next start`) |

Hostinger fournit le port (`PORT`) : Next.js l’utilise automatiquement.

### 4. Base MySQL

1. hPanel → **Bases de données** → créer base + utilisateur.
2. phpMyAdmin → importer `sql/schema.sql`.
3. Noter le nom de la base, l’utilisateur et le mot de passe.

### 5. Variables d’environnement

Dans le site Node.js → **Variables d’environnement**, enregistrer **tout le jeu** (remplacement intégral) :

```
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
CONTACT_TO=tinbobangba@gmail.com
```

SMTP (optionnel) : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.

`NEXT_PUBLIC_SITE_URL` est lu au **build**. Après l’avoir définie, lancez un **nouveau build**.

### 6. Premier déploiement

1. **Démarrer le build** (source Git, dépôt + branche).
2. Attendre l’état `completed`.
3. Ouvrir `https://votre-domaine.com/fr`.

Les push suivants sur la branche liée relancent le build si le déploiement automatique est activé.

### Points d’attention

- Ne pas déployer comme site PHP statique : le formulaire et le routing `/fr` `/en` ont besoin du serveur Next.js.
- `MYSQL_HOST` reste `127.0.0.1` sur Hostinger.
- Ne jamais committer `.env.local`.
