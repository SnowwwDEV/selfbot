const config = require ("./config.json");
const prefix = config.prefix; // Note : Modifier le préfix par un prefix avec espace peut provoquer des bugs
const Discord = require("discord.js"); // https://www.npmjs.com/package/discord.js
const fetch = require("node-fetch"); // https://www.npmjs.com/package/node-fetch
const chalk = require ('chalk'); // https://www.npmjs.com/package/chalk
const hastebin = require('hastebin.js');
const haste = new hastebin({ /* url: 'hastebin.com */ });
const { reset, bold, dim, italic, underline, inverse, hidden, strikethrough, visible } = require('chalk'); // https://www.npmjs.com/package/chalk#modifiers
const { black, red, green, blue, yellow, cyan, magenta, white, grey, gray } = require('chalk'); // https://www.npmjs.com/package/chalk#colors
const { blackBright, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright } = require('chalk'); // https://www.npmjs.com/package/chalk#colors
const { bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGrey, bgGray } = require('chalk'); // https://www.npmjs.com/package/chalk#background-colors
const { bgBlackBright, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright } = require('chalk'); // https://www.npmjs.com/package/chalk#background-colors    

const bot = new Discord.Client();
const version = "3.9.0";
const canal = "Beta";


bot.login(config.token);


process.on('unhandledRejection', error => {
	console.error('unhandledRejection : ', error);
});

bot.on('ready', async () => {
    console.log(green("Selfbot démarré (En tant que ") + cyan(bot.user.tag) + green(")") + green("\nVersion : ") + cyan(version) + green(" (") + cyan(canal) + green(") ") + green("\nCrée par ") + cyan("Johan#8021") + green(" (") + cyan("https://johan-perso.carrd.co") + green(")"));
    bot.user.setActivity(config.statutDeJeuParDefaut, { type: "PLAYING" }); // Statut de jeu 
    console.log (yellow("[-----------------------------------------------]")); // Séparateur

    // Vérification de la version du bot
    const derniereVersion = await fetch ("https://raw.githubusercontent.com/anticoupable/selfbot/main/version.json")
    .then (res => res.json())
    .then (json => json.version);
    
    const dernierCanal = await fetch ("https://raw.githubusercontent.com/anticoupable/selfbot/main/version.json")
    .then (res => res.json())
    .then (json => json.canal);
   
    
    if(derniereVersion !== version || dernierCanal !== canal){
        console.log(red("Vous n'êtes pas à jour. | Dernière version du selfbot : ") + cyan(derniereVersion) + red(" (") + cyan(dernierCanal) + red(")") + red(". | Contactez ") + cyan("Johan#8021") + red(" sur Discord pour lui demandez la mise à jour.")); // Indicateur de mise à jour
        console.log (yellow("[-----------------------------------------------]")); // Séparateur
    }
    
    
    // Spamfarm automatique
    if(config.spamfarm === "auto"){
    bot.channels.get ("749970823435255880").send(prefix + "spamfarm"); // 749970823435255880 est l'id du salon de spamfarm sur le serveur d'Anti Coupable. | Début du spamfarm automatique    
    } else {
        // Ne rien faire si le spamfarm automatique est desactivé
    }
    
});
  
