# BTIS

Site institutionnel bilingue (français / anglais) de Bangba Tinbo Intelligence et Stratégies.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## MySQL (Hostinger / phpMyAdmin)

La formule Hostinger n’offre pas PostgreSQL. Les demandes du formulaire sont enregistrées en MySQL.

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

- Email : bangbatinbo@gmail.com
- Téléphone : +33 7 55 82 16 84

Le formulaire enregistre la demande en MySQL. L’envoi SMTP est optionnel (`CONTACT_TO` par défaut : bangbatinbo@gmail.com).

Les articles vivent dans `content/insights`. Les opérations publiables vivent dans `content/operations`.
