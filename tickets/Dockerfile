# Specify a base image
FROM node:alpine

# This creates the folder "app" inside "usr" inside the container
WORKDIR /app

# Copying the package.json on the container before installing
COPY package.json .
# Install some dependencies, just the ones that are prod, not the dev ones
RUN npm install --only=prod
# Once packages are installed, we copy the whole rest of the app to use our cache just for code changes
COPY . .

# Tell the image what to do when it starts as a container
CMD [ "npm", "start" ]
