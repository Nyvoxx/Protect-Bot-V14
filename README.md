  <h1>🛡️ Protect Bot</h1>
  <p>Un bot Discord puissant pour protéger votre serveur contre les raids et diverses attaques</p>
  
  [![Stars](https://img.shields.io/github/stars/Nekros-dsc/Protect-Bot?style=for-the-badge&logo=github)](https://github.com/Nekros-dsc/Protect-Bot/stargazers)
  [![Forks](https://img.shields.io/github/forks/Nekros-dsc/Protect-Bot?style=for-the-badge&logo=github)](https://github.com/Nekros-dsc/Protect-Bot/network/members)
  [![Discord](https://img.shields.io/discord/903043706410643496?color=5865F2&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/zM6ZN9UfRs)
  [![License](https://img.shields.io/github/license/Nekros-dsc/Protect-Bot?style=for-the-badge)](https://github.com/Nekros-dsc/Protect-Bot/blob/main/LICENSE)
  [![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/Nekros-dsc/Protect-Bot)
  [![Nodejs](https://img.shields.io/badge/node.js-v16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
</div>

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Déploiement Rapide](#-déploiement-rapide)
- [💻 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📚 Commandes](#-commandes)
- [🔒 Sécurité](#-sécurité)
- [📊 Statistiques](#-statistiques)
- [👥 Contribution](#-contribution)
- [📞 Support](#-support)
- [🏆 Crédits](#-crédits)
- [📜 Licence](#-licence)

## ✨ Fonctionnalités

### 🔰 Protection Avancée
- **🛡️ Anti-Raid**: Détection et blocage automatique des raids
- **🤖 Anti-Bot**: Protection contre les invasions de bots malveillants
- **🔗 Anti-Invite**: Bloque automatiquement les invitations Discord
- **💥 Anti-Mass Mentions**: Prévient le spam de mentions
- **⚡ Anti-Spam**: Limite intelligente des messages répétitifs
- **📝 Anti-Mass Create Channel**: Prévient la création massive de canaux

### 💼 Administration
- **🔒 Système de Whitelist**: Gestion facile des utilisateurs de confiance
- **✅ Permissions Avancées**: Contrôle précis des accès aux commandes
- **📊 Journalisation**: Enregistrement détaillé des actions et alertes
- **⏱️ Cooldowns**: Évite le spam de commandes avec des délais configurables

### 🧩 Interface
- **🎨 Embeds Personnalisés**: Messages élégants avec couleurs personnalisables
- **⚙️ Configuration Intuitive**: Facile à configurer via des commandes dédiées
- **🌐 Multi-serveurs**: Gestion de la protection sur plusieurs serveurs

## 🚀 Déploiement Rapide

[![Deploy to Replit](https://replit.com/badge/github/Nekros-dsc/Protect-Bot)](https://replit.com/github/Nekros-dsc/Protect-Bot)
[![Glitch](https://img.shields.io/badge/Glitch-Déployer-purple?style=for-the-badge&logo=glitch)](https://glitch.com/edit/#!/import/github/Nekros-dsc/Protect-Bot)
[![Railway](https://img.shields.io/badge/Railway-Déployer-black?style=for-the-badge&logo=railway)](https://railway.app/new/template/hUh5LC)

## 💻 Installation

```bash
# Cloner le repository
git clone https://github.com/Nekros-dsc/Protect-Bot.git

# Accéder au dossier
cd Protect-Bot

# Installer les dépendances
npm install

# Configurer le bot (modifiez config.json)
nano config.json

# Démarrer le bot
node index.js
```

## ⚙️ Configuration

Modifiez le fichier `config.json` avec vos informations:

```js
{
    "token": "TOKEN",
    "prefix": "PREFIX",
    "color": "PURPLE",
    "owner": [
        "ID OWNER"
    ]
}
```

## 📚 Commandes

| Commande | Description | Utilisation |
|----------|-------------|-------------|
| `!help` | Affiche la liste des commandes disponibles | `!help [commande]` |
| `!ping` | Affiche la latence du bot | `!ping` |
| `!whitelist add` | Ajoute un utilisateur à la whitelist | `!whitelist add @utilisateur` |
| `!whitelist remove` | Retire un utilisateur de la whitelist | `!whitelist remove @utilisateur` |
| `!antiraid` | Configure les paramètres anti-raid | `!antiraid on/off/max/config` |
| `!setup` | Assistant de configuration rapide | `!setup` |

## 🔒 Sécurité

Protect Bot utilise des algorithmes avancés pour détecter les comportements suspects:

- 🔍 **Détection de patterns anormaux**: Identifie les actions suspectes en temps réel
- ⏱️ **Analyse temporelle**: Surveille la fréquence des actions pour détecter les comportements malveillants
- 🧠 **Système d'apprentissage**: S'adapte aux nouveaux types d'attaques

## 👥 Contribution

Les contributions sont les bienvenues! Voici comment participer:

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'feat: ajout d'une fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📞 Support

Besoin d'aide? Rejoignez notre [serveur Discord](https://discord.gg/zM6ZN9UfRs) pour obtenir de l'assistance!

## 🏆 Crédits

Ce projet est basé sur [Protect-Bot](https://github.com/Nekros-dsc/Protect-Bot) créé par [Nekros-dsc](https://github.com/Nekros-dsc).

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](https://github.com/Nekros-dsc/Protect-Bot/blob/main/LICENSE) pour plus de détails.

---

<div align="center">
  <p>Fait avec ❤️ par <a href="https://github.com/Nekros-dsc">Nekros-dsc</a></p>
  <p>© 2025 Protect Bot - Tous droits réservés</p>
</div>
