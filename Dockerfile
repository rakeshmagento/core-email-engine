# Use the official Node.js runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle app source code
COPY . .

# Expose the application port
EXPOSE 3000

# Define the command to start your Node.js application
CMD [ "node", "src/index.js" ]
