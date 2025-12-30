# Le J - Site Web Officiel 🤖

Bienvenue sur le dépôt officiel du site web **Le J**. Ce site permet d'inviter nos bots Discord, de rejoindre la communauté et de nous contacter facilement.

🌐 **Site en ligne :** [https://bot-lej.duckdns.org](https://bot-lej.duckdns.org)

## 🚀 Fonctionnalités

*   **Présentation des Bots** : Yako, VisionGiveaway, Lux Compta.
*   **Liens d'invitation** : Ajoutez les bots à votre serveur en un clic.
*   **Formulaire de Contact** : Système sécurisé (Honeypot + Captcha Math) avec envoi d'email via Nodemailer.
*   **Responsive Design** : Compatible Mobile, Tablette et PC.
*   **Mode Sombre** : Thème inspiré de Discord.

## 🛠️ Technologies Utilisées

*   **Frontend** : HTML5, CSS3, JavaScript (Vanilla).
*   **Backend** : Node.js, Express.js.
*   **Emailing** : Nodemailer.
*   **Déploiement** : VPS (Ubuntu), Nginx (Reverse Proxy), PM2 (Process Manager), Certbot (HTTPS).

## 📦 Installation Locale

1.  **Cloner le projet** :
    ```bash
    git clone https://github.com/VOTRE_PSEUDO/NOM_DU_PROJET.git
    cd site_bot
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Configurer l'environnement** :
    Créez un fichier `.env` à la racine et ajoutez-y vos identifiants email :
    ```env
    PORT=3000
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=votre_email@gmail.com
    EMAIL_PASS=votre_mot_de_passe_application
    ```

4.  **Lancer le serveur** :
    ```bash
    npm start
    ```
    Accédez au site sur `http://localhost:3000`.

## 🌍 Déploiement sur VPS (Résumé)

Si vous mettez à jour le site sur le VPS :

1.  **Récupérer les changements** (si vous utilisez Git sur le VPS) :
    ```bash
    cd /root/site_bot
    git pull
    ```
    *Ou transférez les fichiers modifiés via FileZilla.*

2.  **Redémarrer le serveur** :
    ```bash
    pm2 restart site-bot
    ```

## 🔒 Sécurité

*   **Honeypot** : Un champ caché piège les robots spammeurs.
*   **Captcha** : Une question mathématique simple protège le formulaire.
*   **HTTPS** : Site entièrement sécurisé via Let's Encrypt.
*   **Pare-feu** : Ports inutiles bloqués via UFW.

---
&copy; 2025 Le J. Tous droits réservés.