bot.on("message", async message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  
  
    if (config.ownerId.indexOf(message.author.id) === -1) return; // Ceci permet d'empêcher certaines personnes de faire certaines commande du bot
    if(!message.content.startsWith(prefix)) return; // Qu'on ne puissent pas mettre n'importe quoi comme prefix
    
    if(command === "hastebin" || command === "haste"){
         // Définition de CONTENU (Contenu du haste)
         var contenu = args.join(' ');
         
         // Vérification de CONTENU
         if(!contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Il est impossible de crée un hastebin vide.")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Il est impossible de crée un hastebin vide.") }} // Au cas où on ne met rien
         } else {
         }
         
        const lien = haste.post(contenu, "js").then(lien => {
            if(config.typeEnvoieMessage === "console"){ console.log(chalk.hex('#7e57c2')("[COMMAND]") + white(" Lien du hastebin : " + cyan(lien))); } else { if(config.typeEnvoieMessage === "salon"){ message.channel.send("Lien du hastebin : " + lien) }}
        }) // Création du lien et envoie de la réponse
            .catch(err => console.log(red("[ERROR]") + white(" Une erreur inconnue s'est produite lors de la création et/ou de l'envoie du hastebin"))) // En cas d'erreur
        console.log(magenta("[LOGS]") + white(" haste")) // Logs
       if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
    }

    if(command === "forcestop" || command === "stop" || command === "arret"){
        console.log (magenta("[LOGS]") + white(" forcestop")); // Log;
        bot.destroy() // Action (Eteindre le bot de force)
            .catch(err => { console.log(red("[ERROR]") + white(" Erreur lors de l'arrêt du bot")) }) // En cas d'erreur de l'arrêt du bot
        if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
        }
        
    if(command === "purge" || command === "clean" || command === "clear"){
         // Définition de CONTENU (Nombre)
         var contenu = args.join(' ');
         
         // Vérification de CONTENU (Vide ou non)
         if(!contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Il est logiquement impossible de supprimer 0 message.")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Il est impossible de supprimer 0 message.") }} // Au cas où on essaye de supprimer 0 message
         } else {
         }
         
         // Vérification de CONTENU (Nombre ou autre)
         if(isNaN(contenu)){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Ceci n'est pas un nombre.")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Ceci n'est pas un nombre.") }} // Au cas où on essaye de supprimer <Quelque chose qui n'est pas un nombre> message
         } else {
         }
         
         // Vérification de CONTENU (Moins de 1)
         if("1" > contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Valeur minimum : 1.")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Valeur minimum : 1.") }} // Au cas où on essaye de supprimer moins de 1 message
         } else {
         }
         
         // Vérification de CONTENU (Plus de 100)
         if("100" < contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Valeur maximum : 100.")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Valeur maximum : 100.") }} // Au cas où on essaye de supprimer moins de 1 message
         } else {
         }
        console.log (magenta("[LOGS]") + white(" purge")); // Log;
        if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
        message.channel.fetchMessages({ limit: contenu }).then(msgs=>msgs.filter(m => m.author.id === bot.user.id).map(r => r.delete())) // Suppression des messages
            .catch(err => console.log(red("[ERROR]") + white(" Une erreur inconnue s'est produite lors de la suppression des messages"))) // En cas d'erreur
        }
    
    if(command === "ping" || command === "pong"){
        console.log (magenta("[LOGS]") + white(" ping")); // Log;
        if(config.typeEnvoieMessage === "console"){ console.log(chalk.hex('#7e57c2')("[COMMAND]") + white(" Ping : " + cyan(bot.ping) + white(" ms"))); } else { if(config.typeEnvoieMessage === "salon"){ message.channel.send("Ping : " + bot.ping + " ms") }} // Réponse
        if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
        }
    
    if(command === "statut-game" || command === "statut"){
         // Définition de CONTENU (Prochain statut)
         var contenu = args.join(' ');
         
         // Vérification du nouveau statut
         if(!contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Il est logiquement impossible de mettre un statut vide")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Il est impossible de mettre un statut vide.") }} // Au cas où on essaye de mettre un statut qui n'existe pas
         } else { }
        console.log (magenta("[LOGS]") + white(" statut     ") + cyan(contenu)); // Log;
        if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
        bot.user.setActivity(contenu, { type: "PLAYING" }) // Changement du statut
            .catch(err => console.log(red("[ERROR]") + white(" Une erreur inconnue s'est produite lors du changement du statut"))) // En cas d'erreur
       } 
    
    if(command === "say" || command === "dire"){
         // Définition de CONTENU (Message a envoyé)
         var contenu = args.join(' ');
         
         // Vérification de CONTENU
         if(!contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Il est impossible d'envoyer un message vide")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Il est impossible d'envoyer un message vide.") }} // Au cas où on essaye d'envoyer rien du tout
         } else {
         }
        console.log (magenta("[LOGS]") + white(" say     ") + cyan(contenu)); // Log;
        message.channel.send(contenu)
            .catch(err => console.log(red("[ERROR]") + white(" Une erreur inconnue s'est produite lors de l'envoie du message"))) // En cas d'erreur
        if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
       }
    
    const clean = text => {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
};
    
    if (command === "eval"){
    var e = new Discord.RichEmbed();
    var code = args.join(" ");
        try {
      const code = `
        log=(...msg)=>{console.log(msg);return msg.join(" ");};${args.join(" ")}
      `.replace("process.env.TOKEN", "'Ptdr t ki :joy:'").replace("bot.user.token", "'Ptdr t ki :joy:'");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled).replace(config.token, "Ptdr t ki :joy:"), { code: "xl" });
    } catch (err) {
      message.channel.send(`Une erreur s'est produite :     \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
   console.log (magenta("[LOGS]") + white(" eval     ") + cyan(code)); // Log;
    }
    
    if (command === "spamfarm"){
      if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
        console.log (magenta("[LOGS]") + white(" spamfarm | Pour arrêter ceci, Arrêter le selfbot.")); // Log;
        
        // Définition du message final
        if(config.easyeventFinancement === "yes"){ var finalMessageEnd = "*pay <@277825082334773251> all" } else { var finalMessageEnd = "*dep all" } // Permet de définir FINALMESSAGEEND
        const finalMessageList = ["*dep all",finalMessageEnd] // Liste des messages final possible
        var finalMessage = finalMessageList[Math.floor(Math.random() * finalMessageList.length)] // Definition du message final
        
        // Envoie des messages
         bot.setInterval(()=>{
            message.channel.send("*work").then(msg => {
        setTimeout(() => {
          message.channel.send("*slut").then(msg => {
        setTimeout(() => {
          message.channel.send("*crime").then(msg => {
        setTimeout(() => {
          message.channel.send("*rob <@589717262957543426>").then(msg => {
        setTimeout(() => {
          message.channel.send(finalMessage).then(msg => {
        setTimeout(() => {
          message.channel.send("Aimez vous spamfarm ?")
        }, 5000);
      });
        }, 5000);
      });
        }, 5000);
      });
        }, 5000);
      });
        }, 5000);
      });
        }, 25000);
    }
    
    if (command === "spam"){
      if(message.channel.type === "dm" || message.channel.type === "group"){} else { if(message.guild.me.hasPermission("MANAGE_MESSAGES")){ message.delete() } else {}} // Supprimer le message d'invoquation (Mais vérifier les permissions)
     
        // Définition de CONTENU (Message a spam)
         var contenu = args.join(' ');
         
         // Vérification de CONTENU
         if(!contenu){
             if(config.typeEnvoieMessage === "console"){ return console.log(red("[WARN]") + white(" Contenu invalide. Il est impossible de spam un message vide")) } else { if(config.typeEnvoieMessage === "salon"){ return message.channel.send("[ERROR] Contenu invalide. Il est impossible de spam un message vide.") }} // Au cas où on essaye d'envoyer rien du tout
         } else {
         }
        console.log (magenta("[LOGS]") + white(" spam     ") + cyan(contenu)); // Log;
        
        // Envoie des messages
        message.channel.send(contenu).then(msg => {
        setTimeout(() => {
          message.channel.send(contenu).then(msg => {
        setTimeout(() => {
          message.channel.send(contenu).then(msg => {
        setTimeout(() => {
          message.channel.send(contenu).then(msg => {
        setTimeout(() => {
          message.channel.send(contenu).then(msg => {
        setTimeout(() => {
          message.channel.send(contenu).then(msg => {
        setTimeout(() => {
          message.channel.send(contenu);
        }, 500);
      });
        }, 500);
      });
        }, 500);
      });
        }, 500);
      });
        }, 500);
      });
        }, 500);
      });
    }
    
});
