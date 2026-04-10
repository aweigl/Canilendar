FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY web/support.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets

EXPOSE 80

