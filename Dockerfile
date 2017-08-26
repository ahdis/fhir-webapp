FROM node
RUN apt-get update && apt-get install -y nginx && npm install -g ionic
RUN sed -i '\|root /var/www/html;|s|/var/www/html|/app/www|' /etc/nginx/sites-enabled/default
COPY . /app
WORKDIR /app
RUN npm install && ionic --no-interactive build --prod
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
