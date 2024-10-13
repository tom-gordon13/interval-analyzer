# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /web-app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app (assuming you have a build script in your package.json)
RUN npm run build

EXPOSE 3001

# Define the command to serve the production build (using serve)
# CMD ["npx", "serve", "-s", "build", "-l", "3001"]
CMD ["npm", "start"]
