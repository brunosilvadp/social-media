FROM node:latest

# Create app directory
RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY . /opt/app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3332

RUN npm install -g nodemon

# start app
CMD ["nodemon", "src/server.js"]