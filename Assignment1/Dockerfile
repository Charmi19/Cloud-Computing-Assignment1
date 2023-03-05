# The following code for this file is from Docker-Node-Environment-Variables pdf

FROM node

# Set basic AWS credentials and API Key variables
ENV AWS_ACCESS_KEY_ID XXID
ENV AWS_SECRET_ACCESS_KEY XXSECRET
ENV AWS_SESSION_TOKEN XXTOKEN
ENV NEWS_DATA_API_KEY YYKEY1
ENV CONSUMER_KEY YYKEY2
ENV CONSUMER_SECRET XXSECRET1
ENV ACCESS_TOKEN XXTOKEN1
ENV ACCESS_TOKEN_SECRET XXTOKEN1

# Copy the application folder inside the container
ADD . /Assignment1

# Set the default directory where CMD will execute
WORKDIR /Assignment1

#RUN sh vars.sh

# Install app dependencies
RUN npm install

# Expose port to outside world
EXPOSE 3000

# Set the default command to execute when creating a new container
CMD ["npm", "start"]