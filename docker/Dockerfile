### Build ###

FROM ubuntu:14.04 as builder

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN npm i && mkdir /ecopanier && cp -R ./node_modules ./ecopanier

WORKDIR /ecopanier

COPY . /src

RUN $(npm bin)/ng build --prod


### Setup nginx ###

FROM nginx:1.13.3
 
COPY nginx/ecopanier.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]	

COPY --from=builder /ecopanier/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]