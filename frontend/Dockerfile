FROM node:18-alpine AS build

WORKDIR /app

# 👇 ARG que vendrán desde docker-compose
ARG REACT_APP_API_HOST
ARG REACT_APP_API_PORT

# 👇 Las pasamos a ENV para que CRA las lea en npm run build
ENV REACT_APP_API_HOST=${REACT_APP_API_HOST}
ENV REACT_APP_API_PORT=${REACT_APP_API_PORT}

COPY package*.json ./
RUN npm install
COPY . .

# Aquí React ya ve REACT_APP_API_HOST y REACT_APP_API_PORT
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
