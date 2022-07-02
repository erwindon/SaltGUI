# Separate SaltGUI host

In some specific environments you might not be able to serve SaltGUI directly from salt-api.
In that case you might want to configure a web server (for example NGINX) to serve SaltGui
and use it as proxy to salt-api so that requests are answered from the same origin from the browser point of view.

Sample NGINX configuration might look like this:

```
server {
  listen       80;
  server_name  _;
  root         /data/www;
  index        index.html;

  # handle internal api (proxy)
  location /api/ {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://saltmaster-local:3333/;
      proxy_ssl_session_reuse off;
      proxy_set_header Host $http_host;
      proxy_redirect off;
  }

  # handle saltgui web page
  location / {
    try_files $uri /index.html;
  }

}
```

The value of the `API_URL` in the `config.js` file must point to path where salt-api is exposed.
The value of the `NAV_URL` in the `config.js` file must point to path where the SaltGUI application is exposed.

```
const config = {
  API_URL: '/api',
  NAV_URL: '/app'
};
```

Note that the main page of SaltGUI is then located at `/app/`. When you want `/app` to work as well, you should instruct an intermediate proxy server to translate `/app` into `/app/`.

> Currently you can't use totally independent salt-api without proxy as support for CORS preflight request is not properly support.
