Show my public IP
=================

This is a small Node.js app that will show the HTTP client's IP, as seen by the Web server.  This also supports being run behind a reverse-proxy, if the X-Forwarded-For or X-Real-IP headers are set.

To run:

sudo gem install foreman
foreman start

or

PORT=5000 node web.js

