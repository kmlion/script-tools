# Mise en place de Let's Encrypt sur serveur Ubuntu 16.04 Nginx lesateliersdepayet.fr


### Verifier l'accès au dossier /.well-known/acme-challenge par letsencrypt dans nginx 
\> /etc/nginx/sites-enabled/landing.conf
```sh
location ~ /\.well-known/acme-challenge {
        allow all;
    }
```
\> sudo service nginx restart
### Installer Let's Encrypt avec git 
```git
 sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
```
### Génerer automatiquement le certificat Let's Encrypt
```sh
/opt/letsencrypt/letsencrypt-auto certonly --rsa-key-size 4096 --webroot --webroot-path /home/kmlion/AgoraProject/ -d lesateliersdepayet.xyz
```
Le certificat se trouvera dans  > /etc/letsencrypt/live/lesateliersdepayet.xyz

### Modifier le fichier de conf nginx
\>  /etc/nginx/sites-enabled/lesateliersdepayet.conf
```sh
# Redirection http vers https

    server {
        listen 80;
        server_name lesateliersdepayet.xyz;
	location ~ /\.well-known/acme-challenge {
           allow all;
        }
        return 301 https://$server_name$request_uri;
    }

# Notre vrai bloc serveur
    server {

        # http2 pour Nginx
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name lesateliersdepayet.xyz;
        root /home/kmlion/AgoraProject;
        index index.php index.html index.htm;
        error_log /var/log/nginx/lesateliersdepayet.xyz.log notice;
        access_log off;

        ####    Locations
	# On cache les fichiers statiques
        location ~* \.(html|css|js|png|jpg|jpeg|gif|ico|svg|eot|woff|ttf)$ { expires max; }
        # On interdit les dotfiles
        location ~ /\. { deny all; }
        # config PHP
        location ~ \.php$ {
          fastcgi_pass unix:/run/php/php7.0-fpm.sock;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          include fastcgi_params;
          include snippets/fastcgi-php.conf;
        }
        # balancer la 404
        location / {
        try_files $uri $uri/ =404;
        }
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;

        #### SSL
        ssl on;
        ssl_certificate /etc/letsencrypt/live/lesateliersdepayet.xyz/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/lesateliersdepayet.xyz/privkey.pem;

        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/letsencrypt/live/lesateliersdepayet.xyz/fullchain.pem;
        # Google DNS, Open DNS, Dyn DNS
        resolver 8.8.8.8 8.8.4.4 208.67.222.222 208.67.220.220 216.146.35.35 216.146.36.36 valid=300s;
        resolver_timeout 3s;



        ####    Session Tickets
        # Session Cache doit avoir la même valeur sur tous les blocs "server".
        ssl_session_cache shared:SSL:100m;
        ssl_session_timeout 24h;
        ssl_session_tickets on;
        # [ATTENTION] il faudra générer le ticket de session.
        ssl_session_ticket_key /etc/nginx/ssl/ticket.key;

        # [ATTENTION] Les paramètres Diffie-Helman doivent être générés
        ssl_dhparam /etc/nginx/ssl/dhparam4.pem;



        ####    ECDH Curve
        ssl_ecdh_curve secp384r1;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        #Non valable sur IE6 et IE8 sur Windows XP 
        ssl_ciphers '*******************';

}

```
### Générer les clés pour le ticket de session et le cipher 
```sh
sudo openssl rand 48 -out /etc/nginx/ssl/ticket.key
sudo openssl dhparam -out /etc/nginx/ssl/dhparam4.pem 4096
```
### vérification et redémarrage Nginx
```sh
sudo nginx -t
#si ok
sudo service nginx restart

```
#### (Au cas ou) Changer le mot de passe principal pour le renouvellement du certificat
\> cd /opt/letsencrypt
```sh
sudo ./certbot-auto register --update-registration --email *****@****.***
```
