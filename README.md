# What?

Tip The Scales is a simple dice rolling site that lets multiple users in a room see eachother's rolls in real time.
The gimmick is that users that know the password to a room may secretly cheat their own rolls.

# How?

Just go to tipthescales.fly.dev/[anyRoomNameYouWant] to enter or create a room.
There is no login, no options, nothing.
To invite people to your room, simply give them the URL.
Note that rooms are public and disposable. Anyone with the URL can view your rolls, and anyone with the password can cheat. When you're done with a room, just make another one.

# Why?

Maybe you're playing an RPG and want your DM to have carte blanche so they can spice the game up. Use however you want.
Do note that players will be clearly warned upon joining a room about potential cheating.

# Stack

Backend: Node.js, Express, Mongoose (MongoDB), JWT, Docker/Fly.io, WebSockets (Socket.io)

Frontend: React, React Router, Axios, Bootstrap, Styled-components, WebSockets (Socket.io Client)
