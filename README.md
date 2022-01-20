# Welcome to the GitHub page of the Squatch
#### This discord bot is designed to attempt to replace all of those bots in your Discord server.

# Main contributor
* Nez#681 (933774639900033055)

# Customize the bot
You can customize all of the related channel ids at [/config/constants/channel.json](https://github.com/MrXez/Squatch/blob/main/config/constants/channel.json) and you can customize all of the related role ids at [/config/constants/roles.json](https://github.com/MrXez/Squatch/blob/main/config/constants/roles.json).

If you decide to keep the pcbuildhelp.js file at [/events/pcbuildhelp.js](https://github.com/MrXez/Squatch/tree/main/events/pcbuildhelp.js) then you will need to add an API key at [/config/constants/api.json](https://github.com/MrXez/Squatch/blob/main/config/constants/api.json). You must enter in the correct id's for everything at [/config/constants/](https://github.com/MrXez/Squatch/tree/main/config/constants) And you must also add a few ID's at [/config/ticket/ticket.json](https://github.com/MrXez/Squatch/tree/main/config/ticket/ticket.json).

To add your bots token, you can add the token at [/config/credentials.env](https://github.com/MrXez/Squatch/blob/main/config/credentials.env). To change some other things about the bot you can change it at [/config/main.json](https://github.com/MrXez/Squatch/blob/main/config/main.json). To change the bots presence you can edit it at [/events/ready.js](https://github.com/MrXez/Squatch/blob/main/events/ready.js).

# [Pull requests](https://github.com/MrXez/Squatch/pulls)
If you decided to help out with the bot and you found a few lines of code that could cause a problem or think you have a better way of doing something then you're more then welcome to create a pull request and show the code you would like to change and explain the difference.

# To-Do

* Make a verify command so users can recieve a new verification image

* Add leveling

* Add a ghost ping detecter to the bot 






# [Issues](https://github.com/MrXez/Squatch/issues)
If you found any issues that are related to the bot, then you can create an [issue](https://github.com/MrXez/Squatch/issues).

# Currently Known Issues
* im trying to figure out how to get deletemsg.js to work since it requires discord links to delete the messages
* the verification code stopped automatically giving the selected role to the bots when they join, so pratically bots cant bypass the verification anymore



# How to install the bot
* If you don't have [**Node.js**](https://nodejs.org/en/) then install the latest node version first.

* Download the bot's code from here[GitHub page](https://github.com/MrXez/Squatch/archive/refs/heads/main.zip).

* Extract the zip file.

* After extraction, open the folder and then open command promp in the codes directory.

* Once you're in the command prompt run the command `npm install`

* **Add all of the necessary information in the config file**

# If you use git then run these following commands.

```
git clone https://github.com/MrXez/Squatch

cd Squatch

npm install

npm start
```



# How to invite the bot to your discord server

* https://discord.com/oauth2/authorize?client_id=clientid&permissions=permissionlevel&scope=applications.commands%20bot

* use [This website](https://discordapi.com/permissions.html) to caculate the permission needed - i usually use 8 (administrator perms)

* please make sure you put your bots client id and the permission level in the correct places
