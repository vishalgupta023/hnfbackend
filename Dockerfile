# Use the Node.js image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the server listens on
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
