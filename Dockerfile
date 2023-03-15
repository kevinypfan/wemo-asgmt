# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

ENV NODE_ENV=production
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
# RUN npm install glob rimraf
RUN npm install

EXPOSE 3000
# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
