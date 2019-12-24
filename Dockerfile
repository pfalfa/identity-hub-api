####################################################################################
# How to :
# Build         : docker build -t pfalfa-ihub-api .
# Run           : docker run --name pfalfa-ihub-api -d -p 3003:3003 pfalfa-ihub-api
# Del Image     : docker image rm -f pfalfa-ihub-api
# Del Container : docker rm -f pfalfa-ihub-api
####################################################################################

FROM node:10

# setting the work directory
WORKDIR /app

# copy sources
COPY . .

# install dependencies
RUN npm install

# expose port
EXPOSE 3003

# execute
CMD ["node", "index.js"]
