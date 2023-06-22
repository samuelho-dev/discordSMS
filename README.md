**Discord bot utilizing Discord.js, Twilio, Postgresql, Knex.js**

**Goals of this project**

- Create an interface to manage SMS marketing lists via Discord
- Simple setup - You just need to host the server + input the environment variables for twilio, the rest of the onboarding will be done via discord commands
- Easy modification - Commands have been abstracted to src/commands which allows any number of commands to be written and imported as long as the index.ts file is updated with the correct imports

**How to start**

1. Find a server host and sign up for twilio
2. Create a discord application via https://discord.com/developers/applications
3. Add the bot to your discord - you will only need the email & guild permission scopes.

- Here is an example url : https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=email%20guilds

4. Add all required env variables to your server host

```
TWILIO_ACCOUNT_SID=''
TWILIO_AUTH_TOKEN=''
DATABASE_URL=''
DISCORD_TOKEN=''
DISCORD_CLIENT_ID=''
DISCORD_GUILD_ID=''
```

3. After the bot has been hosted, account created, and bot added to your server then register your guild via discord bot commands

- /register & /update_phone_number
- Please make sure to follow local compliance laws when using this project
