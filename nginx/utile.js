//Voir les erreurs nginx
sudo nginx -t -c /etc/nginx/nginx.conf

Nginx Service Commands
======================
Starting Nginx
# /etc/init.d/nginx start
# service nginx start

Restarting Nginx
# /etc/init.d/nginx restart
# service nginx restart

Stopping Nginx
# /etc/init.d/nginx stop
# service nginx stop
# nginx -s stop
# /usr/sbin/nginx -s stop

Status Nginx
# /etc/init.d/nginx status
# service nginx status

Reload Nginx
# /etc/init.d/nginx reload
# service nginx reload
# nginx -s reload

Nginx Graceful
# nginx -s quit


Nginx Important Files
=====================
Nginx Syntax check
# nginx -t
# nginx -t -c /etc/nginx/nginx.conf

Nginx Web root
# /usr/share/nginx/html - default
# /usr/share/nginx/ - New domain location

Nginx Config file's
# /etc/nginx/nginx.conf
# /etc/nginx/sites-available
# /etc/nginx/sites-enabled

Complied Nginx Modules
# nginx -V
# 2>&1 nginx -V | tr -- - '\n' | grep _module

Nginx log file's
# /var/log/nginx/access.log
# /var/log/nginx/error.log

Enable / Disable Virtual Hosts
# sudo ln -s /etc/nginx/sites-available/xxx.com /etc/nginx/sites-enabled/xxx.com
