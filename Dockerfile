FROM node:14.16.1-alpine3.13
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN npm install
COPY . ./
ENV PORT 3001
EXPOSE 3001
CMD ["node", "src/app.js"]