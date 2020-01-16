FROM ubuntu:18.04


RUN apt-get update && \
    apt-get install -y nginx-extras luarocks git-core && \
    luarocks install auth0-nginx && \
    luarocks install lua-cjson && \
    luarocks install lua-resty-string && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
