#Socket-Server.Dockerfile
#Specificerar hur en docker-baserad server kan starta och köra socket-servern som används för mulitplayer-/flerspelarläge.
#WIP - Work In Progress!
FROM node:bullseye-slim
#Kopiera saker och ting
#Kopiera övrigt innehåll
WORKDIR /app
COPY . /app/
#Installera innehållet i appen
RUN npm install
#Kör appen
EXPOSE 3000
CMD [ "node", "server.js" ]

