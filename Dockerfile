# Step 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Accept the API Key as a build argument
ARG GEMINI_API_KEY

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Write the API Key into the .env.local file
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Build the project
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the built files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
