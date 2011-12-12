Show my public IP
=================

This is a small Node.js app that will show the HTTP client's IP, as seen by the Web server.  This also supports being run behind a reverse-proxy, if the X-Forwarded-For or X-Real-IP headers are set.  Can also be run directly on Heroku.

To run:

    sudo gem install foreman
    foreman start

or

    PORT=5000 node web.js

or

    heroku create --stack cedar

You'll get an HTTP server listening on the TCP port specified in the PORT environment variable, defaulting to 3000.

Best practice is to run this behind a proper Web server as a reverse proxy, such as Nginx, so that Node is not facing the public Internet.  This is what Heroku does internally.

If you're not running this on Heroku, here is a snippet to put in your Nginx config file that will reverse-proxy requests and set the needed header:

    location = /ip {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header  X-Real-IP  $remote_addr;
    }
