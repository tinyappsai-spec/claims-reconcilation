# Use official Node image
FROM node:20-alpine

WORKDIR /app

# Copy package.json first for caching
COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
