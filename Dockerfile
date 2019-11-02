#########################################################################
# How to :
# Build : docker build -t pfalfa-ihub-api .
# Run : docker run --name pfalfa-ihub-api -d -p 3003:3003 pfalfa-ihub-api
#########################################################################

FROM node:10

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 3003
CMD ["npm", "run", "start"]
