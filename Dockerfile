# Use the Node.js image
FROM node:16

# Set the working directory to the server folder
WORKDIR /app/server

# Copy the package.json and package-lock.json files
COPY ./server/package*.json ./

# Install dependencies
RUN npm install

# Copy the server source code into the container
COPY ./server .

# Expose the port that the server listens on
EXPOSE 3000

# Command to start the server
CMD ["npm", "start"]
