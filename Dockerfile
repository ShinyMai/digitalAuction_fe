#Base Image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
RUN npm run build

#Expose the application port
EXPOSE 4173

# Start the application
CMD ["npm", "run", "preview"]
